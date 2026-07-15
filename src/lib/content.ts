import type { Locale } from './site';

/**
 * All user-facing copy, keyed by locale so the two languages can never drift apart.
 *
 * Voice rules (see PRODUCT.md): workshop-floor, matter-of-fact, unembarrassed about
 * price. No "curated", "timeless", "elegance", "passion". No em dashes. No claims that
 * are not verifiable from the legacy site.
 */
export type L<T = string> = Record<Locale, T>;

export const nav: { key: string; href: L; label: L }[] = [
  { key: 'home', href: { id: '/', en: '/en' }, label: { id: 'Beranda', en: 'Home' } },
  { key: 'about', href: { id: '/about', en: '/en/about' }, label: { id: 'Tentang', en: 'About' } },
  { key: 'catalog', href: { id: '/catalog', en: '/en/catalog' }, label: { id: 'Katalog', en: 'Catalogue' } },
  { key: 'blog', href: { id: '/blog', en: '/en/blog' }, label: { id: 'Blog', en: 'Blog' } },
  { key: 'contact', href: { id: '/contact', en: '/en/contact' }, label: { id: 'Kontak', en: 'Contact' } },
];

/** Footer-only routes. Kept out of `nav` so the header stays to five links. */
export const legalNav: { key: string; href: L; label: L }[] = [
  {
    key: 'privacy',
    href: { id: '/privacy', en: '/en/privacy' },
    label: { id: 'Kebijakan Privasi', en: 'Privacy Policy' },
  },
  {
    key: 'terms',
    href: { id: '/terms', en: '/en/terms' },
    label: { id: 'Ketentuan Hukum', en: 'Legal Terms' },
  },
];

export const ui = {
  skipToContent: { id: 'Lompat ke konten utama', en: 'Skip to main content' },
  menu: { id: 'Menu', en: 'Menu' },
  close: { id: 'Tutup', en: 'Close' },
  whatsapp: { id: 'Chat WhatsApp', en: 'Chat on WhatsApp' },
  viewCatalog: { id: 'Lihat katalog', en: 'View the catalogue' },
  photoCount: { id: 'foto', en: 'photos' },
  allCategories: { id: 'Semua kategori', en: 'All categories' },
  backToCatalog: { id: 'Kembali ke katalog', en: 'Back to the catalogue' },
  home: { id: 'Beranda', en: 'Home' },
  languageLabel: { id: 'Bahasa', en: 'Language' },
  askAboutThis: { id: 'Tanya soal item ini', en: 'Ask about this piece' },
  openInMaps: { id: 'Buka di Maps', en: 'Open in Maps' },
  enquire: { id: 'Enquire', en: 'Enquire' },
  loading: { id: 'Memuat', en: 'Loading' },
} satisfies Record<string, L>;

