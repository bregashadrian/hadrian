export type CategoryType = 'Medis' | 'Pendidikan' | 'Bencana' | 'Sosial';

export type SortType =
  | 'default'
  | 'sisa_hari'
  | 'terbaru'
  | 'dana_sedikit'
  | 'hampir_tercapai';

export interface DonorItem {
  id: string;
  name: string;
  initials: string;
  amount: number;
  timeAgo: string;
  prayer: string;
  method?: string;
}

export interface UpdateItem {
  id: string;
  author: string;
  date: string;
  content: string;
}

export interface Campaign {
  id: string;
  title: string;
  subtitle: string;
  category: CategoryType;
  isUrgent?: boolean;
  organizer: string;
  organizerRole?: string;
  verifiedBadgeText?: string;
  isVerified: boolean;
  location: string;
  targetAmount: number;
  collectedAmount: number;
  daysLeft: number;
  createdAt: number;
  imageUrl: string;
  detailImageUrl?: string;
  thumbImageUrl?: string;
  story: string[];
  updates: UpdateItem[];
  donors: DonorItem[];
  donorCount: number;
}

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'operasi-andi-bekasi',
    title: 'Operasi Andi di Bekasi',
    subtitle: 'Uluran tangan segera untuk biaya tindakan bedah saraf pasca kecelakaan kerja.',
    category: 'Medis',
    isUrgent: true,
    organizer: 'Rina',
    organizerRole: '(Ibu Kandung)',
    verifiedBadgeText: 'RSUD Bekasi',
    isVerified: true,
    location: 'Bekasi Timur',
    targetAmount: 18000000,
    collectedAmount: 4200000,
    daysLeft: 6,
    createdAt: 1712600000000,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD1cXKgVlTXgt3Hx58aaVfurtrYRB02gO2iYjBjCca7T1kr4t4BJxgm48zUYFvvtyfYpuBeuye9xWNchYYaHugvIPRApdCWcdZ8aU2fkGxowWc07dTjv3iK-kSuelbJsawNP3wZUM_Hy0VUMtrF0JPoK_Ruj1q-FRXvJRevwtPyHbB7ZVu5tRvTdfuwDx8h_MsJ2leBSVpfZS933rDSPaRm0g1P-Iqfs3mv31Ioglg1Xw_N2Un6sTc8',
    detailImageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBgNeQhUkiUz0zyb_LYGtbnsu0pY6JdWkQUFWe9Tn-_7Imml0SXlJ56w1BB_3iWHnIehEh58YtntUDimY-kV-vog0j3i-3GFw95rNCRPGPTLW5w7r5sgub3zwF_oTy7x2XrFi-2tmMRh0HQvz2V4cPgXNsxDkc69T3jAUdJxf-Mr_fWIhG-lVn22texOZkNFOHYYPua8GWI5CSXewCgTrKnpBAlVdSEte9sFw-2o-Mk6Yay95fkFe6X',
    thumbImageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAH3bF7Y7XAGMpKdqh5Nunwz5q9K7Xu4gtNU11rqz5jH8t3BY4c7sLw7WrlRmWFl0NHEHOdfjP4dDcJLP3YN8yX1QkzQ1tcPhKbo5bhpdUp1pJoGlK2lXbyyW3cXAvfNXnLfh1y7NIIGeMX5htlb0MGJeXdlIm_BU_v-6n0xW_Nfw1iiKPJezv-XZe23rqKsoef0ifon0CuNJDwjUb2z4RfaX5Vdloa_1GV7aOwb3wYdNJyk0RRtRXi',
    story: [
      'Andi (19 tahun) mengalami cedera fraktur servikal akibat kecelakaan kerja di bengkel fabrikasi Bekasi Barat pada awal pekan lalu. Kondisi saat ini memerlukan tindakan operasi bedah dekompresi tulang belakang segera guna mencegah risiko kelumpuhan saraf motorik permanen.',
      'Penanganan gawat darurat dan rawat inap telah terfasilitasi kartu BPJS Kesehatan di RSUD Kota Bekasi. Namun, kebutuhan implan titanium khusus dan obat neuroprotektif penyerta senilai Rp18.000.000 tidak termasuk dalam cakupan plafon penjaminan standar.',
      'Keluarga telah mengupayakan simpanan dan pinjaman kerabat terdekat, namun batas waktu penjadwalan tindakan operasi tinggal hitungan hari. Bantuan serta uluran tangan dari para dermawan sangat kami harapkan untuk kesembuhan Andi.',
    ],
    updates: [
      {
        id: 'upd-1',
        author: 'Rina (Ibu Kandung)',
        date: 'Kemarin, 14:20 WIB',
        content:
          'Alhamdulillah, kondisi Andi siang ini stabil setelah pemasangan penyangga leher. Tim dokter menjadwalkan tindakan bedah begitu ketersediaan paket implan siap. Terima kasih atas setiap doa dan bantuan yang terus mengalir.',
      },
    ],
    donors: [
      {
        id: 'don-1',
        name: 'Hamba Allah',
        initials: 'HA',
        amount: 250000,
        timeAgo: '2 jam lalu',
        prayer:
          'Semoga operasi Dek Andi berjalan lancar, lekas pulih dan bisa beraktivitas kembali. Aamiin ya rabbal alamin.',
      },
      {
        id: 'don-2',
        name: 'Budi Santoso',
        initials: 'BS',
        amount: 100000,
        timeAgo: '5 jam lalu',
        prayer:
          'Semangat untuk Ibu Rina dan keluarga, titip doa terbaik untuk kesembuhan ananda.',
      },
      {
        id: 'don-3',
        name: 'Keluarga Wijaya',
        initials: 'KW',
        amount: 500000,
        timeAgo: '8 jam lalu',
        prayer:
          'Lekas sembuh nak, semoga dimudahkan segala proses tindakan medisnya.',
      },
    ],
    donorCount: 38,
  },
  {
    id: 'kursi-roda-pak-joko',
    title: 'Bantu Kursi Roda Pak Joko',
    subtitle: 'Pengadaan kursi roda medis khusus dan terapi pemulihan stroke untuk lansia sebatang kara.',
    category: 'Medis',
    isUrgent: true,
    organizer: 'Yayasan Sahabat',
    organizerRole: '(Pendamping Sosial)',
    verifiedBadgeText: 'Klinik Harapan',
    isVerified: true,
    location: 'Klaten, Jawa Tengah',
    targetAmount: 10000000,
    collectedAmount: 7800000,
    daysLeft: 3,
    createdAt: 1712500000000,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBbcVazjht6koluvG-WSetEpgG786VCRxReaaJ4gLkj9LGgk1dHA99VPWWkQgsqcB1uY1cAK2NxfDNOmDNvYvJdwDhrsK9qjhmuEfGZ1Xt_LEw0DyuEhODb7dYcBuZt9HHJdXxYkjGb1lUBCJqVgsR5Kij9K0cejps1oUO8OnhFn7nHmJEaUxI-WI82WCGyrG87TwLdOgw_x_kNEM3D5sMc3ZGqlw0atixrsWO4P4o9Z7aJAfm7QDoV',
    story: [
      'Pak Joko (68 tahun) tinggal seorang diri di rumah kayu sederhana di Klaten. Sejak serangan stroke ringan tiga bulan lalu, beliau kesulitan berpindah tempat dan membutuhkan kursi roda penopang punggung agar tetap bisa berjemur dan beraktivitas mandiri.',
      'Dana yang terkumpul akan digunakan sepenuhnya untuk pembelian kursi roda medis standar rumah sakit, kasur dekubitus anti-luka baring, serta biaya kontrol fisioterapi rutin selama 3 bulan ke depan.',
    ],
    updates: [
      {
        id: 'upd-joko-1',
        author: 'Yayasan Sahabat',
        date: '2 hari lalu, 09:15 WIB',
        content:
          'Tim relawan telah melakukan pengukuran postur tubuh Pak Joko bersama fisioterapis puskesmas setempat agar ukuran kursi roda benar-benar ergonomis.',
      },
    ],
    donors: [
      {
        id: 'don-j1',
        name: 'Siti Aminah',
        initials: 'SA',
        amount: 150000,
        timeAgo: '1 jam lalu',
        prayer: 'Semoga Pak Joko sehat selalu dan dimudahkan aktivitas sehari-harinya.',
      },
      {
        id: 'don-j2',
        name: 'Hamba Allah',
        initials: 'HA',
        amount: 300000,
        timeAgo: '4 jam lalu',
        prayer: 'Berkah dan sehat selalu untuk Mbah Joko dan para relawan.',
      },
    ],
    donorCount: 64,
  },
  {
    id: 'jantung-bayi-arka',
    title: 'Pengobatan Jantung Bayi Arka',
    subtitle: 'Bantuan biaya tindakan kateterisasi jantung bocor dan perawatan intensif NICU.',
    category: 'Medis',
    isUrgent: true,
    organizer: 'dr. Hendra',
    organizerRole: '(Relawan Medis)',
    verifiedBadgeText: 'RSUP Dr. Sardjito',
    isVerified: true,
    location: 'Sleman, DIY',
    targetAmount: 50000000,
    collectedAmount: 31400000,
    daysLeft: 4,
    createdAt: 1712550000000,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDIWuFV72B8HArWE4dgDZnkaUHRj2P3_2s29e_zr1Ncq56QKlzcnHSSp84shhMlQgJiBaioRUG3qBSnAZKFg1Ug5874gcklOgkA-Gpe3OqFOXJ3y2JCM6-WZugHPsY90S7SkAeX6cBsbJ9y2tu12sPXhujWd_su-Nb12AZVRVnLEl0tP3ETEkZVcfQIk14fptbWjUVRsbLk-J0_5p6LCZ_BYIIwNfc_D24c5k4ZaLxsndWgDAeoKfJR',
    story: [
      'Bayi Arka lahir dengan kelainan jantung bawaan (Ventricular Septal Defect) yang menyebabkan napasnya kerap tersengal dan berat badannya sulit bertambah. Tim kardiologi anak merekomendasikan penutupan celah jantung segera.',
      'Orang tua Arka bekerja sebagai buruh harian lepas di Sleman. Penggalangan dana ini bertujuan menutup selisih biaya alat medis kateterisasi, obat suplemen jantung khusus bayi, dan akomodasi ruang tunggu keluarga selama perawatan intensif.',
    ],
    updates: [
      {
        id: 'upd-arka-1',
        author: 'dr. Hendra',
        date: 'Kemarin, 18:00 WIB',
        content:
          'Hasil ekokardiografi terbaru menunjukkan kondisi Arka cukup stabil untuk persiapan observasi pra-tindakan pekan depan.',
      },
    ],
    donors: [
      {
        id: 'don-a1',
        name: 'Ratna Sari',
        initials: 'RS',
        amount: 500000,
        timeAgo: '30 menit lalu',
        prayer: 'Tumbuh kuat dan sehat ya adik kecil Arka, doa kami menyertaimu.',
      },
      {
        id: 'don-a2',
        name: 'Hamba Allah',
        initials: 'HA',
        amount: 200000,
        timeAgo: '3 jam lalu',
        prayer: 'Semoga operasinya lancar dan orang tua diberi ketabahan.',
      },
    ],
    donorCount: 142,
  },
  {
    id: 'buku-anak-maluku',
    title: 'Buku untuk Anak Pelosok Maluku',
    subtitle: 'Pengiriman 1.500 buku bacaan bergambar dan alat tulis untuk taman baca pesisir.',
    category: 'Pendidikan',
    isUrgent: false,
    organizer: 'Komunitas Baca Timur',
    organizerRole: '(Komunitas Pendidikan)',
    verifiedBadgeText: 'Terverifikasi Sosial',
    isVerified: true,
    location: 'Seram Bagian Barat',
    targetAmount: 20000000,
    collectedAmount: 12450000,
    daysLeft: 14,
    createdAt: 1712400000000,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBoHk6PA_1XDJ_-0Y3wEhw4oD6m6N03Phq6_1cyxueIhEcVyuF2mXoMDejvynRn8uq62horFMDt4F-fluvW_3qQClFb-2IATQV1ig6wi7JPusQtZ-huEuyN8INymB1veEBAXJiR4h6UGkdA6jyDZJbHHUhUFbsgKPitUCTGg8_s1C256EPUkiYS0v0yF4k1LHlp2O2aJBipy0lpHyIbihJ_5HgtJjHCUNi7gJcsDQTOn2PXtP5Gwhp1',
    story: [
      'Anak-anak di desa pesisir Seram Bagian Barat memiliki semangat belajar yang luar biasa tinggi, namun perpustakaan sekolah mereka hanya memiliki buku cetak lama yang sudah rusak karena lembap.',
      'Melalui program ini, kami menyalurkan paket buku cerita anak bergambar, ensiklopedia sains dasar, rak kayu tahan rayap, serta perlengkapan menggambar untuk 4 sekolah dasar di kepulauan.',
    ],
    updates: [
      {
        id: 'upd-maluku-1',
        author: 'Komunitas Baca Timur',
        date: '3 hari lalu, 11:00 WIB',
        content:
          'Sebanyak 600 buku tahap pertama sudah tiba di gudang transit Ambon dan siap dikemas dalam boks kedap air untuk pengiriman kapal perintis.',
      },
    ],
    donors: [
      {
        id: 'don-m1',
        name: 'Dimas Pratama',
        initials: 'DP',
        amount: 100000,
        timeAgo: '3 jam lalu',
        prayer: 'Semoga adik-adik di Maluku makin rajin membaca dan meraih cita-cita.',
      },
    ],
    donorCount: 89,
  },
  {
    id: 'dapur-umum-demak',
    title: 'Dapur Umum Banjir Demak',
    subtitle: 'Penyediaan 2.000 porsi makanan hangat siap santap dan air bersih bagi warga terdampak banjir.',
    category: 'Bencana',
    isUrgent: false,
    organizer: 'Relawan Tanggap Demak',
    organizerRole: '(Posko Darurat)',
    verifiedBadgeText: 'Posko BPBD',
    isVerified: true,
    location: 'Karanganyar, Demak',
    targetAmount: 50000000,
    collectedAmount: 45100000,
    daysLeft: 5,
    createdAt: 1712480000000,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDybUYBHvZtcqFNXOAJq496f1-4DtklWLgHuX3-aFjcl-sLPNPf1NoJrCBSzG0_hQzurlFZMXo1ibKKJVmvgo94O49vBlKZ5FrQc0-fZ2xyPrVXSM9rRlrZRfjfKMcEoY6JKULBw2eb1u9A_Te07Vpk-xxBfZzLk7-xVFaS-7AC8tjWf1sjmmbzZfvdrZR6dBs8WfcZr8N-MzQvErNy4QfpgxNRE-p9oFAxOKHwgAXZRcjlyDm4T416',
    story: [
      'Genangan banjir yang merendam puluhan desa di Kecamatan Karanganyar membuat ribuan warga mengungsi di tanggul dan balai desa dengan keterbatasan akses memasak.',
      'Dapur umum gotong royong kami beroperasi setiap hari mulai pukul 04.00 pagi untuk mendistribusikan nasi bungkus hangat, lauk bergizi, bubur bayi, serta galon air minum bersih.',
    ],
    updates: [
      {
        id: 'upd-demak-1',
        author: 'Relawan Tanggap Demak',
        date: 'Hari ini, 08:30 WIB',
        content:
          'Distribusi pagi ini sebanyak 1.200 bungkus nasi dan paket susu anak telah disalurkan menggunakan perahu karet ke 3 titik pengungsian.',
      },
    ],
    donors: [
      {
        id: 'don-d1',
        name: 'Hamba Allah',
        initials: 'HA',
        amount: 1000000,
        timeAgo: '1 jam lalu',
        prayer: 'Semoga banjir segera surut dan warga diberi kesehatan.',
      },
    ],
    donorCount: 215,
  },
  {
    id: 'renovasi-panti-kasih',
    title: 'Renovasi Panti Asuhan Kasih',
    subtitle: 'Perbaikan atap bocor dan kamar tidur untuk 32 anak asuh agar aman saat musim hujan.',
    category: 'Sosial',
    isUrgent: false,
    organizer: 'Pengurus Panti Kasih',
    organizerRole: '(Yayasan Sosial)',
    verifiedBadgeText: 'Terverifikasi Dinsos',
    isVerified: true,
    location: 'Bogor Selatan',
    targetAmount: 35000000,
    collectedAmount: 18200000,
    daysLeft: 21,
    createdAt: 1712350000000,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDxXNkJg0llpCjo1gzWw0bz79qhNKwVmCXhCFErC1WMVS224HHOSapHI1HIaC8TkI601TKKzXeX_6FOTmmV-nrEvkJZlPz7H8-MAe78Dd7eRjlKX9wB11MmAgnhhOvbpvPgmmIzbHX0ugw52U2RaIVgllAQaUJMRMycNyB6H3s2xMdjt6iJDPmUGAIOJQmgQu9JLaJCE5gd3IFJhYhxMilZjbI3gEv2QVkDddeOwa7Y1gSKwoWxZuUZ',
    story: [
      'Bangunan asrama putra Panti Asuhan Kasih telah berusia lebih dari 25 tahun. Kayu kuda-kuda atap mulai lapuk sehingga air hujan kerap merembes ke ruang belajar dan tempat tidur anak-anak.',
      'Gotong royong warga sekitar telah membantu tenaga pertukangan secara sukarela. Dana donasi akan difokuskan untuk membeli rangka baja ringan, genteng baru, plafon, serta cat tembok.',
    ],
    updates: [
      {
        id: 'upd-panti-1',
        author: 'Pengurus Panti Kasih',
        date: '4 hari lalu, 16:00 WIB',
        content:
          'Material pasir, semen, dan sebagian genteng telah tiba di lokasi panti. Pengerjaan tahap pembongkaran atap lama dimulai akhir pekan ini.',
      },
    ],
    donors: [
      {
        id: 'don-p1',
        name: 'Hendro Wibowo',
        initials: 'HW',
        amount: 250000,
        timeAgo: '6 jam lalu',
        prayer: 'Semoga adik-adik di panti bisa tidur dan belajar dengan nyaman.',
      },
    ],
    donorCount: 76,
  },
  {
    id: 'ambulans-gratis-solo',
    title: 'Ambulans Gratis Dhuafa Solo',
    subtitle: 'Operasional bahan bakar, oksigen medis, dan perawatan rutin armada antar-jemput pasien.',
    category: 'Medis',
    isUrgent: false,
    organizer: 'Klinik Beranda SatuPeduli',
    organizerRole: '(Layanan Kesehatan)',
    verifiedBadgeText: 'Faskes Terverifikasi',
    isVerified: true,
    location: 'Surakarta',
    targetAmount: 80000000,
    collectedAmount: 68000000,
    daysLeft: 8,
    createdAt: 1712300000000,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCN3GLSixK5p1Ho2CpVaMFwta1IRkcDaXy0jYO0NvrtL6zYue5Ycs-p4jDhH0l0jriCdqYWtHKjXriTpydb7oq29zvQba98chsuMpba6lpVq4zDCA0LDiM4_3XJejFDFNRlcQ7UQmMY6BO3KklYm-AkMikflEMhE96660cOIgkt9AqEph3lhtpy7fwYMiG-cp2-Wmhq_aPSStiqF6V-OYdAPsKl5_D0bbIxbMJuHSPQH0U9lm8KqrlU',
    story: [
      'Banyak pasien lansia dan dhuafa di pinggiran Kota Solo yang terpaksa menunda jadwal cuci darah atau kemoterapi karena terkendala biaya transportasi menuju rumah sakit rujukan.',
      'Armada ambulans gratis ini melayani rata-rata 45 pasien setiap bulannya tanpa dipungut biaya sepeser pun. Donasi Anda menjaga ketersediaan tabung oksigen, BBM, dan servis berkala.',
    ],
    updates: [
      {
        id: 'upd-solo-1',
        author: 'Klinik Beranda SatuPeduli',
        date: '2 hari lalu, 13:10 WIB',
        content:
          'Bulan ini armada telah menempuh 1.850 km mengantar 48 pasien kontrol rutin ke RSUD Dr. Moewardi.',
      },
    ],
    donors: [
      {
        id: 'don-s1',
        name: 'Nurul Hidayah',
        initials: 'NH',
        amount: 200000,
        timeAgo: '2 jam lalu',
        prayer: 'Semoga menjadi amal jariyah dan membantu banyak pasien yang membutuhkan.',
      },
    ],
    donorCount: 194,
  },
  {
    id: 'beasiswa-santri-yatim',
    title: 'Beasiswa SMK Anak Nelayan Pesisir',
    subtitle: 'Dukungan biaya SPP, seragam praktikum, dan sepatu sekolah untuk 20 siswa yatim kurang mampu.',
    category: 'Pendidikan',
    isUrgent: false,
    organizer: 'Forum Guru Pesisir',
    organizerRole: '(Pendidik Lokal)',
    verifiedBadgeText: 'Sekolah Terverifikasi',
    isVerified: true,
    location: 'Indramayu, Jawa Barat',
    targetAmount: 15000000,
    collectedAmount: 2150000,
    daysLeft: 19,
    createdAt: 1712650000000,
    imageUrl:
      'https://lh3.googleusercontent.com/aida/AEtjO1XdQH8NWBVD8hvqqSshG8V9U3Ytj7iCLYWotk8XLAVTmFMmZfDC7Z_JEWVroovypElBAJdS8npqiGNXgeAxhDTbnrYqN7zwPnyBpuc1pqKdyuntjXU160vU1HJ_ftWp5mwvFWjUM6d5Le78q7tO8dsk1AhicB6aoRueSKhTQsu-mxEIYflqzXx3TfqkxZWS8gVWwvPPJ2BdnTQjyzQ74m2gMOmOMgFhctySuZCgDN8-djYIod07n1eqOY4',
    story: [
      'Sebanyak 20 siswa SMK jurusan teknik perkapalan dan kelautan di Indramayu terancam putus sekolah setelah orang tua mereka mengalami paceklik tangkapan laut.',
      'Beasiswa gotong royong ini memastikan mereka dapat melunasi tunggakan praktikum bengkel, memperoleh seragam kerja keselamatan, serta fokus menyelesaikan ujian akhir.',
    ],
    updates: [
      {
        id: 'upd-smk-1',
        author: 'Forum Guru Pesisir',
        date: 'Kemarin, 10:00 WIB',
        content:
          'Pendataan 20 siswa penerima manfaat telah diverifikasi bersama kepala sekolah dan komite wali murid.',
      },
    ],
    donors: [
      {
        id: 'don-smk1',
        name: 'Hamba Allah',
        initials: 'HA',
        amount: 150000,
        timeAgo: '5 jam lalu',
        prayer: 'Semangat belajarnya adik-adik, masa depan cerah menanti kalian!',
      },
    ],
    donorCount: 18,
  },
];

export function formatRupiah(amount: number): string {
  return 'Rp' + Math.max(0, Math.round(amount)).toLocaleString('id-ID');
}

export function formatCompactTarget(amount: number): string {
  if (amount >= 1000000) {
    const jt = amount / 1000000;
    const formatted = Number.isInteger(jt) ? jt.toString() : jt.toFixed(1).replace('.', ',');
    return `${formatted}jt`;
  }
  if (amount >= 1000) {
    return `${Math.round(amount / 1000)}rb`;
  }
  return amount.toString();
}

export function getPercentage(collected: number, target: number): number {
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.round((collected / target) * 100));
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return 'HA';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
