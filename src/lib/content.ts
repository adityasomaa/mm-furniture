import type { Locale } from './site';

/**
 * All user-facing copy, keyed by locale so the two languages can never drift apart.
 *
 * Voice rules (see PRODUCT.md): workshop-floor, matter-of-fact, unembarrassed about
 * price. No "curated", "timeless", "elegance", "passion". No em dashes. No claims that
 * are not verifiable from the legacy site.
 */
export type L<T = string> = Record<Locale, T>;

/** Hrefs are built from `localePath`, so the English-at-root / Indonesian-at-/id split
 *  is decided in exactly one place (site.ts) rather than restated per link. */
export const nav: { key: string; path: string; label: L }[] = [
  { key: 'home', path: '', label: { id: 'Beranda', en: 'Home' } },
  { key: 'about', path: 'about', label: { id: 'Tentang', en: 'About' } },
  { key: 'catalog', path: 'catalog', label: { id: 'Katalog', en: 'Catalogue' } },
  { key: 'blog', path: 'blog', label: { id: 'Blog', en: 'Blog' } },
  { key: 'contact', path: 'contact', label: { id: 'Kontak', en: 'Contact' } },
];

/** Footer-only routes. Kept out of `nav` so the header stays to five links. */
export const legalNav: { key: string; path: string; label: L }[] = [
  { key: 'privacy', path: 'privacy', label: { id: 'Kebijakan Privasi', en: 'Privacy Policy' } },
  { key: 'terms', path: 'terms', label: { id: 'Ketentuan Hukum', en: 'Legal Terms' } },
];

export const ui = {
  skipToContent: { id: 'Lompat ke konten utama', en: 'Skip to main content' },
  menu: { id: 'Menu', en: 'Menu' },
  close: { id: 'Tutup', en: 'Close' },
  whatsapp: { id: 'Hubungi via WhatsApp', en: 'Chat on WhatsApp' },
  viewCatalog: { id: 'Lihat katalog', en: 'View the catalogue' },
  productCount: { id: 'produk', en: 'products' },
  rooms: { id: 'Semua ruangan', en: 'All rooms' },
  backToCatalog: { id: 'Kembali ke katalog', en: 'Back to the catalogue' },
  home: { id: 'Beranda', en: 'Home' },
  languageLabel: { id: 'Bahasa', en: 'Language' },
  askAboutThis: { id: 'Tanyakan produk ini', en: 'Ask about this piece' },
  openInMaps: { id: 'Buka di Maps', en: 'Open in Maps' },
  enquire: { id: 'Konsultasi', en: 'Enquire' },
  loading: { id: 'Memuat', en: 'Loading' },
} satisfies Record<string, L>;

