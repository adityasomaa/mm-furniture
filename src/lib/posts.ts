import type { Locale } from './site';
import type { L } from './content';

/**
 * Blog posts.
 *
 * Three starter articles, written from what MM verifiably does: they run their own
 * workshop, they take custom orders, and they work in tropical Bali. Nothing here claims
 * a certification, a client, a price, or a year the company has not published.
 *
 * Deliberately not a CMS. Three posts do not justify a database, an admin, or a build
 * webhook, and a static array is something the owner can edit by hand. If this grows past
 * a dozen posts, that is the moment to reach for MDX or a CMS, not before.
 */
export type Post = {
  slug: string;
  date: string; // ISO, used for dateline + JSON-LD
  readMinutes: number;
  cover: { cat: string; index: number }; // pulled from the catalogue, never stock
  title: L;
  excerpt: L;
  /** Rendered as a sequence of blocks so the copy stays free of raw HTML. */
  body: Record<Locale, { h?: string; p?: string; ul?: string[] }[]>;
};

export const posts: Post[] = [
  {
    slug: 'memilih-kayu-furnitur-bali',
    date: '2026-05-12',
    readMinutes: 4,
    cover: { cat: 'meja', index: 5 },
    title: {
      id: 'Memilih kayu untuk furnitur di iklim Bali',
      en: 'Choosing timber for furniture in a Bali climate',
    },
    excerpt: {
      id: 'Kelembapan Bali bisa mencapai 80% dan itu mengubah kayu. Ini yang kami perhatikan sebelum memotong papan pertama.',
      en: 'Bali humidity runs to 80% and timber moves with it. This is what we check before the first board is cut.',
    },
    body: {
      id: [
        {
          p: 'Kayu bukan bahan mati. Dia menyerap dan melepas uap air dari udara sekitarnya, memuai saat lembap dan menyusut saat kering. Di Bali, selisih kelembapan antara musim hujan dan musim kemarau cukup besar untuk membuat sambungan yang dikerjakan asal-asalan terbuka dalam hitungan bulan.',
        },
        { h: 'Kadar air adalah angka pertama yang kami cek' },
        {
          p: 'Sebelum kayu masuk ke mesin, kadar airnya harus turun dulu ke titik yang stabil untuk lingkungan tempat barang itu akan dipakai. Kayu yang dikeringkan untuk ruangan ber-AC berbeda dengan kayu untuk teras terbuka. Furnitur yang dikirim ke luar negeri berbeda lagi, karena rumah di Eropa jauh lebih kering daripada rumah di Denpasar.',
        },
        {
          p: 'Ini alasan kenapa kami menanyakan lokasi pemakaian sebelum memberi harga. Pertanyaannya terdengar sepele, tapi jawabannya menentukan pengeringan.',
        },
        { h: 'Arah serat menentukan ke mana kayu bergerak' },
        {
          p: 'Kayu memuai jauh lebih banyak melintang serat daripada searah serat. Panel meja lebar yang dikunci mati di kedua sisi tidak punya ruang untuk bergerak, dan yang mengalah bukan kayunya, melainkan sambungannya. Konstruksi yang benar memberi jalan untuk pergerakan itu, bukan melawannya.',
        },
        { h: 'Yang bisa Anda cek sendiri' },
        {
          ul: [
            'Raba bagian bawah dan belakang. Pengerjaan yang jujur tetap rapi di tempat yang tidak terlihat.',
            'Lihat sambungannya, bukan cuma finishing-nya. Finishing bisa menutupi banyak hal untuk sementara.',
            'Tanyakan kayunya sudah dikeringkan sampai kadar berapa dan untuk lingkungan seperti apa. Kalau penjualnya tidak tahu, itu jawaban juga.',
          ],
        },
        {
          p: 'Kami menyimpan produksi di workshop sendiri di Denpasar Barat justru supaya hal-hal seperti ini bisa dikontrol, bukan diserahkan ke pihak lain lalu berharap hasilnya benar.',
        },
      ],
      en: [
        {
          p: 'Timber is not an inert material. It takes on and gives off moisture from the air around it, swelling when the air is damp and shrinking when it dries. In Bali, the gap between wet season and dry season is wide enough to open a carelessly made joint within months.',
        },
        { h: 'Moisture content is the first number we check' },
        {
          p: 'Before timber goes near a machine, its moisture content has to come down to a point that is stable for the environment the piece will actually live in. Timber dried for an air-conditioned room is not the same as timber for an open terrace. Furniture leaving for overseas is different again, because a house in Europe is far drier than a house in Denpasar.',
        },
        {
          p: 'This is why we ask where a piece is going before we quote it. The question sounds like small talk. The answer sets the drying.',
        },
        { h: 'Grain direction decides where the wood goes' },
        {
          p: 'Timber moves far more across the grain than along it. A wide table panel locked rigid on both edges has nowhere to go, and what gives way is not the board, it is the joint. Sound construction leaves that movement a path instead of fighting it.',
        },
        { h: 'What you can check yourself' },
        {
          ul: [
            'Run a hand underneath and behind. Honest work stays tidy where nobody looks.',
            'Look at the joinery, not just the finish. A finish can hide a lot, for a while.',
            'Ask what moisture content the timber was dried to, and for what environment. If the seller does not know, that is also an answer.',
          ],
        },
        {
          p: 'We keep production in our own workshop in Denpasar Barat precisely so this is controlled rather than handed to someone else and hoped for.',
        },
      ],
    },
  },
  {
    slug: 'proses-custom-furniture',
    date: '2026-06-03',
    readMinutes: 3,
    cover: { cat: 'almari', index: 2 },
    title: {
      id: 'Cara kerja pesanan custom, dari foto sampai barang jadi',
      en: 'How a custom order works, from photo to finished piece',
    },
    excerpt: {
      id: 'Anda tidak perlu gambar teknik. Sketsa di kertas atau satu foto sudah cukup untuk memulai. Ini urutannya.',
      en: 'You do not need technical drawings. A sketch on paper or a single photo is enough to start. Here is the order of things.',
    },
    body: {
      id: [
        {
          p: 'Sebagian besar pesanan custom di tempat kami dimulai dari satu pesan WhatsApp berisi foto. Kadang foto dari Pinterest, kadang foto kursi lama yang sudah rusak tapi ukurannya pas. Dua-duanya bisa dikerjakan.',
        },
        { h: '01 — Kirim apa yang Anda punya' },
        {
          p: 'Foto referensi, sketsa tangan, atau gambar kerja lengkap. Kalau ada ukuran ruangan atau tinggi plafon, kirim juga. Kalau belum ada, tidak masalah, kami bantu ukur logikanya.',
        },
        { h: '02 — Kami balas dengan pertanyaan, bukan langsung harga' },
        {
          p: 'Dipakai di dalam atau di luar? Kena matahari langsung? Ruangannya ber-AC? Barangnya akan dikirim ke mana? Pertanyaan-pertanyaan ini yang menentukan bahan dan pengeringan, dan pada akhirnya menentukan harga. Harga yang keluar sebelum pertanyaan ini dijawab biasanya harga yang akan berubah.',
        },
        { h: '03 — Ukuran, bahan, finishing dikunci' },
        {
          p: 'Setelah semua jelas, kami kirim rincian: ukuran jadi, jenis kayu, jenis finishing, dan perkiraan waktu pengerjaan. Ini yang jadi pegangan dua belah pihak.',
        },
        { h: '04 — Dikerjakan di workshop, diperiksa per bagian' },
        {
          p: 'Produksi jalan di Denpasar Barat. Setiap bagian diperiksa sebelum dirakit, dan dirakit sebelum difinishing. Kalau ada yang meleset dari rencana, Anda dengar dari kami lebih dulu, bukan pas barang datang.',
        },
        {
          p: 'Anda juga boleh datang melihat prosesnya. Workshop-nya terbuka, dan menurut kami itu bagian dari transaksi yang wajar.',
        },
      ],
      en: [
        {
          p: 'Most custom orders here start as a single WhatsApp message with a photo attached. Sometimes it is a picture from Pinterest. Sometimes it is an old chair that has fallen apart but was exactly the right size. Both work.',
        },
        { h: '01 — Send whatever you have' },
        {
          p: 'A reference photo, a hand sketch, or a full drawing set. If you know the room dimensions or the ceiling height, send those too. If you do not, that is fine, we will work the sizing out with you.',
        },
        { h: '02 — We come back with questions, not a price' },
        {
          p: 'Indoors or outdoors? Direct sun? Air conditioned? Where is it being shipped? These decide the material and the drying, and in the end they decide the price. A price quoted before these are answered is usually a price that changes later.',
        },
        { h: '03 — Sizes, materials and finish are fixed' },
        {
          p: 'Once it is clear, we send the detail: finished dimensions, timber, finish, and a lead time. That is what both sides hold to.',
        },
        { h: '04 — Built in the workshop, checked part by part' },
        {
          p: 'Production runs in Denpasar Barat. Every part is checked before assembly, and assembled before finishing. If something slips against the plan, you hear it from us first, not when the truck arrives.',
        },
        {
          p: 'You are also welcome to come and watch it happen. The workshop is open, and we think that is a reasonable part of the deal.',
        },
      ],
    },
  },
  {
    slug: 'merawat-furnitur-kayu',
    date: '2026-06-28',
    readMinutes: 3,
    cover: { cat: 'kursi', index: 12 },
    title: {
      id: 'Merawat furnitur kayu dan rotan supaya tahan lama',
      en: 'Looking after timber and rattan so it lasts',
    },
    excerpt: {
      id: 'Furnitur yang dibuat benar bisa bertahan puluhan tahun. Yang merusaknya biasanya bukan pemakaian, tapi kebiasaan kecil.',
      en: 'Furniture built properly lasts decades. What kills it is rarely use, it is small habits.',
    },
    body: {
      id: [
        {
          p: 'Kami sering melihat kursi berumur dua puluh tahun yang masih kokoh, dan kursi berumur dua tahun yang sudah goyang. Bedanya jarang soal harga. Lebih sering soal di mana barangnya diletakkan dan bagaimana dibersihkan.',
        },
        { h: 'Matahari langsung adalah musuh utama' },
        {
          p: 'Sinar matahari langsung memudarkan warna kayu dan mengeringkan seratnya lebih cepat daripada bagian yang teduh. Kalau satu sisi meja kena matahari sepanjang hari dan sisi lain tidak, dua sisi itu akan bergerak dengan kecepatan berbeda. Geser sedikit, atau putar berkala.',
        },
        { h: 'Air, bukan cairan pembersih' },
        {
          p: 'Lap lembap dan kering setelahnya sudah cukup untuk hampir semua hal. Pembersih ber-alkohol atau berbasis silikon menumpuk di permukaan, membuat finishing terlihat berkabut, dan menyulitkan kalau suatu saat mau difinishing ulang.',
        },
        { h: 'Rotan perlu kelembapan, bukan kekeringan' },
        {
          ul: [
            'Jangan taruh rotan tepat di depan AC. Udara kering membuat anyamannya rapuh dan mudah patah.',
            'Sesekali lap dengan kain sedikit lembap. Rotan yang benar-benar kering akan retak.',
            'Kalau anyaman mulai kendur, biasanya masih bisa dikencangkan. Jangan tunggu sampai putus.',
          ],
        },
        { h: 'Kencangkan bautnya sekali setahun' },
        {
          p: 'Sambungan berbaut akan sedikit mengendur seiring kayu bergerak. Mengencangkannya sekali setahun mencegah goyangan yang lama-lama merusak lubang sambungan itu sendiri. Ini pekerjaan lima menit yang menghemat perbaikan besar.',
        },
      ],
      en: [
        {
          p: 'We regularly see twenty-year-old chairs that are still solid, and two-year-old chairs that wobble. The difference is rarely what was paid. More often it is where the piece was put and how it was cleaned.',
        },
        { h: 'Direct sun is the main enemy' },
        {
          p: 'Direct sunlight fades timber and dries the fibre faster than it dries the shaded parts. If one side of a table sits in sun all day and the other does not, the two sides move at different rates. Shift it slightly, or turn it now and then.',
        },
        { h: 'Water, not cleaning products' },
        {
          p: 'A damp cloth, then a dry one, handles almost everything. Alcohol-based and silicone-based cleaners build up on the surface, haze the finish, and make refinishing harder later if you ever want to.',
        },
        { h: 'Rattan wants humidity, not dryness' },
        {
          ul: [
            'Do not park rattan directly in front of an air conditioner. Dry air makes the weave brittle and it snaps.',
            'Wipe it occasionally with a slightly damp cloth. Rattan that dries out completely will crack.',
            'If the weave starts to slacken it can usually still be tightened. Do not wait for it to break.',
          ],
        },
        { h: 'Tighten the bolts once a year' },
        {
          p: 'Bolted joints loosen slightly as timber moves. Tightening them once a year prevents the wobble that eventually chews out the joint itself. Five minutes of work that saves a real repair.',
        },
      ],
    },
  },
];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);

export const formatDate = (iso: string, locale: Locale) =>
  new Date(iso).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
