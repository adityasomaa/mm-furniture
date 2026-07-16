# -*- coding: utf-8 -*-
"""
One-off: turns the owner's catalogue spreadsheet into .cache/catalog-raw.json.

Kept in Python because the source of truth is an .xlsx and openpyxl reads it directly;
the image half of the pipeline stays in Node with the rest of the build.

Decisions encoded here, all of them from the owner rather than guessed:
  - The 18 rows with a blank Kategori are 17 Buffets and 1 Partisi. Buffets go to
    Ruang Makan, the Partisi to Ruang Tamu.
  - "Ruang Tidur" (4 benches) and "Kamar Tidur" (58) are the same room. Merged.
  - Prices are blank on all 227 rows. They stay blank. Nothing invents one.

Products are matched to their asset folder by the numeric prefix of the product ID
(FUR-001 -> "1_..."), and the image list is taken from what is ACTUALLY on disk rather
than from the spreadsheet's filename column, which disagrees with the folders in places
(e.g. folder 102_Kursi_Makan_Anyaman_Tali holds files named ..._Anyaman_Twist_1.jpg).
"""
import json
import os
import re
import unicodedata

import openpyxl

DROP = r"C:\Users\User\Downloads\ASET WEBSITE BARU MM FURNITURE"
XLSX = os.path.join(DROP, "Template_Pemetaan_Katalog_Furniture.xlsx")
ASSETS = os.path.join(DROP, "Katalog Website No BG")
OUT = os.path.join("..", ".cache", "catalog-raw.json")

# Room key -> canonical slug. The owner's own labels, not invented ones.
ROOM_SLUG = {
    "Kamar Tidur": "kamar-tidur",
    "Ruang Tidur": "kamar-tidur",  # same room, two spellings in the sheet
    "Ruang Makan": "ruang-makan",
    "Ruang Tamu": "ruang-tamu",
    "Bar": "bar",
    "Outdoor": "outdoor",
    "Vanity": "vanity",
}


def slugify(s):
    s = unicodedata.normalize("NFKD", str(s))
    s = s.encode("ascii", "ignore").decode()
    s = re.sub(r"[_\s]+", "-", s.strip().lower())
    s = re.sub(r"[^a-z0-9-]", "", s)
    return re.sub(r"-{2,}", "-", s).strip("-")


def titleise(name):
    """Dipan_Model_Salsa -> Dipan Model Salsa. Underscores are the sheet's word breaks."""
    return re.sub(r"\s+", " ", str(name).replace("_", " ")).strip()


def parse_dim(d):
    """'180x200x110' -> {l,w,h} in cm. Returns None when the sheet left it blank."""
    if not d:
        return None
    parts = re.findall(r"\d+(?:[.,]\d+)?", str(d))
    if len(parts) != 3:
        return None
    l, w, h = (float(p.replace(",", ".")) for p in parts)
    return {"l": l, "w": w, "h": h}


def main():
    wb = openpyxl.load_workbook(XLSX, data_only=True)
    ws = wb["Data Katalog"]
    rows = [r for r in list(ws.iter_rows(values_only=True))[1:] if r and r[0]]

    # Folder index keyed by leading number, so FUR-001 finds "1_Dipan_Model_Salsa".
    folders = {}
    for d in os.listdir(ASSETS):
        if not os.path.isdir(os.path.join(ASSETS, d)):
            continue
        m = re.match(r"^(\d+)_", d)
        if m:
            folders[int(m.group(1))] = d

    products = {}
    order = []
    for r in rows:
        pid = str(r[0]).strip()
        if pid not in products:
            order.append(pid)
            products[pid] = {
                "id": pid,
                "rawName": r[1],
                "rawCat": r[2],
                "price": r[3],
                "material": (str(r[4]).strip() if r[4] else None),
                "dim": parse_dim(r[5]),
                "rawDim": (str(r[5]).strip() if r[5] else None),
                "desc": (str(r[6]).strip() if r[6] else None),
            }

    out = []
    unresolved = []
    for pid in order:
        p = products[pid]
        num = int(re.sub(r"\D", "", pid))
        folder = folders.get(num)
        if not folder:
            unresolved.append(pid)
            continue

        files = sorted(
            f
            for f in os.listdir(os.path.join(ASSETS, folder))
            if f.lower().endswith((".png", ".jpg", ".jpeg"))
        )
        if not files:
            unresolved.append(pid)
            continue

        cat = p["rawCat"]
        name = titleise(p["rawName"])
        if not cat:
            # Owner's call: Buffets are dining-room pieces, the lone Partisi is a
            # living-room piece.
            cat = "Ruang Tamu" if name.lower().startswith("partisi") else "Ruang Makan"

        room = ROOM_SLUG.get(cat)
        if not room:
            unresolved.append(pid + " (unknown room: %s)" % cat)
            continue

        out.append(
            {
                "id": pid,
                "slug": slugify(p["rawName"]),
                "name": name,
                "room": room,
                "material": p["material"],
                "dim": p["dim"],
                "rawDim": p["rawDim"],
                "desc": p["desc"],
                "folder": folder,
                "files": files,
            }
        )

    # Slugs become URLs, so a collision would silently make one product unreachable.
    seen = {}
    for p in out:
        seen.setdefault(p["slug"], []).append(p["id"])
    dupes = {s: ids for s, ids in seen.items() if len(ids) > 1}

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)

    rooms = {}
    for p in out:
        rooms[p["room"]] = rooms.get(p["room"], 0) + 1

    print("products:", len(out), "| images:", sum(len(p["files"]) for p in out))
    print("rooms:", json.dumps(rooms, indent=1))
    print("with dimensions:", sum(1 for p in out if p["dim"]), "/", len(out))
    print("with description:", sum(1 for p in out if p["desc"]), "/", len(out))
    print("with material:", sum(1 for p in out if p["material"]), "/", len(out))
    # Checked against the SOURCE rows, not `out`: price is deliberately never carried
    # into the output, so checking `out` would always report 0 and prove nothing. If the
    # owner ever fills the column in, this is the line that will say so.
    priced = sum(1 for pid in order if products[pid]["price"])
    print("priced rows in the sheet:", priced, "/", len(order), "(0 = keep saying nothing about price)")
    if dupes:
        print("\nSLUG COLLISIONS (these would collide as URLs):")
        for s, ids in dupes.items():
            print("  ", s, "->", ids)
    if unresolved:
        print("\nUNRESOLVED:", unresolved)
    print("\nwrote", OUT)


if __name__ == "__main__":
    main()