export const home = {
  metaTitle: {
    id: 'MM Furniture Globalindo — Furnitur Kelas Ekspor dari Bali',
    en: 'MM Furniture Globalindo — Export-Grade Furniture from Bali',
  },
  metaDescription: {
    id: 'Produsen furnitur dan kontraktor interior di Bali. Sofa, kursi, meja, bed, dan almari dikerjakan di workshop kami di Denpasar. Kualitas ekspor, harga bersahabat. Showroom di Sunset Road, Kuta.',
    en: 'Furniture maker and interior fit-out contractor in Bali. Sofas, chairs, tables, beds and storage built in our Denpasar workshop. Export quality at an affordable price. Showroom on Sunset Road, Kuta.',
  },

  heroKicker: { id: 'Denpasar · Bali · Indonesia', en: 'Denpasar · Bali · Indonesia' },
  heroTitle: {
    id: 'Furnitur kelas ekspor, dikerjakan di Bali.',
    en: 'Export-grade furniture, built in Bali.',
  },
  heroBody: {
    id: 'Workshop kami di Denpasar Barat mengerjakan sofa, kursi, meja, bed, dan almari untuk rumah, vila, kantor, dan proyek interior. Standar konstruksinya dibuat untuk lolos ekspor. Harganya tetap masuk akal.',
    en: 'Our workshop in Denpasar Barat builds sofas, chairs, tables, beds and storage for homes, villas, offices and interior projects. Built to a standard that clears export. Priced so it still makes sense.',
  },
  heroPhotoAlt: {
    id: 'Sofa rangka kayu dengan dudukan empuk, difoto di showroom MM Furniture',
    en: 'A timber-framed sofa with upholstered seating, photographed in the MM Furniture showroom',
  },

  // The three facts a buyer actually checks. All verified.
  proofLabel: { id: 'Yang bisa dicek', en: 'What you can check' },
  proof: {
    id: [
      { k: 'Workshop sendiri', v: 'Produksi dikerjakan di tempat kami di Denpasar Barat, bukan dioper ke pihak ketiga.' },
      { k: 'Showroom fisik', v: 'Jl. Sunset Road 71, Kuta. Datang, duduk di sofanya, cek jahitan dan sambungannya.' },
      { k: 'Custom dilayani', v: 'Ukuran, bahan, dan finishing bisa menyesuaikan gambar kerja atau contoh yang Anda bawa.' },
    ],
    en: [
      { k: 'Our own workshop', v: 'Production happens at our place in Denpasar Barat. It is not handed to a third party.' },
      { k: 'A real showroom', v: 'Jl. Sunset Road 71, Kuta. Come sit on the sofa, check the stitching and the joinery.' },
      { k: 'Custom is normal', v: 'Sizes, materials and finishes follow your drawings or the sample you bring in.' },
    ],
  },

  catalogKicker: { id: 'Katalog', en: 'Catalogue' },
  catalogTitle: { id: 'Tujuh kategori. Semua dari workshop yang sama.', en: 'Seven categories. All out of the same workshop.' },
  catalogBody: {
    id: 'Foto di bawah ini diambil dari barang yang benar-benar kami kerjakan, bukan render. Kalau ada yang cocok, kirim fotonya lewat WhatsApp dan kami balas dengan ukuran dan harganya.',
    en: 'The photographs below are of pieces we actually built, not renders. If something fits, send us the photo on WhatsApp and we will come back with sizes and a price.',
  },

  servicesKicker: { id: 'Interior', en: 'Interior' },
  servicesTitle: { id: 'Bukan cuma isi ruangan. Kami kerjakan ruangannya.', en: 'Not just what goes in the room. The room itself.' },
  servicesBody: {
    id: 'Untuk kantor dan ruang komersial, kami menangani pekerjaan interior dari desain sampai barang terpasang di tempat.',
    en: 'For offices and commercial spaces we take interior work from design through to installed on site.',
  },
  services: {
    id: [
      { k: 'Desain interior', v: 'Gambar kerja, tata letak, dan pemilihan material untuk ruang kerja dan komersial.' },
      { k: 'Pengadaan barang & jasa', v: 'Kami carikan, kami koordinasikan, kami yang tanggung jadwalnya.' },
      { k: 'Fit-out kantor & komersial', v: 'Pemasangan di lokasi sampai ruangan siap dipakai.' },
    ],
    en: [
      { k: 'Interior design', v: 'Drawings, layouts and material selection for workspaces and commercial rooms.' },
      { k: 'Goods & service procurement', v: 'We source it, we coordinate it, and the schedule is ours to hold.' },
      { k: 'Office & commercial fit-out', v: 'Installation on site until the room is ready to use.' },
    ],
  },

  workshopKicker: { id: 'Dua alamat', en: 'Two addresses' },
  workshopTitle: { id: 'Satu tempat untuk melihat. Satu tempat untuk membuat.', en: 'One place to look. One place where it gets made.' },
  workshopBody: {
    id: 'Showroom dan workshop kami terpisah, dan dua-duanya bisa Anda datangi. Banyak penjual furnitur di Bali cuma punya yang pertama.',
    en: 'Our showroom and our workshop are separate places, and you can visit both. Plenty of furniture sellers in Bali only have the first one.',
  },

  ctaTitle: { id: 'Kirim ukurannya. Kami balas dengan harganya.', en: 'Send us the sizes. We will come back with a price.' },
  ctaBody: {
    id: 'Foto referensi, sketsa di kertas, atau gambar kerja lengkap. Semuanya kami terima lewat WhatsApp.',
    en: 'A reference photo, a sketch on paper, or a full drawing set. All of it works over WhatsApp.',
  },
} as const;

