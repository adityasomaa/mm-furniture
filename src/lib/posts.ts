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
      id: 'Kelembapan di Bali dapat mencapai 80%, dan itu mengubah perilaku kayu. Inilah yang kami perhatikan sebelum memotong papan pertama.',
      en: 'Bali humidity runs to 80% and timber moves with it. This is what we check before the first board is cut.',
    },
    body: {
      id: [
        {
          p: 'Kayu bukanlah bahan yang mati. Ia menyerap dan melepas uap air dari udara di sekitarnya, memuai ketika lembap dan menyusut ketika kering. Di Bali, selisih kelembapan antara musim hujan dan musim kemarau cukup besar untuk membuat sambungan yang dikerjakan asal-asalan terbuka hanya dalam hitungan bulan.',
        },
        { h: 'Kadar air adalah angka pertama yang kami periksa' },
        {
          p: 'Sebelum kayu masuk ke mesin, kadar airnya harus lebih dahulu diturunkan ke titik yang stabil bagi lingkungan tempat produk itu akan digunakan. Kayu yang dikeringkan untuk ruangan ber-AC berbeda dengan kayu untuk teras terbuka. Furnitur yang dikirim ke luar negeri berbeda lagi, sebab rumah di Eropa jauh lebih kering daripada rumah di Denpasar.',
        },
        {
          p: 'Inilah alasan kami selalu menanyakan lokasi pemakaian sebelum menyebutkan harga. Pertanyaannya terdengar sepele, namun jawabannya menentukan proses pengeringan.',
        },
        { h: 'Arah serat menentukan ke mana kayu bergerak' },
        {
          p: 'Kayu memuai jauh lebih besar melintang serat dibandingkan searah serat. Panel meja lebar yang dikunci mati di kedua sisinya tidak memiliki ruang untuk bergerak, dan yang akhirnya mengalah bukan kayunya, melainkan sambungannya. Konstruksi yang baik memberi jalan bagi pergerakan itu, bukan melawannya.',
        },
        { h: 'Yang dapat Anda periksa sendiri' },
        {
          ul: [
            'Rabalah bagian bawah dan belakangnya. Pengerjaan yang jujur tetap rapi di tempat yang tidak terlihat.',
            'Perhatikan sambungannya, bukan hanya finishing-nya. Finishing dapat menutupi banyak hal, tetapi hanya untuk sementara.',
            'Tanyakan kayunya dikeringkan hingga kadar berapa, dan untuk lingkungan seperti apa. Bila penjualnya tidak mengetahuinya, itu pun sudah merupakan jawaban.',
          ],
        },
        {
          p: 'Kami mempertahankan produksi di workshop sendiri di Denpasar Barat justru agar hal-hal seperti ini dapat dikendalikan, bukan diserahkan kepada pihak lain lalu sekadar berharap hasilnya benar.',
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
      id: 'Anda tidak memerlukan gambar teknik. Sebuah sketsa di kertas atau satu foto sudah cukup untuk memulai. Berikut urutannya.',
      en: 'You do not need technical drawings. A sketch on paper or a single photo is enough to start. Here is the order of things.',
    },
    body: {
      id: [
        {
          p: 'Sebagian besar pesanan custom di tempat kami berawal dari satu pesan WhatsApp berisi foto. Terkadang foto dari Pinterest, terkadang foto kursi lama yang sudah rusak namun ukurannya sudah pas. Keduanya sama-sama dapat kami kerjakan.',
        },
        { h: '01 — Kirimkan apa pun yang Anda miliki' },
        {
          p: 'Foto referensi, sketsa tangan, atau gambar kerja lengkap. Bila Anda memiliki ukuran ruangan atau tinggi plafon, kirimkan sekalian. Bila belum ada, tidak menjadi masalah; kami akan membantu menghitungnya bersama Anda.',
        },
        { h: '02 — Kami membalas dengan pertanyaan, bukan langsung harga' },
        {
          p: 'Akan digunakan di dalam atau di luar ruangan? Terkena matahari langsung? Ruangannya ber-AC? Ke mana produknya akan dikirim? Pertanyaan-pertanyaan inilah yang menentukan bahan dan proses pengeringan, dan pada akhirnya menentukan harga. Harga yang diberikan sebelum pertanyaan ini terjawab umumnya adalah harga yang akan berubah.',
        },
        { h: '03 — Ukuran, bahan, dan finishing dikunci' },
        {
          p: 'Setelah semuanya jelas, kami mengirimkan rinciannya: ukuran jadi, jenis kayu, jenis finishing, dan perkiraan waktu pengerjaan. Rincian inilah yang menjadi pegangan kedua belah pihak.',
        },
        { h: '04 — Dikerjakan di workshop, diperiksa bagian demi bagian' },
        {
          p: 'Produksi berjalan di Denpasar Barat. Setiap bagian diperiksa sebelum dirakit, dan dirakit sebelum difinishing. Bila ada yang meleset dari rencana, Anda mendengarnya dari kami terlebih dahulu, bukan pada saat barang tiba.',
        },
        {
          p: 'Anda juga dipersilakan datang menyaksikan prosesnya. Workshop kami terbuka, dan menurut kami keterbukaan itu adalah bagian yang wajar dari sebuah transaksi.',
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
      id: 'Furnitur yang dibuat dengan benar dapat bertahan puluhan tahun. Yang merusaknya biasanya bukan pemakaian, melainkan kebiasaan kecil sehari-hari.',
      en: 'Furniture built properly lasts decades. What kills it is rarely use, it is small habits.',
    },
    body: {
      id: [
        {
          p: 'Kami sering menjumpai kursi berumur dua puluh tahun yang masih kokoh, dan kursi berumur dua tahun yang sudah goyang. Perbedaannya jarang terletak pada harga, melainkan pada di mana barang itu diletakkan dan bagaimana ia dirawat.',
        },
        { h: 'Sinar matahari langsung adalah musuh utamanya' },
        {
          p: 'Sinar matahari langsung memudarkan warna kayu dan mengeringkan seratnya lebih cepat daripada bagian yang teduh. Bila satu sisi meja terkena matahari sepanjang hari sementara sisi lainnya tidak, kedua sisi itu akan bergerak dengan laju yang berbeda. Geser sedikit posisinya, atau putar secara berkala.',
        },
        { h: 'Cukup air, bukan cairan pembersih' },
        {
          p: 'Lap lembap yang diikuti lap kering sudah cukup untuk hampir semua keperluan. Pembersih beralkohol atau berbasis silikon menumpuk di permukaan, membuat finishing tampak berkabut, dan menyulitkan bila suatu saat Anda ingin melakukan finishing ulang.',
        },
        { h: 'Rotan membutuhkan kelembapan, bukan kekeringan' },
        {
          ul: [
            'Hindari menempatkan rotan tepat di depan AC. Udara kering membuat anyamannya rapuh dan mudah patah.',
            'Sesekali lap dengan kain yang sedikit lembap. Rotan yang benar-benar kering pada akhirnya akan retak.',
            'Bila anyamannya mulai kendur, umumnya masih dapat dikencangkan kembali. Jangan menunggu sampai putus.',
          ],
        },
        { h: 'Kencangkan bautnya setahun sekali' },
        {
          p: 'Sambungan berbaut akan sedikit mengendur seiring kayu bergerak. Mengencangkannya setahun sekali mencegah goyangan yang lama-kelamaan merusak lubang sambungan itu sendiri. Pekerjaan lima menit yang menghemat perbaikan besar di kemudian hari.',
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
