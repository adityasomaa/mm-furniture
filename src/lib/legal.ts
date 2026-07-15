import type { Locale } from './site';
import { company, locations } from './site';

/**
 * Privacy policy and legal terms.
 *
 * Written to describe what this site and this business verifiably do, and nothing more.
 *
 * Specifically NOT included, because MM has not published them and inventing them would
 * be putting false statements in a legal document: company registration number, NPWP,
 * a governing-law clause naming a specific court, warranty periods, return windows,
 * delivery terms, and any Incoterms for export. Those need the owner's real details and
 * a lawyer's eye. The pages say plainly where terms are agreed per order instead of
 * inventing a policy the workshop never agreed to.
 */

export type Block = { h?: string; p?: string; ul?: string[] };

const updated = '2026-07-15';

export const legalUpdated = updated;

export const privacy: Record<Locale, { title: string; lede: string; body: Block[] }> = {
  id: {
    title: 'Kebijakan Privasi',
    lede: 'Ringkasnya: situs ini tidak melacak Anda kecuali Anda mengizinkan, dan kami tidak menjual data siapa pun.',
    body: [
      { h: 'Data yang situs ini simpan sendiri' },
      {
        p: 'Secara bawaan, situs ini tidak memasang cookie pelacak dan tidak menjalankan iklan. Satu-satunya hal yang selalu tersimpan di browser Anda adalah pilihan Anda pada banner persetujuan, disimpan di localStorage supaya kami tidak menanyakannya berulang kali. Itu berfungsi murni teknis dan tidak dikirim ke mana-mana.',
      },
      { h: 'Statistik kunjungan, hanya kalau diizinkan' },
      {
        p: 'Kalau Anda menekan "Izinkan", kami menyalakan Vercel Web Analytics. Layanan ini menghitung kunjungan tanpa cookie dan tanpa membuat profil, tapi tetap memproses alamat IP Anda di sisi server untuk membedakan satu kunjungan dari kunjungan lain. Karena itu kami menanyakannya lebih dulu. Kalau Anda menekan "Tidak usah", skrip itu tidak pernah dimuat sama sekali.',
      },
      { h: 'Kalau Anda menghubungi kami' },
      {
        p: 'Formulir tanya di situs ini tidak mengirim data ke server kami. Formulir itu hanya menyusun pesan lalu membuka WhatsApp, dan Anda yang menekan kirim. Artinya percakapan Anda berjalan di WhatsApp, tunduk pada kebijakan privasi WhatsApp, bukan kebijakan ini. Hal yang sama berlaku untuk email dan telepon.',
      },
      {
        p: 'Isi percakapan itu, misalnya nama, nomor, ukuran ruangan, atau alamat pengiriman, kami simpan sebatas yang diperlukan untuk mengerjakan dan mengirim pesanan Anda. Kami tidak memperjualbelikannya.',
      },
      { h: 'Layanan pihak ketiga' },
      {
        ul: [
          'Vercel — hosting situs ini. Menyimpan log akses standar termasuk alamat IP, sebagaimana hosting pada umumnya.',
          'Vercel Web Analytics — hanya aktif setelah Anda mengizinkan.',
          'WhatsApp (Meta) — dipakai kalau Anda memilih menghubungi lewat WhatsApp.',
          'Google Maps — tautan alamat kami mengarah ke sana. Membuka tautannya berarti Anda masuk ke layanan Google.',
        ],
      },
      { h: 'Hak Anda' },
      {
        p: 'Anda bisa mencabut izin statistik kapan saja dengan menghapus data situs ini di browser Anda; banner akan muncul lagi. Untuk data yang ada di percakapan kami, Anda bisa meminta kami menghapusnya lewat kontak di bawah.',
      },
      { h: 'Perubahan' },
      {
        p: `Halaman ini terakhir diperbarui pada ${updated}. Kalau ada perubahan berarti, kami perbarui tanggal ini.`,
      },
      { h: 'Kontak' },
      {
        p: `Pertanyaan soal halaman ini bisa dikirim ke ${company.email}, atau ke showroom kami di ${locations[0].street}, ${locations[0].locality}, ${locations[0].region}.`,
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    lede: 'The short version: this site does not track you unless you allow it, and we do not sell anyone’s data.',
    body: [
      { h: 'What this site stores on its own' },
      {
        p: 'By default this site sets no tracking cookies and runs no advertising. The only thing always kept in your browser is your answer to the consent banner, held in localStorage so we do not ask you again on every page. It is purely functional and is not sent anywhere.',
      },
      { h: 'Visit statistics, only if you allow them' },
      {
        p: 'If you press "Allow", we switch on Vercel Web Analytics. It counts visits without cookies and without building a profile, but it does process your IP address server-side to tell one visit from another. That is why we ask first. If you press "No thanks", the script is never loaded at all.',
      },
      { h: 'If you contact us' },
      {
        p: 'The enquiry form on this site does not send anything to a server of ours. It composes a message and opens WhatsApp, and you press send. That means the conversation happens in WhatsApp, under WhatsApp’s privacy policy rather than this one. The same is true of email and phone.',
      },
      {
        p: 'What is in that conversation, such as your name, number, room dimensions or a delivery address, we keep only as far as we need it to build and deliver your order. We do not sell it on.',
      },
      { h: 'Third parties involved' },
      {
        ul: [
          'Vercel — hosts this site. Keeps standard access logs including IP addresses, as any host does.',
          'Vercel Web Analytics — active only after you allow it.',
          'WhatsApp (Meta) — used if you choose to contact us that way.',
          'Google Maps — our address links point there. Opening one takes you into Google’s service.',
        ],
      },
      { h: 'Your choices' },
      {
        p: 'You can withdraw analytics consent at any time by clearing this site’s data in your browser; the banner will return. For anything in a conversation with us, you can ask us to delete it using the contact details below.',
      },
      { h: 'Changes' },
      {
        p: `This page was last updated on ${updated}. If it changes in a way that matters, we update that date.`,
      },
      { h: 'Contact' },
      {
        p: `Questions about this page can go to ${company.email}, or to our showroom at ${locations[0].street}, ${locations[0].locality}, ${locations[0].region}.`,
      },
    ],
  },
};

export const terms: Record<Locale, { title: string; lede: string; body: Block[] }> = {
  id: {
    title: 'Ketentuan Hukum',
    lede: 'Ketentuan pemakaian situs ini, dan hal-hal yang perlu jelas sebelum memesan.',
    body: [
      { h: 'Tentang situs ini' },
      {
        p: `Situs ini dijalankan oleh ${company.legalName}, produsen furnitur dan penyedia solusi interior yang berbasis di Bali, Indonesia.`,
      },
      { h: 'Katalog bukan penawaran harga' },
      {
        p: 'Foto di katalog adalah barang yang benar-benar pernah kami kerjakan. Foto tersebut menunjukkan hasil pengerjaan, bukan stok yang selalu tersedia. Situs ini tidak mencantumkan harga, dan tidak ada mekanisme pembelian di situs ini. Semua pesanan dimulai dari percakapan.',
      },
      {
        p: 'Karena kayu adalah bahan alami, serat, warna, dan urat pada barang yang Anda terima akan berbeda dari foto. Itu sifat bahannya, bukan cacat.',
      },
      { h: 'Ketentuan pesanan disepakati per pesanan' },
      {
        p: 'Harga, waktu pengerjaan, cara pembayaran, pengiriman, dan penanganan bila ada yang tidak sesuai, semuanya disepakati tertulis antara Anda dan kami sebelum pengerjaan dimulai. Ketentuan itulah yang berlaku untuk pesanan Anda. Halaman ini tidak menggantikannya.',
      },
      { h: 'Hak cipta' },
      {
        p: 'Foto, teks, logo, dan desain di situs ini milik MM Furniture Globalindo. Anda boleh membagikan tautannya. Menyalin foto katalog kami untuk dipakai sebagai materi jualan pihak lain tidak diizinkan.',
      },
      { h: 'Tautan ke luar' },
      {
        p: 'Situs ini menautkan ke WhatsApp, Instagram, Facebook, dan Google Maps. Kami tidak mengendalikan layanan-layanan itu dan tidak bertanggung jawab atas isinya.',
      },
      { h: 'Ketepatan informasi' },
      {
        p: 'Kami berusaha menjaga isi situs ini tetap benar dan mutakhir. Kalau ada yang keliru atau sudah tidak berlaku, beri tahu kami dan akan kami perbaiki.',
      },
      { h: 'Perubahan' },
      { p: `Halaman ini terakhir diperbarui pada ${updated}.` },
      { h: 'Kontak' },
      { p: `${company.email} · ${company.phones[0].label}` },
    ],
  },
  en: {
    title: 'Legal Terms',
    lede: 'The terms for using this site, and what to be clear about before ordering.',
    body: [
      { h: 'About this site' },
      {
        p: `This site is operated by ${company.legalName}, a furniture manufacturer and interior solutions provider based in Bali, Indonesia.`,
      },
      { h: 'The catalogue is not a price list' },
      {
        p: 'The photographs in the catalogue are pieces we actually built. They show what we make, not stock that is always on hand. This site lists no prices and has no checkout. Every order starts as a conversation.',
      },
      {
        p: 'Because timber is a natural material, the grain, colour and figure of the piece you receive will differ from the photograph. That is the material, not a defect.',
      },
      { h: 'Order terms are agreed per order' },
      {
        p: 'Price, lead time, payment, delivery, and what happens if something is not right are all agreed in writing between you and us before work starts. Those terms are what govern your order. This page does not replace them.',
      },
      { h: 'Copyright' },
      {
        p: 'The photographs, text, logo and design on this site belong to MM Furniture Globalindo. You are welcome to share links. Copying our catalogue photographs to use as someone else’s sales material is not permitted.',
      },
      { h: 'Links out' },
      {
        p: 'This site links to WhatsApp, Instagram, Facebook and Google Maps. We do not control those services and are not responsible for their content.',
      },
      { h: 'Accuracy' },
      {
        p: 'We try to keep this site correct and current. If something here is wrong or out of date, tell us and we will fix it.',
      },
      { h: 'Changes' },
      { p: `This page was last updated on ${updated}.` },
      { h: 'Contact' },
      { p: `${company.email} · ${company.phones[0].label}` },
    ],
  },
};