export const about = {
  metaTitle: {
    id: 'Tentang MM Furniture Globalindo — Workshop Furnitur di Denpasar, Bali',
    en: 'About MM Furniture Globalindo — Furniture Workshop in Denpasar, Bali',
  },
  metaDescription: {
    id: 'MM Furniture Globalindo adalah produsen furnitur dan penyedia solusi interior di Bali, dengan workshop di Denpasar Barat dan showroom di Sunset Road, Kuta.',
    en: 'MM Furniture Globalindo is a furniture maker and interior solutions provider in Bali, with a workshop in Denpasar Barat and a showroom on Sunset Road, Kuta.',
  },
  title: { id: 'Kami membuat furnitur di Bali dan mengirimkannya ke mana saja.', en: 'We make furniture in Bali and we send it wherever it needs to go.' },
  lede: {
    id: 'MM Furniture Globalindo menggabungkan pengerjaan tangan dengan mesin dan alat ukur modern. Hasilnya furnitur yang konstruksinya siap ekspor, dengan harga yang masih bisa dipakai bersaing di pasar lokal maupun luar.',
    en: 'MM Furniture Globalindo combines hand work with modern machinery and measurement. The result is furniture built to clear export, at a price that still competes at home and abroad.',
  },
  bodyTitle: { id: 'Cara kami bekerja', en: 'How we work' },
  values: {
    id: [
      { k: 'Profesional', v: 'Pekerjaan dipegang orang yang tahu sambungan mana yang akan lepas dalam dua tahun, dan menghindarinya.' },
      { k: 'Tepat waktu', v: 'Jadwal yang kami sepakati adalah jadwal yang kami pegang. Kalau meleset, Anda dengar dari kami lebih dulu.' },
      { k: 'Evaluasi detail', v: 'Setiap proyek diperiksa per bagian sebelum keluar dari workshop.' },
      { k: 'Bentuk dan fungsi', v: 'Barangnya harus enak dilihat dan tetap enak dipakai setelah lima tahun.' },
      { k: 'Berkelanjutan', v: 'Material dan sisa produksi dikelola supaya tidak terbuang percuma.' },
      { k: 'Kemitraan', v: 'Harga yang wajar untuk dua pihak lebih berguna daripada satu transaksi bagus.' },
    ],
    en: [
      { k: 'Professional', v: 'The work is held by people who know which joint fails in two years, and avoid it.' },
      { k: 'On schedule', v: 'The date we agree is the date we hold. If it slips, you hear it from us first.' },
      { k: 'Detailed evaluation', v: 'Every project is checked part by part before it leaves the workshop.' },
      { k: 'Form and function', v: 'It has to look right, and still work five years in.' },
      { k: 'Sustainable', v: 'Materials and offcuts are managed so they do not go to waste.' },
      { k: 'Partnership', v: 'A fair price on both sides is worth more than one good transaction.' },
    ],
  },
} as const;