export const home = {
  metaTitle: {
    id: 'MM Furniture Globalindo — Furnitur Kelas Ekspor dari Bali',
    en: 'MM Furniture Globalindo — Export-Grade Furniture from Bali',
  },
  metaDescription: {
    id: 'Produsen furnitur dan kontraktor interior di Bali. Sofa, kursi, meja, tempat tidur, dan almari dikerjakan langsung di workshop kami di Denpasar. Kualitas ekspor dengan harga yang bersahabat. Showroom di Sunset Road, Kuta.',
    en: 'Furniture maker and interior fit-out contractor in Bali. Sofas, chairs, tables, beds and storage built in our Denpasar workshop. Export quality at an affordable price. Showroom on Sunset Road, Kuta.',
  },

  heroKicker: { id: 'Denpasar · Bali · Indonesia', en: 'Denpasar · Bali · Indonesia' },
  heroTitle: {
    id: 'Furnitur kelas ekspor, dikerjakan di Bali.',
    en: 'Export-grade furniture, built in Bali.',
  },
  heroBody: {
    id: 'Workshop kami di Denpasar Barat mengerjakan sofa, kursi, meja, tempat tidur, dan almari untuk rumah, vila, kantor, serta proyek interior. Konstruksinya dibuat dengan standar yang siap ekspor, dan harganya tetap wajar.',
    en: 'Our workshop in Denpasar Barat builds sofas, chairs, tables, beds and storage for homes, villas, offices and interior projects. Built to a standard that clears export. Priced so it still makes sense.',
  },
  heroPhotoAlt: {
    id: 'Sofa berangka kayu dengan dudukan empuk, difoto di showroom MM Furniture',
    en: 'A timber-framed sofa with upholstered seating, photographed in the MM Furniture showroom',
  },

  // The three facts a buyer actually checks. All verified.
  proofLabel: { id: 'Yang bisa Anda periksa sendiri', en: 'What you can check' },
  proof: {
    id: [
      { k: 'Workshop milik sendiri', v: 'Seluruh produksi berjalan di tempat kami di Denpasar Barat, tidak dialihkan ke pihak ketiga.' },
      { k: 'Showroom yang nyata', v: 'Jl. Sunset Road 71, Kuta. Silakan datang, duduki sofanya, dan periksa sendiri jahitan serta sambungannya.' },
      { k: 'Pesanan custom', v: 'Ukuran, bahan, dan finishing dapat menyesuaikan gambar kerja atau contoh yang Anda bawa.' },
    ],
    en: [
      { k: 'Our own workshop', v: 'Production happens at our place in Denpasar Barat. It is not handed to a third party.' },
      { k: 'A real showroom', v: 'Jl. Sunset Road 71, Kuta. Come sit on the sofa, check the stitching and the joinery.' },
      { k: 'Custom is normal', v: 'Sizes, materials and finishes follow your drawings or the sample you bring in.' },
    ],
  },

  catalogKicker: { id: 'Katalog', en: 'Catalogue' },
  catalogTitle: { id: 'Telusuri berdasarkan ruangan.', en: 'Browse it by the room it goes in.' },
  catalogBody: {
    id: 'Setiap produk di katalog ini benar-benar kami kerjakan, lengkap dengan nama, bahan, dan ukurannya. Bukan render, bukan foto stok. Ukuran dan finishing masih bisa disesuaikan.',
    en: 'Every piece in the catalogue is one we actually build, listed with its name, its material and its real dimensions. No renders, no stock photography. Sizes and finishes can still change.',
  },

  servicesKicker: { id: 'Interior', en: 'Interior' },
  servicesTitle: { id: 'Bukan hanya isi ruangannya, tetapi ruangannya sekalian.', en: 'Not just what goes in the room. The room itself.' },
  servicesBody: {
    id: 'Untuk kantor dan ruang komersial, kami menangani pekerjaan interior mulai dari desain hingga seluruhnya terpasang di lokasi.',
    en: 'For offices and commercial spaces we take interior work from design through to installed on site.',
  },
  services: {
    id: [
      { k: 'Desain interior', v: 'Gambar kerja, tata letak, dan pemilihan material untuk ruang kerja dan komersial.' },
      { k: 'Pengadaan barang & jasa', v: 'Kami yang mencarikan, mengoordinasikan, dan bertanggung jawab atas jadwalnya.' },
      { k: 'Fit-out kantor & komersial', v: 'Pemasangan di lokasi hingga ruangan benar-benar siap digunakan.' },
    ],
    en: [
      { k: 'Interior design', v: 'Drawings, layouts and material selection for workspaces and commercial rooms.' },
      { k: 'Goods & service procurement', v: 'We source it, we coordinate it, and the schedule is ours to hold.' },
      { k: 'Office & commercial fit-out', v: 'Installation on site until the room is ready to use.' },
    ],
  },

  workshopKicker: { id: 'Dua alamat', en: 'Two addresses' },
  workshopTitle: { id: 'Satu tempat untuk melihat, satu tempat untuk membuat.', en: 'One place to look. One place where it gets made.' },
  workshopBody: {
    id: 'Showroom dan workshop kami berada di lokasi terpisah, dan keduanya terbuka untuk Anda kunjungi. Sebagian besar penjual furnitur di Bali hanya memiliki yang pertama.',
    en: 'Our showroom and our workshop are separate places, and you can visit both. Plenty of furniture sellers in Bali only have the first one.',
  },

  ctaTitle: { id: 'Kirimkan ukurannya, kami balas dengan harganya.', en: 'Send us the sizes. We will come back with a price.' },
  ctaBody: {
    id: 'Foto referensi, sketsa di atas kertas, atau gambar kerja lengkap. Semuanya dapat Anda kirimkan melalui WhatsApp.',
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
  title: { id: 'Kami membuat furnitur di Bali, dan mengirimkannya ke mana pun.', en: 'We make furniture in Bali and we send it wherever it needs to go.' },
  lede: {
    id: 'MM Furniture Globalindo memadukan pengerjaan tangan dengan mesin dan alat ukur modern. Hasilnya adalah furnitur dengan konstruksi yang siap ekspor, pada harga yang tetap kompetitif di pasar lokal maupun luar negeri.',
    en: 'MM Furniture Globalindo combines hand work with modern machinery and measurement. The result is furniture built to clear export, at a price that still competes at home and abroad.',
  },
  bodyTitle: { id: 'Cara kami bekerja', en: 'How we work' },
  values: {
    id: [
      { k: 'Profesional', v: 'Pekerjaan ditangani orang yang tahu sambungan mana yang akan lepas dalam dua tahun, dan sejak awal menghindarinya.' },
      { k: 'Tepat waktu', v: 'Jadwal yang kami sepakati adalah jadwal yang kami pegang. Bila ada perubahan, Anda mendengarnya dari kami terlebih dahulu.' },
      { k: 'Evaluasi detail', v: 'Setiap proyek diperiksa bagian demi bagian sebelum meninggalkan workshop.' },
      { k: 'Bentuk dan fungsi', v: 'Produknya harus enak dipandang, dan tetap nyaman digunakan lima tahun kemudian.' },
      { k: 'Berkelanjutan', v: 'Material dan sisa produksi dikelola agar tidak terbuang percuma.' },
      { k: 'Kemitraan', v: 'Harga yang wajar bagi kedua pihak jauh lebih berarti daripada satu transaksi yang menguntungkan sesaat.' },
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
    id: 'Katalog Furnitur — Ruang Tamu, Ruang Makan, Kamar Tidur, Bar, Outdoor | MM Furniture Bali',
    en: 'Furniture Catalogue — Living, Dining, Bedroom, Bar, Outdoor | MM Furniture Bali',
  },
  metaDescription: {
    id: 'Katalog MM Furniture Globalindo: sofa, kursi, meja makan, dipan, almari, kursi bar, dan furnitur outdoor. Setiap produk dilengkapi bahan dan ukuran aslinya. Dikerjakan di workshop kami di Denpasar, Bali. Melayani pesanan custom.',
    en: 'The MM Furniture Globalindo catalogue: sofas, chairs, dining tables, beds, wardrobes, bar stools and outdoor furniture. Every piece listed with its real material and dimensions. Built in our Denpasar workshop in Bali. Custom orders welcome.',
  },
  title: { id: 'Katalog', en: 'Catalogue' },
  lede: {
    id: 'Semua yang ada di halaman ini keluar dari workshop kami di Denpasar Barat. Ukuran yang tertulis adalah ukuran yang kami kerjakan, dan semuanya masih bisa disesuaikan dengan ruangan Anda.',
    en: 'Everything on these pages comes out of our workshop in Denpasar Barat. The dimensions listed are the ones we build to, and all of them can still be cut to fit your room.',
  },

  // Room browsing.
  roomsKicker: { id: 'Berdasarkan ruangan', en: 'By room' },
  roomsTitle: { id: 'Mulai dari ruangan yang sedang Anda isi.', en: 'Start with the room you are filling.' },
  // Materials story, in the Warisan register but counted from the real data.
  materialsKicker: { id: 'Bahan', en: 'Materials' },
  materialsTitle: { id: 'Bahannya sedikit, dan kami tahu betul perilakunya.', en: 'A short list of materials, and we know how each one behaves.' },
  materialsBody: {
    id: 'Angka di bawah ini dihitung langsung dari katalog, bukan klaim pemasaran. Sebagian besar produk berbahan kayu jati, sisanya memakai rotan, anyaman tali, atau kombinasi keduanya.',
    en: 'The numbers below are counted straight off the catalogue, not a marketing claim. Most of it is teak; the rest brings in rattan, woven cord, or a combination of the two.',
  },
  materialUnit: { id: 'produk', en: 'pieces' },

  // Every product page says this, because the sheet has no prices in it at all.
  priceNote: {
    id: 'Kami tidak mencantumkan harga di situs ini. Harga bergantung pada ukuran akhir, pilihan bahan, finishing, dan jumlah pesanan, sehingga satu angka di halaman ini hampir pasti keliru. Kirimkan produk yang Anda maksud melalui WhatsApp dan kami akan membalas dengan angka yang benar.',
    en: 'We do not list prices on this site. The price moves with the final size, the material, the finish and the quantity, so a single number here would almost certainly be the wrong one. Send us the piece on WhatsApp and we will come back with the real figure.',
  },
  customTitle: { id: 'Bisa dibuat menyesuaikan ukuran Anda', en: 'This can be made to your dimensions' },
  customBody: {
    id: 'Ukuran yang tertulis adalah ukuran standar kami. Panjang, lebar, tinggi, jenis kayu, warna finishing, dan bahan dudukan semuanya dapat diubah.',
    en: 'The dimensions listed are our standard. Length, width, height, timber, finish colour and seat material can all change.',
  },
  galleryAngles: { id: 'Sudut pandang', en: 'Angles' },
  zoom: { id: 'Perbesar', en: 'Zoom' },
  prev: { id: 'Sebelumnya', en: 'Previous' },
  next: { id: 'Berikutnya', en: 'Next' },
  angle: { id: 'Tampak', en: 'View' },
  photoAlt: {
    id: (name: string) => `${name} — dikerjakan oleh MM Furniture Globalindo, Bali`,
    en: (name: string) => `${name}, built by MM Furniture Globalindo in Bali`,
  },
  /** Alt text for one angle of a multi-shot piece. */
  photoAltView: {
    id: (name: string, i: number) => `${name} — dikerjakan oleh MM Furniture Globalindo, Bali, tampak ${i}`,
    en: (name: string, i: number) => `${name}, built by MM Furniture Globalindo in Bali, view ${i}`,
  },

  // Product page.
  specMaterial: { id: 'Bahan', en: 'Material' },
  specDimensions: { id: 'Ukuran', en: 'Dimensions' },
  specDimNote: { id: 'Panjang × Lebar × Tinggi', en: 'Length × Width × Height' },
  specNoDim: { id: 'Belum tercatat. Silakan tanyakan melalui WhatsApp.', en: 'Not recorded yet. Ask us on WhatsApp.' },
  specCode: { id: 'Kode', en: 'Code' },
  related: { id: 'Produk lain di ruangan ini', en: 'More in this room' },
  backToRoom: { id: 'Lihat ruangan ini', en: 'Back to this room' },

  // Room page.
  otherRooms: { id: 'Ruangan lain', en: 'Other rooms' },
  roomCta: { id: 'Belum menemukan yang pas?', en: 'Nothing quite right?' },
  roomCtaBody: {
    id: 'Semua produk di sini dapat dibuat ulang dengan ukuran dan bahan yang Anda tentukan.',
    en: 'Everything here can be rebuilt to the size and the material you specify.',
  },
} as const;

export const contact = {
  metaTitle: {
    id: 'Kontak MM Furniture Globalindo — Showroom Kuta & Workshop Denpasar',
    en: 'Contact MM Furniture Globalindo — Kuta Showroom & Denpasar Workshop',
  },
  metaDescription: {
    id: 'Hubungi MM Furniture Globalindo. WhatsApp +62 878-6165-4856. Showroom di Jl. Sunset Road 71, Kuta, Badung. Workshop di Jl. Pulau Ayu Dalam 15, Denpasar Barat, Bali.',
    en: 'Contact MM Furniture Globalindo. WhatsApp +62 878-6165-4856. Showroom at Jl. Sunset Road 71, Kuta, Badung. Workshop at Jl. Pulau Ayu Dalam 15, Denpasar Barat, Bali.',
  },
  title: { id: 'Kontak', en: 'Contact' },
  lede: {
    id: 'Cara tercepat adalah melalui WhatsApp. Kirimkan foto atau ukuran, dan kami akan membalas dengan perkiraan harga serta waktu pengerjaannya.',
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
      id: 'MM Furniture Globalindo adalah produsen furnitur sekaligus penyedia solusi interior yang berbasis di Bali, Indonesia. Perusahaan ini mengerjakan sofa, meja makan, kursi makan, dipan, lemari, kursi bar, dan furnitur outdoor di workshop miliknya sendiri di Denpasar Barat, serta menangani desain interior, pengadaan barang dan jasa, dan fit-out ruang kantor maupun komersial. Showroom-nya berada di Jl. Sunset Road 71, Kuta, Badung, Bali.',
      en: 'MM Furniture Globalindo is a furniture manufacturer and interior solutions provider based in Bali, Indonesia. It builds sofas, dining tables, dining chairs, beds, wardrobes, bar stools and outdoor furniture in its own workshop in Denpasar Barat, and handles interior design, goods and service procurement, and office and commercial fit-out. Its showroom is at Jl. Sunset Road 71, Kuta, Badung, Bali.',
    },
  },
  {
    q: { id: 'Di mana lokasi MM Furniture?', en: 'Where is MM Furniture located?' },
    a: {
      id: 'MM Furniture Globalindo memiliki dua lokasi di Bali. Showroom dan kantornya berada di Jl. Sunset Road 71, Kuta, Badung. Workshop produksinya berada di Jl. Pulau Ayu Dalam 15, Denpasar Barat, Denpasar. Keduanya terbuka untuk dikunjungi.',
      en: 'MM Furniture Globalindo has two locations in Bali. The showroom and office are at Jl. Sunset Road 71, Kuta, Badung. The production workshop is at Jl. Pulau Ayu Dalam 15, Denpasar Barat, Denpasar. Both are open to visit.',
    },
  },
  {
    q: { id: 'Furnitur apa saja yang dibuat MM Furniture?', en: 'What furniture does MM Furniture make?' },
    a: {
      id: 'Katalog MM Furniture Globalindo berisi 227 produk yang dikelompokkan per ruangan: ruang tamu, ruang makan, kamar tidur, bar, outdoor, dan vanity. Isinya mulai dari sofa, kursi makan, meja makan, dipan, nakas, lemari, kursi bar, hingga sunbed. Bahan utamanya kayu jati, dipadukan dengan rotan, anyaman tali, besi, atau kaca sesuai produknya. Semuanya dikerjakan di workshop milik sendiri di Denpasar Barat, Bali.',
      en: 'The MM Furniture Globalindo catalogue holds 227 products, grouped by the room they go in: living room, dining room, bedroom, bar, outdoor and vanity. It runs from sofas, dining chairs and dining tables through beds, bedside tables, wardrobes, bar stools and sunbeds. Most of it is teak, combined with rattan, woven cord, iron or glass depending on the piece. All of it is built in its own workshop in Denpasar Barat, Bali.',
    },
  },
  {
    // The catalogue lists a size and a material for every piece and a price for none, so
    // this is now the obvious next question. Better answered plainly than left hanging.
    q: { id: 'Berapa harga produk MM Furniture?', en: 'How much does MM Furniture cost?' },
    a: {
      id: 'Harga tidak kami cantumkan di situs ini, karena angkanya bergantung pada ukuran akhir, pilihan bahan, finishing, dan jumlah pesanan. Ukuran yang tertera di katalog adalah ukuran standar kami, dan sebagian besar pesanan datang dengan ukuran yang berbeda. Kirimkan produk yang Anda maksud melalui WhatsApp ke +62 878-6165-4856, dan kami balas dengan harga untuk spesifikasi Anda.',
      en: 'We do not list prices on this site, because the figure moves with the final size, the material, the finish and the quantity. The dimensions in the catalogue are our standard, and most orders come in at a different size. Send us the piece on WhatsApp at +62 878-6165-4856 and we will come back with a price for your specification.',
    },
  },
  {
    q: { id: 'Apakah MM Furniture menerima pesanan custom?', en: 'Does MM Furniture take custom orders?' },
    a: {
      id: 'Ya. MM Furniture Globalindo menerima pesanan custom. Ukuran, material, dan finishing dapat menyesuaikan gambar kerja, sketsa, atau contoh yang Anda kirimkan. Cara tercepat untuk memulai adalah mengirimkan foto atau ukuran melalui WhatsApp ke +62 878-6165-4856.',
      en: 'Yes. MM Furniture Globalindo accepts custom orders. Sizes, materials and finishes can follow your drawings, a sketch, or a sample you send. The fastest way to start is to send a photo or the dimensions over WhatsApp to +62 878-6165-4856.',
    },
  },
  {
    q: { id: 'Apakah MM Furniture menangani interior kantor?', en: 'Does MM Furniture handle office interiors?' },
    a: {
      id: 'Ya. Selain memproduksi furnitur, MM Furniture Globalindo menangani solusi interior terpadu: desain interior, pengadaan barang dan jasa, serta fit-out ruang kantor dan komersial hingga siap digunakan.',
      en: 'Yes. Alongside manufacturing furniture, MM Furniture Globalindo delivers integrated interior solutions: interior design, goods and service procurement, and fit-out of office and commercial spaces through to ready to use.',
    },
  },
  {
    q: { id: 'Bagaimana cara menghubungi MM Furniture?', en: 'How do I contact MM Furniture?' },
    a: {
      id: 'Hubungi MM Furniture Globalindo melalui WhatsApp di +62 878-6165-4856 atau +62 878-6134-0445, atau melalui email ke info@mmfurniture.com. Anda juga dapat langsung mengunjungi showroom kami di Jl. Sunset Road 71, Kuta, Badung, Bali.',
      en: 'Contact MM Furniture Globalindo on WhatsApp at +62 878-6165-4856 or +62 878-6134-0445, or by email at info@mmfurniture.com. You can also visit the showroom at Jl. Sunset Road 71, Kuta, Badung, Bali.',
    },
  },
];

export const faqTitle: L = { id: 'Pertanyaan yang sering diajukan', en: 'Questions we get' };