export const catalog = {
  metaTitle: {
    id: 'Katalog Furnitur — Sofa, Kursi, Meja, Bed, Almari | MM Furniture Bali',
    en: 'Furniture Catalogue — Sofas, Chairs, Tables, Beds, Storage | MM Furniture Bali',
  },
  metaDescription: {
    id: 'Katalog furnitur MM Furniture Globalindo: sofa, kursi, meja, set meja, desk, bed, rak dan almari. Foto asli dari workshop kami di Denpasar, Bali. Custom dilayani.',
    en: 'The MM Furniture Globalindo catalogue: sofas, chairs, tables, table sets, desks, beds, shelving and storage. Real photographs from our Denpasar workshop in Bali. Custom orders welcome.',
  },
  title: { id: 'Katalog', en: 'Catalogue' },
  lede: {
    id: 'Semua foto di sini adalah barang yang keluar dari workshop kami. Tidak ada render, tidak ada foto stok. Ukuran, bahan, dan finishing bisa diubah sesuai kebutuhan.',
    en: 'Every photograph here is a piece that came out of our workshop. No renders, no stock photography. Sizes, materials and finishes can all change to suit the job.',
  },
  emptyCategory: {
    id: 'Foto untuk kategori ini sedang kami siapkan. Hubungi kami lewat WhatsApp dan kami kirimkan yang terbaru.',
    en: 'Photographs for this category are being prepared. Message us on WhatsApp and we will send the latest.',
  },
  categoryLede: {
    id: 'Foto asli dari workshop dan showroom kami. Ada yang cocok? Kirim nomor fotonya lewat WhatsApp.',
    en: 'Real photographs from our workshop and showroom. Something fit? Send us the photo number on WhatsApp.',
  },
} as const;

export const contact = {
  metaTitle: {
    id: 'Kontak MM Furniture Globalindo — Showroom Kuta & Workshop Denpasar',
    en: 'Contact MM Furniture Globalindo — Kuta Showroom & Denpasar Workshop',
  },
  metaDescription: {
    id: 'Hubungi MM Furniture Globalindo. WhatsApp +62 878-6165-4856. Showroom Jl. Sunset Road 71, Kuta, Badung. Workshop Jl. Pulau Ayu Dalam 15, Denpasar Barat, Bali.',
    en: 'Contact MM Furniture Globalindo. WhatsApp +62 878-6165-4856. Showroom at Jl. Sunset Road 71, Kuta, Badung. Workshop at Jl. Pulau Ayu Dalam 15, Denpasar Barat, Bali.',
  },
  title: { id: 'Kontak', en: 'Contact' },
  lede: {
    id: 'Cara tercepat adalah WhatsApp. Kirim foto atau ukuran, dan kami balas dengan perkiraan harga dan waktu pengerjaan.',
    en: 'WhatsApp is the fastest route. Send a photo or the sizes and we will come back with an estimate and a lead time.',
  },
  phoneLabel: { id: 'Telepon & WhatsApp', en: 'Phone & WhatsApp' },
  emailLabel: { id: 'Email', en: 'Email' },
  socialLabel: { id: 'Media sosial', en: 'Social' },
  visitLabel: { id: 'Datang langsung', en: 'Visit us' },
} as const;

/**
 * FAQ copy does double duty: it renders as a real accordion for humans and serialises to
 * FAQPage JSON-LD for search and AI answer engines. Answers are written to be quotable
 * standalone, because an answer engine will lift one without its surrounding context.
 */
export const faq: { q: L; a: L }[] = [
  {
    q: { id: 'Apa itu MM Furniture Globalindo?', en: 'What is MM Furniture Globalindo?' },
    a: {
      id: 'MM Furniture Globalindo adalah produsen furnitur dan penyedia solusi interior yang berbasis di Bali, Indonesia. Perusahaan ini mengerjakan sofa, kursi, meja, set meja, desk, bed, rak, dan almari di workshop sendiri di Denpasar Barat, serta menangani desain interior, pengadaan barang dan jasa, dan fit-out kantor dan ruang komersial. Showroom-nya berada di Jl. Sunset Road 71, Kuta, Badung, Bali.',
      en: 'MM Furniture Globalindo is a furniture manufacturer and interior solutions provider based in Bali, Indonesia. It builds sofas, chairs, tables, table sets, desks, beds, shelving and storage in its own workshop in Denpasar Barat, and handles interior design, goods and service procurement, and office and commercial fit-out. Its showroom is at Jl. Sunset Road 71, Kuta, Badung, Bali.',
    },
  },
  {
    q: { id: 'Di mana lokasi MM Furniture?', en: 'Where is MM Furniture located?' },
    a: {
      id: 'MM Furniture Globalindo punya dua lokasi di Bali. Showroom dan kantornya di Jl. Sunset Road 71, Kuta, Badung. Workshop produksinya di Jl. Pulau Ayu Dalam 15, Denpasar Barat, Denpasar. Keduanya terbuka untuk dikunjungi.',
      en: 'MM Furniture Globalindo has two locations in Bali. The showroom and office are at Jl. Sunset Road 71, Kuta, Badung. The production workshop is at Jl. Pulau Ayu Dalam 15, Denpasar Barat, Denpasar. Both are open to visit.',
    },
  },
  {
    q: { id: 'Furnitur apa saja yang dibuat MM Furniture?', en: 'What furniture does MM Furniture make?' },
    a: {
      id: 'MM Furniture Globalindo membuat tujuh kategori furnitur: sofa, kursi, meja, set meja, desk, bed, serta rak dan almari. Semuanya dikerjakan di workshop sendiri di Denpasar Barat, Bali, untuk rumah, vila, kantor, dan proyek komersial.',
      en: 'MM Furniture Globalindo makes seven categories of furniture: sofas, chairs, tables, table sets, desks, beds, and shelving and storage. All of it is built in its own workshop in Denpasar Barat, Bali, for homes, villas, offices and commercial projects.',
    },
  },
  {
    q: { id: 'Apakah MM Furniture menerima pesanan custom?', en: 'Does MM Furniture take custom orders?' },
    a: {
      id: 'Ya. MM Furniture Globalindo menerima pesanan custom. Ukuran, material, dan finishing bisa menyesuaikan gambar kerja, sketsa, atau contoh yang Anda kirimkan. Cara tercepat memulai adalah mengirim foto atau ukuran lewat WhatsApp ke +62 878-6165-4856.',
      en: 'Yes. MM Furniture Globalindo accepts custom orders. Sizes, materials and finishes can follow your drawings, a sketch, or a sample you send. The fastest way to start is to send a photo or the dimensions over WhatsApp to +62 878-6165-4856.',
    },
  },
  {
    q: { id: 'Apakah MM Furniture menangani interior kantor?', en: 'Does MM Furniture handle office interiors?' },
    a: {
      id: 'Ya. Selain memproduksi furnitur, MM Furniture Globalindo menangani solusi interior terpadu: desain interior, pengadaan barang dan jasa, serta fit-out ruang kantor dan komersial sampai siap pakai.',
      en: 'Yes. Alongside manufacturing furniture, MM Furniture Globalindo delivers integrated interior solutions: interior design, goods and service procurement, and fit-out of office and commercial spaces through to ready to use.',
    },
  },
  {
    q: { id: 'Bagaimana cara menghubungi MM Furniture?', en: 'How do I contact MM Furniture?' },
    a: {
      id: 'Hubungi MM Furniture Globalindo lewat WhatsApp di +62 878-6165-4856 atau +62 878-6134-0445, atau email ke info@mmfurniture.com. Anda juga bisa datang ke showroom di Jl. Sunset Road 71, Kuta, Badung, Bali.',
      en: 'Contact MM Furniture Globalindo on WhatsApp at +62 878-6165-4856 or +62 878-6134-0445, or by email at info@mmfurniture.com. You can also visit the showroom at Jl. Sunset Road 71, Kuta, Badung, Bali.',
    },
  },
];

export const faqTitle: L = { id: 'Pertanyaan yang sering masuk', en: 'Questions we get' };
