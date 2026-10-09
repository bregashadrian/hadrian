import React, { useState, useEffect, useMemo } from 'react';
import {
  Campaign,
  CategoryType,
  SortType,
  INITIAL_CAMPAIGNS,
  formatRupiah,
  formatCompactTarget,
  getPercentage,
  getInitials,
  DonorItem,
} from './data/campaigns';

type ScreenType =
  | 'beranda'
  | 'detail'
  | 'donasi'
  | 'galang'
  | 'zakat'
  | 'tentang';

const STORAGE_KEY_CAMPAIGNS = 'satupeduli_campaigns_v1';
const STORAGE_KEY_HISTORY = 'satupeduli_user_donations_v1';

interface UserDonationRecord {
  id: string;
  campaignId: string;
  campaignTitle: string;
  donorName: string;
  amount: number;
  method: string;
  prayer: string;
  timestamp: string;
}

const SAMPLE_PHOTOS = [
  {
    name: 'ruang_bedah_bekasi.jpg',
    desc: 'Dokumentasi faskes terverifikasi',
    url: 'https://lh3.googleusercontent.com/aida/AEtjO1XdQH8NWBVD8hvqqSshG8V9U3Ytj7iCLYWotk8XLAVTmFMmZfDC7Z_JEWVroovypElBAJdS8npqiGNXgeAxhDTbnrYqN7zwPnyBpuc1pqKdyuntjXU160vU1HJ_ftWp5mwvFWjUM6d5Le78q7tO8dsk1AhicB6aoRueSKhTQsu-mxEIYflqzXx3TfqkxZWS8gVWwvPPJ2BdnTQjyzQ74m2gMOmOMgFhctySuZCgDN8-djYIod07n1eqOY4',
  },
  {
    name: 'kunjungan_relawan_medis.jpg',
    desc: 'Kunjungan pendampingan pasien',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAH3bF7Y7XAGMpKdqh5Nunwz5q9K7Xu4gtNU11rqz5jH8t3BY4c7sLw7WrlRmWFl0NHEHOdfjP4dDcJLP3YN8yX1QkzQ1tcPhKbo5bhpdUp1pJoGlK2lXbyyW3cXAvfNXnLfh1y7NIIGeMX5htlb0MGJeXdlIm_BU_v-6n0xW_Nfw1iiKPJezv-XZe23rqKsoef0ifon0CuNJDwjUb2z4RfaX5Vdloa_1GV7aOwb3wYdNJyk0RRtRXi',
  },
  {
    name: 'sekolah_pesisir_nusantara.jpg',
    desc: 'Kegiatan belajar anak pelosok',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoHk6PA_1XDJ_-0Y3wEhw4oD6m6N03Phq6_1cyxueIhEcVyuF2mXoMDejvynRn8uq62horFMDt4F-fluvW_3qQClFb-2IATQV1ig6wi7JPusQtZ-huEuyN8INymB1veEBAXJiR4h6UGkdA6jyDZJbHHUhUFbsgKPitUCTGg8_s1C256EPUkiYS0v0yF4k1LHlp2O2aJBipy0lpHyIbihJ_5HgtJjHCUNi7gJcsDQTOn2PXtP5Gwhp1',
  },
  {
    name: 'dapur_gotong_royong.jpg',
    desc: 'Posko relawan bencana warga',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDybUYBHvZtcqFNXOAJq496f1-4DtklWLgHuX3-aFjcl-sLPNPf1NoJrCBSzG0_hQzurlFZMXo1ibKKJVmvgo94O49vBlKZ5FrQc0-fZ2xyPrVXSM9rRlrZRfjfKMcEoY6JKULBw2eb1u9A_Te07Vpk-xxBfZzLk7-xVFaS-7AC8tjWf1sjmmbzZfvdrZR6dBs8WfcZr8N-MzQvErNy4QfpgxNRE-p9oFAxOKHwgAXZRcjlyDm4T416',
  },
  {
    name: 'renovasi_atap_panti.jpg',
    desc: 'Gotong royong warga desa',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxXNkJg0llpCjo1gzWw0bz79qhNKwVmCXhCFErC1WMVS224HHOSapHI1HIaC8TkI601TKKzXeX_6FOTmmV-nrEvkJZlPz7H8-MAe78Dd7eRjlKX9wB11MmAgnhhOvbpvPgmmIzbHX0ugw52U2RaIVgllAQaUJMRMycNyB6H3s2xMdjt6iJDPmUGAIOJQmgQu9JLaJCE5gd3IFJhYhxMilZjbI3gEv2QVkDddeOwa7Y1gSKwoWxZuUZ',
  },
];

export default function App() {
  // Persistent Campaigns State
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CAMPAIGNS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial
    }
    return INITIAL_CAMPAIGNS;
  });

  // Persistent User Donation History
  const [userDonations, setUserDonations] = useState<UserDonationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(campaigns));
    } catch {
      // ignore storage quota errors
    }
  }, [campaigns]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(userDonations));
    } catch {
      // ignore
    }
  }, [userDonations]);

  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('beranda');
  const [previousScreen, setPreviousScreen] = useState<ScreenType>('beranda');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('operasi-andi-bekasi');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Beranda Filter & Sort State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | CategoryType>('Semua');
  const [sortBy, setSortBy] = useState<SortType>('default');
  const [showSortSheet, setShowSortSheet] = useState<boolean>(false);
  const [showAllUrgent, setShowAllUrgent] = useState<boolean>(false);

  // Detail View State
  const [showAllDonors, setShowAllDonors] = useState<boolean>(false);
  const [showOfflineModal, setShowOfflineModal] = useState<boolean>(false);
  const [offlineDonorName, setOfflineDonorName] = useState<string>('');
  const [offlineAmountStr, setOfflineAmountStr] = useState<string>('100.000');
  const [offlinePrayer, setOfflinePrayer] = useState<string>('Donasi tunai langsung melalui penggalang.');

  // Nominal Donasi State
  const [donationAmount, setDonationAmount] = useState<number>(50000);
  const [customInputStr, setCustomInputStr] = useState<string>('50.000');
  const [donorName, setDonorName] = useState<string>('Dewi');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [prayerText, setPrayerText] = useState<string>('Semoga lekas sembuh untuk Dik Andi, amin.');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va' | 'ewallet' | 'card'>('qris');
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [donationError, setDonationError] = useState<string | null>(null);

  // Galang Dana State
  const [newTitle, setNewTitle] = useState<string>('Operasi Andi di Bekasi');
  const [newCategory, setNewCategory] = useState<CategoryType>('Medis');
  const [newTargetStr, setNewTargetStr] = useState<string>('Rp18.000.000');
  const [newDurationStr, setNewDurationStr] = useState<string>('14 hari');
  const [newOrganizer, setNewOrganizer] = useState<string>('Rina');
  const [newLocation, setNewLocation] = useState<string>('Bekasi Timur');
  const [newStory, setNewStory] = useState<string>(
    'Andi memerlukan operasi implan segera pasca kecelakaan kerja di Bekasi. Penanganan dasar ditanggung BPJS, namun pengadaan implan khusus sebesar Rp18.000.000 belum tercakup dan butuh dukungan secepatnya.'
  );
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [requestVerifiedBadge, setRequestVerifiedBadge] = useState<boolean>(true);

  // Zakat Calculator State
  const [goldPriceStr, setGoldPriceStr] = useState<string>('1.350.000');
  const [monthlyIncomeStr, setMonthlyIncomeStr] = useState<string>('12.000.000');
  const [monthlyBonusStr, setMonthlyBonusStr] = useState<string>('2.000.000');
  const [monthlyNeedsStr, setMonthlyNeedsStr] = useState<string>('4.000.000');

  // Active Campaign
  const activeCampaign = useMemo(() => {
    return campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];
  }, [campaigns, selectedCampaignId]);

  // Navigation Helpers
  const navigateTo = (screen: ScreenType, campaignId?: string) => {
    if (campaignId) {
      setSelectedCampaignId(campaignId);
      const targetCamp = campaigns.find((c) => c.id === campaignId);
      if (targetCamp && screen === 'donasi') {
        setPrayerText(`Semoga dimudahkan dan lekas tercapai untuk ${targetCamp.title}, amin.`);
      }
    }
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (currentScreen === 'donasi' && previousScreen === 'detail') {
      setCurrentScreen('detail');
    } else {
      setCurrentScreen('beranda');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered and Sorted Campaigns for Beranda
  const filteredCampaigns = useMemo(() => {
    let list = [...campaigns];

    if (selectedCategory !== 'Semua') {
      list = list.filter((c) => c.category === selectedCategory);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.organizer.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'sisa_hari') {
      list.sort((a, b) => a.daysLeft - b.daysLeft);
    } else if (sortBy === 'terbaru') {
      list.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === 'dana_sedikit') {
      list.sort((a, b) => a.collectedAmount - b.collectedAmount);
    } else if (sortBy === 'hampir_tercapai') {
      list.sort(
        (a, b) =>
          b.collectedAmount / Math.max(1, b.targetAmount) -
          a.collectedAmount / Math.max(1, a.targetAmount)
      );
    }

    return list;
  }, [campaigns, selectedCategory, searchQuery, sortBy]);

  // Split into Paling Mendesak vs Galang Dana Lain when in default view
  const urgentCampaigns = useMemo(() => {
    const urgents = filteredCampaigns.filter((c) => c.isUrgent);
    return urgents.length > 0 ? urgents : filteredCampaigns.slice(0, 3);
  }, [filteredCampaigns]);

  const otherCampaigns = useMemo(() => {
    const urgentIds = new Set(urgentCampaigns.slice(0, 3).map((c) => c.id));
    if (sortBy !== 'default' || searchQuery.trim() !== '' || selectedCategory !== 'Semua') {
      return filteredCampaigns;
    }
    const rest = filteredCampaigns.filter((c) => !urgentIds.has(c.id));
    return rest.length > 0 ? rest : filteredCampaigns;
  }, [filteredCampaigns, urgentCampaigns, sortBy, searchQuery, selectedCategory]);

  // Handle Nominal Selection
  const handleSelectPresetNominal = (amount: number) => {
    setDonationAmount(amount);
    setCustomInputStr(amount.toLocaleString('id-ID'));
    setDonationError(null);
  };

  const handleCustomNominalChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (!digits) {
      setCustomInputStr('');
      setDonationAmount(0);
      return;
    }
    const num = parseInt(digits, 10);
    setDonationAmount(num);
    setCustomInputStr(num.toLocaleString('id-ID'));
    if (num >= 1000) {
      setDonationError(null);
    }
  };

  // Open Payment Simulation Modal
  const handleProceedToPay = () => {
    if (donationAmount < 1000) {
      setDonationError('Nominal donasi minimal Rp1.000');
      showToast('Nominal donasi minimal Rp1.000');
      return;
    }
    setDonationError(null);
    setShowPaymentModal(true);
  };

  // Confirm "Saya sudah bayar" -> Add to collectedAmount & donors & persist
  const handleConfirmPayment = () => {
    const displayDonorName = isAnonymous
      ? 'Hamba Allah'
      : donorName.trim() || 'Hamba Allah';

    const newDonor: DonorItem = {
      id: 'don-' + Date.now(),
      name: displayDonorName,
      initials: getInitials(displayDonorName),
      amount: donationAmount,
      timeAgo: 'Baru saja',
      prayer:
        prayerText.trim() ||
        'Semoga berkah dan lekas tercapai target kebaikannya.',
      method: paymentMethod.toUpperCase(),
    };

    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== activeCampaign.id) return c;
        return {
          ...c,
          collectedAmount: c.collectedAmount + donationAmount,
          donorCount: c.donorCount + 1,
          donors: [newDonor, ...c.donors],
        };
      })
    );

    setUserDonations((prev) => [
      {
        id: newDonor.id,
        campaignId: activeCampaign.id,
        campaignTitle: activeCampaign.title,
        donorName: displayDonorName,
        amount: donationAmount,
        method: paymentMethod.toUpperCase(),
        prayer: newDonor.prayer,
        timestamp: 'Baru saja',
      },
      ...prev,
    ]);

    setShowPaymentModal(false);
    showToast(
      `Terima kasih, ${displayDonorName}! Donasi ${formatRupiah(donationAmount)} berhasil ditambahkan.`
    );
    setCurrentScreen('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Offline Donation Record on Detail Screen
  const handleAddOfflineDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = offlineAmountStr.replace(/\D/g, '');
    const amount = parseInt(digits || '0', 10);
    if (amount < 1000) {
      showToast('Nominal minimal Rp1.000');
      return;
    }
    const name = offlineDonorName.trim() || 'Donatur Langsung';
    const newDonor: DonorItem = {
      id: 'off-' + Date.now(),
      name,
      initials: getInitials(name),
      amount,
      timeAgo: 'Baru saja (Offline)',
      prayer: offlinePrayer.trim() || 'Donasi tunai tercatat langsung.',
    };

    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== activeCampaign.id) return c;
        return {
          ...c,
          collectedAmount: c.collectedAmount + amount,
          donorCount: c.donorCount + 1,
          donors: [newDonor, ...c.donors],
        };
      })
    );
    setShowOfflineModal(false);
    setOfflineDonorName('');
    setOfflineAmountStr('100.000');
    showToast(`Donasi offline ${formatRupiah(amount)} berhasil dicatat!`);
  };

  // Handle Share
  const handleShareCampaign = (camp: Campaign) => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: `SatuPeduli - ${camp.title}`,
          text: `${camp.subtitle} Mari bantu bersama di SatuPeduli.`,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).catch(() => {});
      }
      showToast('Tautan kampanye berhasil disalin!');
    }
  };

  // Handle Create New Campaign ("Tayangkan campaign")
  const handlePublishCampaign = () => {
    const titleClean = newTitle.trim();
    if (!titleClean) {
      showToast('Mohon isi judul penggalangan dana.');
      return;
    }

    const targetDigits = newTargetStr.replace(/\D/g, '');
    const targetNum = Math.max(100000, parseInt(targetDigits || '10000000', 10));

    const durationDigits = newDurationStr.replace(/\D/g, '');
    const durationNum = Math.max(1, parseInt(durationDigits || '14', 10));

    const organizerClean = newOrganizer.trim() || 'Penggalang SatuPeduli';
    const storyClean =
      newStory.trim() ||
      'Penggalangan dana ini dibuat secara transparan untuk membantu sesama yang membutuhkan.';

    const chosenPhoto = SAMPLE_PHOTOS[photoIndex % SAMPLE_PHOTOS.length];
    const newId = 'camp-' + Date.now();

    const createdCampaign: Campaign = {
      id: newId,
      title: titleClean,
      subtitle: storyClean.slice(0, 110) + (storyClean.length > 110 ? '...' : ''),
      category: newCategory,
      isUrgent: durationNum <= 7,
      organizer: organizerClean,
      organizerRole: '(Penggalang Dana)',
      verifiedBadgeText: requestVerifiedBadge
        ? `Terverifikasi ${newCategory}`
        : 'Komunitas SatuPeduli',
      isVerified: requestVerifiedBadge,
      location: newLocation.trim() || 'Indonesia',
      targetAmount: targetNum,
      collectedAmount: 0,
      daysLeft: durationNum,
      createdAt: Date.now(),
      imageUrl: chosenPhoto.url,
      detailImageUrl: chosenPhoto.url,
      thumbImageUrl: chosenPhoto.url,
      story: storyClean.split('\n').filter((p) => p.trim().length > 0),
      updates: [
        {
          id: 'upd-init-' + Date.now(),
          author: organizerClean,
          date: 'Baru saja',
          content:
            'Campaign penggalangan dana resmi ditayangkan di SatuPeduli. Mohon doa dan dukungan dari orang-orang baik semua.',
        },
      ],
      donors: [],
      donorCount: 0,
    };

    setCampaigns((prev) => [createdCampaign, ...prev]);
    setSelectedCategory('Semua');
    setSearchQuery('');
    setSelectedCampaignId(newId);
    showToast('Campaign baru berhasil ditayangkan dan muncul di Beranda!');
    setCurrentScreen('beranda');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Zakat calculation
  const zakatCalc = useMemo(() => {
    const goldPrice = parseInt(goldPriceStr.replace(/\D/g, '') || '0', 10);
    const income = parseInt(monthlyIncomeStr.replace(/\D/g, '') || '0', 10);
    const bonus = parseInt(monthlyBonusStr.replace(/\D/g, '') || '0', 10);
    const needs = parseInt(monthlyNeedsStr.replace(/\D/g, '') || '0', 10);

    const netIncome = Math.max(0, income + bonus - needs);
    // Nisab bulanan setara 85 gram emas per tahun / 12 bulan (~7.08 gram/bulan)
    const nisabMonthly = Math.round((85 * goldPrice) / 12);
    const isWajib = netIncome >= nisabMonthly && nisabMonthly > 0;
    const zakatAmount = isWajib ? Math.round(netIncome * 0.025) : 0;
    const diffNisab = netIncome - nisabMonthly;

    return {
      goldPrice,
      netIncome,
      nisabMonthly,
      isWajib,
      zakatAmount,
      diffNisab,
    };
  }, [goldPriceStr, monthlyIncomeStr, monthlyBonusStr, monthlyNeedsStr]);

  const sortLabels: Record<SortType, string> = {
    default: 'Rekomendasi Mendesak',
    sisa_hari: 'Sisa hari tersedikit',
    terbaru: 'Terbaru',
    dana_sedikit: 'Dana paling sedikit',
    hampir_tercapai: 'Hampir tercapai',
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md text-body-md antialiased flex flex-col items-center">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full font-label-md text-label-md shadow-lg flex items-center gap-2 max-w-[90vw] whitespace-nowrap overflow-hidden text-ellipsis">
          <span className="material-symbols-outlined text-[18px] text-primary-fixed shrink-0">
            check_circle
          </span>
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* =========================================================
          SCREEN 1: BERANDA (Matches Stitch Screen 1 Exactly)
      ========================================================= */}
      {currentScreen === 'beranda' && (
        <div className="mx-auto w-full max-w-[420px] min-h-screen relative flex flex-col bg-surface">
          {/* Header */}
          <header className="fixed top-0 w-full max-w-[420px] z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(28,25,21,0.04)] pt-safe">
            <div className="h-16 px-margin-mobile flex items-center justify-between gap-space-sm">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('Semua');
                  setSearchQuery('');
                  setSortBy('default');
                }}
                className="flex items-center gap-1.5 text-left focus:outline-none"
              >
                <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-xs">
                  <span className="material-symbols-outlined text-[17px]">
                    volunteer_activism
                  </span>
                </span>
                <span className="font-headline-sm text-[18px] font-bold tracking-tight text-primary">
                  SatuPeduli
                </span>
              </button>

              <div className="flex items-center gap-space-xs">
                <button
                  type="button"
                  onClick={() => navigateTo('galang')}
                  className="min-h-[40px] px-3 py-2 flex items-center justify-center rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md transition-colors cursor-pointer"
                >
                  Galang dana
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('donasi', activeCampaign.id)}
                  className="min-h-[40px] px-3 py-2 flex items-center justify-center rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-colors shadow-[0_2px_8px_-2px_rgba(28,25,21,0.04)] cursor-pointer"
                >
                  Donasi
                </button>
                <button
                  type="button"
                  aria-label="Info & Riwayat"
                  onClick={() => navigateTo('tentang')}
                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-1 cursor-pointer active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-on-primary text-[18px]">
                    person
                  </span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col relative w-full pt-16 pb-24 bg-surface px-margin-mobile">
            <div className="flex flex-col w-full pb-6 space-y-5 mt-2">
              {/* Search Bar */}
              <div className="relative w-full">
                <div className="flex items-center w-full h-12 px-3.5 bg-surface-container-lowest rounded-xl shadow-sm">
                  <span className="material-symbols-outlined text-outline text-[22px] mr-2.5 shrink-0 select-none">
                    search
                  </span>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari bantuan atau program..."
                    className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      aria-label="Hapus pencarian"
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-outline hover:text-on-surface mr-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        close
                      </span>
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label="Urutkan dan filter"
                    onClick={() => setShowSortSheet((prev) => !prev)}
                    className={`p-1.5 rounded-lg transition-colors flex items-center justify-center cursor-pointer ${
                      sortBy !== 'default' || showSortSheet
                        ? 'bg-primary-fixed text-primary'
                        : 'text-outline hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      tune
                    </span>
                  </button>
                </div>

                {/* Sort Dropdown / Panel */}
                {showSortSheet && (
                  <div className="mt-2 bg-surface-container-lowest rounded-2xl p-3.5 shadow-md border border-surface-container-high z-30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-label-md text-label-md text-on-surface">
                        Urutkan Campaign
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSortBy('default');
                          setShowSortSheet(false);
                        }}
                        className="text-label-sm font-label-sm text-primary hover:underline"
                      >
                        Reset
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {(
                        [
                          { id: 'default', label: 'Paling Mendesak (Default)', icon: 'auto_awesome' },
                          { id: 'sisa_hari', label: 'Sisa hari tersedikit', icon: 'timer' },
                          { id: 'terbaru', label: 'Terbaru', icon: 'schedule' },
                          { id: 'dana_sedikit', label: 'Dana paling sedikit', icon: 'trending_down' },
                          { id: 'hampir_tercapai', label: 'Hampir tercapai', icon: 'flag' },
                        ] as { id: SortType; label: string; icon: string }[]
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.id);
                            setShowSortSheet(false);
                          }}
                          className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer ${
                            sortBy === opt.id
                              ? 'bg-primary text-on-primary font-label-md text-label-md'
                              : 'bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">
                              {opt.icon}
                            </span>
                            <span>{opt.label}</span>
                          </span>
                          {sortBy === opt.id && (
                            <span className="material-symbols-outlined text-[18px]">
                              check
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Horizontal Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-margin-mobile px-margin-mobile">
                {(
                  [
                    { label: 'Semua', icon: null },
                    { label: 'Medis', icon: 'medical_services' },
                    { label: 'Pendidikan', icon: 'school' },
                    { label: 'Bencana', icon: 'flood' },
                    { label: 'Sosial', icon: 'diversity_1' },
                  ] as { label: 'Semua' | CategoryType; icon: string | null }[]
                ).map((cat) => {
                  const isActive = selectedCategory === cat.label;
                  return (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => setSelectedCategory(cat.label)}
                      className={`shrink-0 h-9 px-4 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                        isActive
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {cat.icon && isActive && (
                        <span
                          className="material-symbols-outlined text-[16px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {cat.icon}
                        </span>
                      )}
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Sort / Filter Indicator Bar */}
              {(sortBy !== 'default' || searchQuery.trim() !== '' || selectedCategory !== 'Semua') && (
                <div className="flex items-center justify-between bg-surface-container px-3.5 py-2 rounded-xl">
                  <div className="text-body-sm text-on-surface-variant flex items-center gap-1.5 truncate">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      filter_alt
                    </span>
                    <span className="truncate">
                      Menampilkan <strong>{filteredCampaigns.length}</strong> program
                      {selectedCategory !== 'Semua' ? ` · ${selectedCategory}` : ''}
                      {sortBy !== 'default' ? ` · ${sortLabels[sortBy]}` : ''}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('Semua');
                      setSearchQuery('');
                      setSortBy('default');
                    }}
                    className="text-label-sm font-label-sm text-primary ml-2 shrink-0 hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              )}

              {/* Empty State if no campaigns match */}
              {filteredCampaigns.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-2xl p-8 text-center shadow-sm space-y-3">
                  <span className="material-symbols-outlined text-[40px] text-outline">
                    search_off
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    Belum ada campaign ditemukan
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Coba kata kunci lain atau tampilkan semua kategori bantuan.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Semua');
                      setSortBy('default');
                    }}
                    className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md cursor-pointer"
                  >
                    Tampilkan Semua
                  </button>
                </div>
              ) : (
                <>
                  {/* Section 1: Paling Mendesak */}
                  {sortBy === 'default' && searchQuery.trim() === '' && (
                    <section className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
                          <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
                            Paling mendesak
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAllUrgent((prev) => !prev)}
                          className="font-label-md text-label-md text-primary flex items-center gap-0.5 hover:underline cursor-pointer"
                        >
                          <span>{showAllUrgent ? 'Ringkas' : 'Lihat semua'}</span>
                          <span className="material-symbols-outlined text-[16px]">
                            chevron_right
                          </span>
                        </button>
                      </div>

                      {/* Featured Urgent Card (First Urgent Campaign, e.g., Operasi Andi) */}
                      {urgentCampaigns[0] && (
                        <article
                          onClick={() => navigateTo('detail', urgentCampaigns[0].id)}
                          className="w-full bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col cursor-pointer transition-transform active:scale-[0.99]"
                        >
                          <div className="relative w-full h-44 bg-surface-container overflow-hidden">
                            <img
                              alt={urgentCampaigns[0].title}
                              src={urgentCampaigns[0].imageUrl}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/65 via-transparent to-transparent"></div>
                            <div className="absolute top-3 left-3 flex items-center gap-1.5">
                              <span className="px-2.5 py-1 rounded-full bg-primary-container/90 backdrop-blur-sm text-on-primary font-label-sm text-label-sm flex items-center gap-1 shadow-sm">
                                <span className="material-symbols-outlined text-[14px]">
                                  local_hospital
                                </span>
                                {urgentCampaigns[0].category}
                              </span>
                              <span className="px-2.5 py-1 rounded-full bg-secondary/90 backdrop-blur-sm text-on-secondary font-label-sm text-label-sm">
                                Darurat
                              </span>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary">
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-primary-fixed">
                                  verified
                                </span>
                                <span className="font-label-md text-label-md drop-shadow">
                                  {urgentCampaigns[0].organizer}{' '}
                                  {urgentCampaigns[0].organizerRole || ''}
                                </span>
                              </div>
                              <span className="px-2 py-0.5 rounded-md bg-inverse-surface/60 backdrop-blur-sm font-label-sm text-label-sm text-surface">
                                {urgentCampaigns[0].location}
                              </span>
                            </div>
                          </div>
                          <div className="p-4 flex flex-col space-y-3.5">
                            <div>
                              <h3 className="font-headline-sm text-headline-sm text-on-surface line-clamp-1">
                                {urgentCampaigns[0].title}
                              </h3>
                              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">
                                {urgentCampaigns[0].subtitle}
                              </p>
                            </div>
                            {/* Progress Indicator */}
                            <div className="space-y-1.5">
                              <div className="flex items-baseline justify-between">
                                <div className="flex items-baseline gap-1">
                                  <span className="font-data-metric text-data-metric text-primary">
                                    {formatRupiah(urgentCampaigns[0].collectedAmount)}
                                  </span>
                                  <span className="font-body-sm text-body-sm text-outline">
                                    / Rp{formatCompactTarget(urgentCampaigns[0].targetAmount).replace('jt', ' jt')}
                                  </span>
                                </div>
                                <span className="font-label-md text-label-md text-primary">
                                  {getPercentage(
                                    urgentCampaigns[0].collectedAmount,
                                    urgentCampaigns[0].targetAmount
                                  )}
                                  %
                                </span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-primary-fixed/30 overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all duration-500"
                                  style={{
                                    width: `${getPercentage(
                                      urgentCampaigns[0].collectedAmount,
                                      urgentCampaigns[0].targetAmount
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-1 text-secondary font-label-md text-label-md">
                                <span className="material-symbols-outlined text-[18px]">
                                  alarm
                                </span>
                                <span>{urgentCampaigns[0].daysLeft} hari lagi</span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateTo('donasi', urgentCampaigns[0].id);
                                }}
                                className="h-10 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg shadow-sm transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  volunteer_activism
                                </span>
                                Donasi
                              </button>
                            </div>
                          </div>
                        </article>
                      )}

                      {/* Compact Urgent Cards (Pak Joko, Bayi Arka, etc.) */}
                      {(showAllUrgent ? urgentCampaigns.slice(1) : urgentCampaigns.slice(1, 3)).map(
                        (camp) => {
                          const pct = getPercentage(camp.collectedAmount, camp.targetAmount);
                          return (
                            <article
                              key={camp.id}
                              onClick={() => navigateTo('detail', camp.id)}
                              className="w-full bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm flex gap-3.5 items-center cursor-pointer transition-transform active:scale-[0.99]"
                            >
                              <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-surface-container">
                                <img
                                  src={camp.imageUrl}
                                  alt={camp.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm">
                                  {camp.category}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                <div>
                                  <div className="flex items-center gap-1 text-outline">
                                    <span className="font-label-sm text-label-sm truncate">
                                      {camp.organizer}
                                    </span>
                                    {camp.isVerified && (
                                      <span className="material-symbols-outlined text-[14px] text-primary shrink-0">
                                        verified
                                      </span>
                                    )}
                                  </div>
                                  <h3 className="font-label-lg text-label-lg text-on-surface truncate mt-0.5">
                                    {camp.title}
                                  </h3>
                                </div>
                                <div className="space-y-1 mt-2">
                                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                                    <span className="font-semibold text-on-surface">
                                      {formatRupiah(camp.collectedAmount)}
                                    </span>
                                    <span className="text-outline">{pct}%</span>
                                  </div>
                                  <div className="w-full h-1.5 rounded-full bg-primary-fixed/30 overflow-hidden">
                                    <div
                                      className="h-full bg-primary rounded-full transition-all duration-500"
                                      style={{ width: `${pct}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between mt-2 pt-0.5">
                                  <span className="text-secondary font-label-sm text-label-sm font-semibold flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">
                                      timer
                                    </span>
                                    {camp.daysLeft} hari lagi
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigateTo('donasi', camp.id);
                                    }}
                                    className="h-7 px-3 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-label-sm text-label-sm transition-colors cursor-pointer"
                                  >
                                    Donasi
                                  </button>
                                </div>
                              </div>
                            </article>
                          );
                        }
                      )}
                    </section>
                  )}

                  {/* Section 2: Galang Dana Lain (or Sorted/Filtered Grid) */}
                  <section className="space-y-3.5 pt-2">
                    <div className="flex items-center justify-between">
                      <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
                        {sortBy !== 'default'
                          ? `Hasil Urutan: ${sortLabels[sortBy]}`
                          : selectedCategory !== 'Semua'
                          ? `Kategori ${selectedCategory}`
                          : 'Galang dana lain'}
                      </h2>
                      <button
                        type="button"
                        aria-label="Urutkan daftar"
                        onClick={() => setShowSortSheet((prev) => !prev)}
                        className="text-outline hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span className="text-label-sm font-label-sm">
                          {sortBy === 'default' ? 'Urutkan' : sortLabels[sortBy]}
                        </span>
                        <span className="material-symbols-outlined text-[20px]">
                          filter_list
                        </span>
                      </button>
                    </div>

                    {/* 2-Column Responsive Card Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {otherCampaigns.map((camp) => {
                        const pct = getPercentage(camp.collectedAmount, camp.targetAmount);
                        const isDisasterOrUrgent =
                          camp.category === 'Bencana' || camp.daysLeft <= 6;
                        return (
                          <article
                            key={camp.id}
                            onClick={() => navigateTo('detail', camp.id)}
                            className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col cursor-pointer transition-transform active:scale-[0.98]"
                          >
                            <div className="relative w-full h-28 bg-surface-container overflow-hidden">
                              <img
                                src={camp.imageUrl}
                                alt={camp.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              <span
                                className={`absolute top-2 left-2 px-2 py-0.5 rounded-full bg-surface-bright/90 backdrop-blur-sm font-label-sm text-label-sm ${
                                  camp.category === 'Bencana'
                                    ? 'text-secondary'
                                    : 'text-on-surface'
                                }`}
                              >
                                {camp.category}
                              </span>
                            </div>
                            <div className="p-3 flex flex-col flex-1 justify-between space-y-2.5">
                              <h3 className="font-label-lg text-label-lg text-on-surface line-clamp-2 leading-snug">
                                {camp.title}
                              </h3>
                              <div className="space-y-1.5">
                                <div className="flex justify-between items-baseline font-label-sm text-label-sm">
                                  <span className="font-bold text-primary truncate">
                                    {formatRupiah(camp.collectedAmount)}
                                  </span>
                                  <span className="text-outline text-[11px] shrink-0">
                                    {pct}%
                                  </span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-primary-fixed/30 overflow-hidden">
                                  <div
                                    className="h-full bg-primary rounded-full transition-all duration-500"
                                    style={{ width: `${pct}%` }}
                                  ></div>
                                </div>
                                <div className="flex items-center justify-between text-outline text-[11px] pt-1">
                                  <span>Target {formatCompactTarget(camp.targetAmount)}</span>
                                  <span
                                    className={
                                      isDisasterOrUrgent
                                        ? 'font-semibold text-secondary'
                                        : 'font-medium text-on-surface-variant'
                                    }
                                  >
                                    {camp.daysLeft} hr lagi
                                  </span>
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                </>
              )}

              {/* Community Trust Footer Note */}
              <div
                onClick={() => navigateTo('tentang')}
                className="p-4 rounded-2xl bg-surface-container flex items-start gap-3 mt-2 cursor-pointer hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-primary text-[24px] shrink-0 mt-0.5">
                  verified_user
                </span>
                <div className="text-on-surface">
                  <h4 className="font-label-lg text-label-lg">
                    Transparan &amp; Terpercaya
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Setiap galang dana melewati verifikasi identitas, rekam medis, dan audit berkala oleh tim SatuPeduli.
                  </p>
                </div>
              </div>
            </div>
          </main>

          {/* Bottom Navigation Bar */}
          <nav className="fixed bottom-0 w-full max-w-[420px] z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(28,25,21,0.05)]">
            <div className="flex justify-around items-center h-20 px-space-xs">
              <button
                type="button"
                onClick={() => navigateTo('beranda')}
                className="flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] px-2 py-1 transition-all text-primary font-label-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">home</span>
                <span className="font-label-sm text-label-sm">Beranda</span>
              </button>
              <button
                type="button"
                onClick={() => navigateTo('donasi', activeCampaign.id)}
                className="flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] px-2 py-1 text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">
                  volunteer_activism
                </span>
                <span className="font-label-sm text-label-sm">Donasi</span>
              </button>
              <button
                type="button"
                onClick={() => navigateTo('zakat')}
                className="flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] px-2 py-1 text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">
                  payments
                </span>
                <span className="font-label-sm text-label-sm">Zakat</span>
              </button>
              <button
                type="button"
                onClick={() => navigateTo('galang')}
                className="flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] px-2 py-1 text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">
                  campaign
                </span>
                <span className="font-label-sm text-label-sm">Galang</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* =========================================================
          SCREEN 2: CAMPAIGN DETAIL (Matches Stitch Screen 2 Exactly)
      ========================================================= */}
      {currentScreen === 'detail' && activeCampaign && (
        <div className="w-full min-h-screen bg-surface flex flex-col">
          {/* Top Bar */}
          <header className="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(28,25,21,0.04)] pt-safe">
            <div className="max-w-[420px] mx-auto h-16 px-gutter-mobile flex items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm min-w-0">
                <button
                  type="button"
                  aria-label="Kembali"
                  onClick={() => navigateTo('beranda')}
                  className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_back
                  </span>
                </button>
                <h1 className="font-headline-sm text-headline-sm text-on-surface truncate">
                  Detail Penggalangan
                </h1>
              </div>
              <div className="flex items-center gap-space-sm shrink-0">
                <button
                  type="button"
                  aria-label="Bagikan"
                  onClick={() => handleShareCampaign(activeCampaign)}
                  className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    share
                  </span>
                </button>
                <button
                  type="button"
                  aria-label="Profil"
                  onClick={() => navigateTo('tentang')}
                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-on-primary text-[18px]">
                    person
                  </span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex flex-col relative w-full pt-16 bg-surface min-h-screen">
            <div className="flex flex-col w-full pb-28 mt-2">
              <div className="w-full max-w-[420px] mx-auto px-gutter-mobile flex flex-col gap-space-md">
                {/* Hero Media Section */}
                <div className="relative w-full rounded-2xl overflow-hidden bg-surface-container shadow-sm">
                  <div className="relative aspect-[16/10] w-full">
                    <img
                      alt={activeCampaign.title}
                      src={activeCampaign.detailImageUrl || activeCampaign.imageUrl}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-primary px-3 py-1 rounded-full shadow-sm">
                      <span className="material-symbols-outlined text-[14px] text-on-primary">
                        local_hospital
                      </span>
                      <span className="font-label-sm text-label-sm text-on-primary uppercase tracking-wider">
                        {activeCampaign.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-surface-container-lowest flex flex-col gap-2">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">
                      {activeCampaign.title}
                    </h2>
                    <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-label-md text-label-md">
                          {getInitials(activeCampaign.organizer)}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-label-md text-label-md text-on-surface">
                            {activeCampaign.organizer}
                          </span>
                          {activeCampaign.organizerRole && (
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                              {activeCampaign.organizerRole}
                            </span>
                          )}
                          {activeCampaign.isVerified && (
                            <span
                              className="material-symbols-outlined text-[16px] text-primary"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              check_circle
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-1 bg-surface-container px-2.5 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[13px] text-primary">
                          verified_user
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {activeCampaign.isVerified
                            ? `Terverifikasi ${activeCampaign.category}`
                            : 'Komunitas'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress & Funding Card */}
                <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-3.5">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-baseline justify-between">
                      <span className="font-headline-md text-headline-md text-primary">
                        {formatRupiah(activeCampaign.collectedAmount)}
                      </span>
                      <span className="font-label-md text-label-md text-primary font-bold">
                        {getPercentage(
                          activeCampaign.collectedAmount,
                          activeCampaign.targetAmount
                        )}
                        %
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      terkumpul dari target{' '}
                      <span className="font-semibold text-on-surface">
                        {formatRupiah(activeCampaign.targetAmount)}
                      </span>
                    </p>
                  </div>

                  {/* Financial Progress Bar */}
                  <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${getPercentage(
                          activeCampaign.collectedAmount,
                          activeCampaign.targetAmount
                        )}%`,
                      }}
                    ></div>
                  </div>

                  {/* Metrics Row */}
                  <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-center gap-1.5 text-on-surface">
                      <span className="material-symbols-outlined text-[18px] text-outline">
                        group
                      </span>
                      <span className="font-label-md text-label-md">
                        {activeCampaign.donorCount} donatur
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-secondary-fixed/50 px-2.5 py-1 rounded-full text-secondary">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        schedule
                      </span>
                      <span className="font-label-md text-label-md font-bold">
                        {activeCampaign.daysLeft} hari lagi
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => navigateTo('donasi', activeCampaign.id)}
                      className="flex items-center justify-center gap-1.5 bg-primary text-on-primary py-3 rounded-xl font-label-lg text-label-lg shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        favorite
                      </span>
                      <span>Donasi</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShareCampaign(activeCampaign)}
                      className="flex items-center justify-center gap-1.5 bg-surface-container text-on-surface py-3 rounded-xl font-label-lg text-label-lg active:scale-[0.98] transition-transform cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        share
                      </span>
                      <span>Bagikan</span>
                    </button>
                  </div>
                </div>

                {/* Story Card */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex flex-col gap-3.5">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                      Cerita Penggalangan Dana
                    </h3>
                  </div>
                  <div className="flex flex-col gap-3 text-on-surface font-body-md text-body-md leading-relaxed text-justify">
                    {activeCampaign.story.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                  {/* Subtle Platform Fee Notice */}
                  <div className="bg-surface-container p-3 rounded-xl flex items-start gap-2 mt-1">
                    <span className="material-symbols-outlined text-[18px] text-outline shrink-0 mt-0.5">
                      info
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                      Biaya platform 5% dari donasi online untuk operasional verifikasi &amp; pelaporan berkala.
                    </p>
                  </div>
                </div>

                {/* Kabar Terbaru Section */}
                <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                      Kabar Terbaru
                    </h3>
                    <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                      {activeCampaign.updates.length} kabar dari penggalang
                    </span>
                  </div>
                  {activeCampaign.updates.map((upd) => (
                    <div
                      key={upd.id}
                      className="bg-surface-container-low p-3.5 rounded-xl flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-label-md text-label-md text-on-surface">
                            {upd.author}
                          </span>
                          <span
                            className="material-symbols-outlined text-[14px] text-primary"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            verified
                          </span>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {upd.date}
                        </span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                        {upd.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Donor Wall Section (Doa Orang Baik) */}
                <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">
                        Doa orang baik
                      </h3>
                      <span className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
                        {activeCampaign.donorCount} doa
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowOfflineModal(true)}
                        className="font-label-sm text-label-sm text-primary bg-primary-fixed/40 px-2.5 py-1 rounded-lg hover:bg-primary-fixed cursor-pointer"
                      >
                        + Catat Offline
                      </button>
                      {activeCampaign.donors.length > 3 && (
                        <button
                          type="button"
                          onClick={() => setShowAllDonors((prev) => !prev)}
                          className="font-label-md text-label-md text-primary cursor-pointer"
                        >
                          {showAllDonors ? 'Ringkas' : 'Lihat Semua'}
                        </button>
                      )}
                    </div>
                  </div>

                  {activeCampaign.donors.length === 0 ? (
                    <div className="bg-surface-container-low p-5 rounded-xl text-center space-y-2">
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Jadilah donatur pertama yang mengirimkan doa dan dukungan untuk campaign ini.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {(showAllDonors
                        ? activeCampaign.donors
                        : activeCampaign.donors.slice(0, 5)
                      ).map((don) => (
                        <div
                          key={don.id}
                          className="bg-surface-container-low p-3.5 rounded-xl flex flex-col gap-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface font-label-md text-label-md">
                                {don.initials}
                              </div>
                              <div>
                                <p className="font-label-md text-label-md text-on-surface leading-tight">
                                  {don.name}
                                </p>
                                <p className="font-label-sm text-label-sm text-on-surface-variant">
                                  {don.timeAgo}
                                </p>
                              </div>
                            </div>
                            <span className="bg-primary/10 text-primary font-label-md text-label-md px-2.5 py-1 rounded-full">
                              {formatRupiah(don.amount)}
                            </span>
                          </div>
                          <p className="font-body-md text-body-md text-on-surface italic pl-1 leading-relaxed">
                            “{don.prayer}”
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Guarantee & Transparency Badge */}
                <div className="bg-surface-container p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      shield
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-label-lg text-label-lg text-on-surface leading-tight">
                      Penyaluran Transparan 100%
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                      Dana dialokasikan langsung untuk biaya rumah sakit dan pengadaan kebutuhan terverifikasi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sticky Bottom Quick Action Sheet */}
              <div className="fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest shadow-[0_-4px_16px_rgba(28,25,21,0.08)] pb-safe">
                <div className="max-w-[420px] mx-auto p-3.5 px-4 flex items-center justify-between gap-3">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-label-md text-label-md text-primary">
                        Terkumpul{' '}
                        {getPercentage(
                          activeCampaign.collectedAmount,
                          activeCampaign.targetAmount
                        )}
                        %
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      Target {formatRupiah(activeCampaign.targetAmount)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateTo('donasi', activeCampaign.id)}
                    className="bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg px-6 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all shrink-0 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      favorite
                    </span>
                    <span>Donasi sekarang</span>
                  </button>
                </div>
              </div>
            </div>
          </main>

          {/* Modal Catat Donasi Offline */}
          {showOfflineModal && (
            <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
              <div className="w-full max-w-[390px] bg-surface-container-lowest rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    Catat Donasi Offline
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowOfflineModal(false)}
                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      close
                    </span>
                  </button>
                </div>
                <form onSubmit={handleAddOfflineDonation} className="space-y-3">
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                      Nama Donatur Tunai
                    </label>
                    <input
                      type="text"
                      value={offlineDonorName}
                      onChange={(e) => setOfflineDonorName(e.target.value)}
                      placeholder="Contoh: Warga RT 04"
                      className="w-full h-11 px-3 rounded-xl bg-surface-container-low text-on-surface outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                      Nominal (Rp)
                    </label>
                    <input
                      type="text"
                      value={offlineAmountStr}
                      onChange={(e) => {
                        const d = e.target.value.replace(/\D/g, '');
                        setOfflineAmountStr(
                          d ? parseInt(d, 10).toLocaleString('id-ID') : ''
                        );
                      }}
                      className="w-full h-11 px-3 rounded-xl bg-surface-container-low font-semibold text-on-surface outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                      Catatan / Doa
                    </label>
                    <input
                      type="text"
                      value={offlinePrayer}
                      onChange={(e) => setOfflinePrayer(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-surface-container-low text-on-surface outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg cursor-pointer"
                  >
                    Simpan Donasi Offline
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          SCREEN 3: NOMINAL DONASI (Matches Stitch Screen 3 Exactly)
      ========================================================= */}
      {currentScreen === 'donasi' && activeCampaign && (
        <div className="w-full max-w-[420px] mx-auto bg-surface font-body-md text-body-md text-on-surface flex flex-col min-h-screen">
          {/* Header */}
          <header className="fixed top-0 w-full max-w-[420px] z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
            <div className="h-14 px-margin-mobile flex items-center justify-between">
              <button
                aria-label="Kembali"
                onClick={handleBack}
                type="button"
                className="w-11 h-11 flex items-center justify-center -ml-2 text-on-surface rounded-full transition-colors active:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">
                  arrow_back
                </span>
              </button>
              <h1 className="font-headline-sm text-headline-sm text-on-surface text-center flex-1 pr-2 truncate">
                Nominal Donasi
              </h1>
              <button
                type="button"
                aria-label="Profil"
                onClick={() => navigateTo('tentang')}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-on-primary text-[18px]">
                  person
                </span>
              </button>
            </div>
          </header>

          {/* Main */}
          <main className="flex flex-col relative w-full pt-14 pb-safe bg-surface min-h-screen px-margin-mobile">
            <div className="flex flex-col w-full pb-28">
              {/* Campaign Summary Card */}
              <section className="mt-2 mb-5">
                <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex items-center gap-3.5">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-surface-container">
                    <img
                      className="w-full h-full object-cover"
                      alt={activeCampaign.title}
                      referrerPolicy="no-referrer"
                      src={activeCampaign.thumbImageUrl || activeCampaign.imageUrl}
                    />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="inline-flex items-center gap-1 bg-primary-fixed text-on-primary-fixed text-label-sm font-label-sm px-2 py-0.5 rounded-full">
                        <span
                          className="material-symbols-outlined text-[13px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          verified
                        </span>
                        {activeCampaign.verifiedBadgeText || 'RSUD Bekasi'}
                      </span>
                      <span className="text-on-surface-variant text-label-sm font-label-sm">
                        {activeCampaign.category}
                      </span>
                    </div>
                    <h2 className="text-on-surface font-headline-sm text-headline-sm truncate">
                      {activeCampaign.title}
                    </h2>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-on-surface-variant font-body-sm text-body-sm">
                        terkumpul
                      </span>
                      <span className="text-primary font-label-md text-label-md">
                        {formatRupiah(activeCampaign.collectedAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Pilih Nominal */}
              <section className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-on-surface font-label-lg text-label-lg">
                    Pilih nominal
                  </h3>
                  <span className="text-on-surface-variant font-label-sm text-label-sm">
                    Dukungan tulus Anda
                  </span>
                </div>

                {/* Quick select pills */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[10000, 25000, 50000, 100000].map((amt) => {
                    const isSelected = donationAmount === amt;
                    const formatted = formatRupiah(amt);
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleSelectPresetNominal(amt)}
                        className={
                          isSelected
                            ? 'h-12 rounded-xl bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center transition-all shadow-sm active:scale-[0.98] ring-2 ring-primary ring-offset-2 ring-offset-background cursor-pointer'
                            : 'h-12 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-label-md flex items-center justify-center transition-all shadow-sm active:scale-[0.98] cursor-pointer'
                        }
                      >
                        {isSelected ? (
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px]">
                              check_circle
                            </span>
                            {formatted}
                          </span>
                        ) : (
                          formatted
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explicit Amount Box */}
                <div className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm">
                  <label
                    htmlFor="custom-nominal-input"
                    className="block text-on-surface-variant font-label-sm text-label-sm mb-1"
                  >
                    Nominal yang disalurkan (Minimal Rp1.000)
                  </label>
                  <div className="flex items-center bg-surface-container-low rounded-lg px-3.5 py-2.5">
                    <span className="font-data-metric text-data-metric text-on-surface-variant mr-1">
                      Rp
                    </span>
                    <input
                      id="custom-nominal-input"
                      aria-label="Nominal donasi kustom"
                      type="text"
                       inputMode="numeric"
                      value={customInputStr}
                      onChange={(e) => handleCustomNominalChange(e.target.value)}
                      placeholder="1.000"
                      className="w-full bg-transparent font-data-metric text-data-metric text-on-surface outline-none tracking-tight"
                    />
                    <label
                      htmlFor="custom-nominal-input"
                      aria-label="Edit nominal"
                      className="text-on-surface-variant active:text-primary transition-colors p-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        edit
                      </span>
                    </label>
                  </div>
                  {donationError ? (
                    <p className="text-error font-label-sm text-label-sm mt-1.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        error
                      </span>
                      {donationError}
                    </p>
                  ) : (
                    <p className="text-on-surface-variant font-label-sm text-label-sm mt-1.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-primary">
                        volunteer_activism
                      </span>
                      100% donasi diteruskan langsung untuk program bantuan ini.
                    </p>
                  )}
                </div>
              </section>

              {/* Informasi Donatur */}
              <section className="mb-6">
                <h3 className="text-on-surface font-label-lg text-label-lg mb-2.5">
                  Informasi Donatur
                </h3>
                <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3.5">
                  <div>
                    <label
                      className="block text-on-surface-variant font-label-sm text-label-sm mb-1.5"
                      htmlFor="donor-name"
                    >
                      Nama Lengkap
                    </label>
                    <div className="flex items-center bg-surface-container-low rounded-lg px-3.5 py-3">
                      <span className="material-symbols-outlined text-on-surface-variant mr-2 text-[20px]">
                        person
                      </span>
                      <input
                        id="donor-name"
                        type="text"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="Ketik nama Anda"
                        className="w-full bg-transparent font-body-md text-body-md text-on-surface outline-none"
                      />
                    </div>
                  </div>
                  <div className="pt-1">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <div className="relative flex items-center justify-center mt-0.5">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="w-5 h-5 rounded bg-surface-container peer-checked:bg-primary transition-colors flex items-center justify-center text-on-primary">
                          {isAnonymous && (
                            <span className="material-symbols-outlined text-[16px]">
                              check
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-on-surface font-label-md text-label-md">
                          Sembunyikan nama saya
                        </span>
                        <span className="text-on-surface-variant font-body-sm text-body-sm mt-0.5">
                          {isAnonymous ? (
                            <>
                              akan tampil sebagai{' '}
                              <strong className="font-label-sm text-on-surface">
                                Hamba Allah
                              </strong>{' '}
                              pada daftar donatur publik
                            </>
                          ) : (
                            <>
                              akan tampil secara publik sebagai{' '}
                              <strong className="font-label-sm text-on-surface">
                                {donorName.trim() || 'nama Anda'}
                              </strong>
                            </>
                          )}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </section>

              {/* Doa & Dukungan */}
              <section className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-on-surface font-label-lg text-label-lg">
                    Doa &amp; Dukungan
                  </h3>
                  <span className="text-on-surface-variant font-label-sm text-label-sm">
                    Penyemangat pasien
                  </span>
                </div>
                <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
                  <div className="relative bg-surface-container-low rounded-lg p-3">
                    <textarea
                      id="prayer-input"
                      rows={3}
                      maxLength={140}
                      value={prayerText}
                      onChange={(e) => setPrayerText(e.target.value)}
                      placeholder="Tuliskan ucapan doa atau harapan baik..."
                      className="w-full bg-transparent font-body-md text-body-md text-on-surface outline-none resize-none leading-relaxed"
                    />
                    <div className="flex justify-end mt-1">
                      <span className="text-on-surface-variant font-label-sm text-label-sm">
                        {prayerText.length}/140
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2.5 text-on-surface-variant font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[15px] text-primary">
                      favorite
                    </span>
                    Pesan doa ini akan dibacakan oleh relawan pendamping.
                  </div>
                </div>
              </section>

              {/* Metode Pembayaran */}
              <section className="mb-4">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-on-surface font-label-lg text-label-lg">
                    Metode
                  </h3>
                  <span className="text-on-surface-variant font-label-sm text-label-sm">
                    Simulasi mandiri
                  </span>
                </div>
                <div className="bg-surface-container-lowest rounded-xl p-2 shadow-sm flex flex-col gap-1.5">
                  {(
                    [
                      {
                        id: 'qris',
                        title: 'QRIS',
                        badge: 'Instan',
                        icon: 'qr_code_2',
                      },
                      {
                        id: 'va',
                        title: 'Transfer bank',
                        badge: null,
                        icon: 'account_balance',
                      },
                      {
                        id: 'ewallet',
                        title: 'E-wallet',
                        badge: null,
                        icon: 'account_balance_wallet',
                      },
                      {
                        id: 'card',
                        title: 'Kartu',
                        badge: null,
                        icon: 'credit_card',
                      },
                    ] as const
                  ).map((m) => {
                    const isSelected = paymentMethod === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        className={`cursor-pointer p-3 rounded-lg transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-surface-container-low'
                            : 'hover:bg-surface-container-low/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-md bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-sm ${
                              isSelected ? 'text-primary' : 'text-on-surface-variant'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {m.icon}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-on-surface font-label-md text-label-md">
                                {m.title}
                              </span>
                              {m.badge && (
                                <span className="text-label-sm font-label-sm bg-primary-fixed text-on-primary-fixed px-1.5 py-0.5 rounded">
                                  {m.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-on-surface-variant font-body-sm text-body-sm text-xs">
                              simulasi, tidak ada potongan nyata
                            </span>
                          </div>
                        </div>
                        <div
                          className={
                            isSelected
                              ? 'w-5 h-5 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0'
                              : 'w-5 h-5 rounded-full bg-surface-container flex items-center justify-center shrink-0'
                          }
                        >
                          <span
                            className={
                              isSelected
                                ? 'w-2 h-2 rounded-full bg-on-primary'
                                : 'w-2 h-2 rounded-full bg-transparent'
                            }
                          ></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Sticky Bottom Bar */}
              <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-md px-margin-mobile pt-3 pb-6 shadow-[0_-4px_16px_rgba(28,25,21,0.06)]">
                <div className="max-w-[420px] mx-auto flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-on-surface-variant font-label-sm text-label-sm">
                      Total donasi
                    </span>
                    <span className="font-data-metric text-data-metric text-primary leading-tight">
                      {formatRupiah(donationAmount)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleProceedToPay}
                    className="flex-1 h-12 rounded-xl bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98] cursor-pointer"
                  >
                    <span>Lanjut bayar</span>
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </main>

          {/* Simulasi Pembayaran Modal ("Saya sudah bayar") */}
          {showPaymentModal && (
            <div className="fixed inset-0 z-50 bg-on-surface/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
              <div className="w-full max-w-[390px] bg-surface-container-lowest rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">
                        verified_user
                      </span>
                    </span>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">
                        Instruksi Simulasi
                      </h3>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">
                        Metode: {paymentMethod.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      close
                    </span>
                  </button>
                </div>

                <div className="bg-surface-container-low rounded-xl p-4 space-y-2 text-center">
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Nominal Disalurkan
                  </p>
                  <p className="font-display-mobile text-display-mobile text-primary">
                    {formatRupiah(donationAmount)}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Donatur:{' '}
                    <strong className="text-on-surface">
                      {isAnonymous ? 'Hamba Allah' : donorName.trim() || 'Hamba Allah'}
                    </strong>
                  </p>
                  {paymentMethod === 'qris' && (
                    <div className="py-2 flex flex-col items-center">
                      <div className="w-28 h-28 rounded-xl bg-surface-container-lowest border border-outline-variant flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[72px] text-primary">
                          qr_code_2
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm text-outline mt-1.5">
                        QRIS SatuPeduli Nusantara (Simulasi)
                      </span>
                    </div>
                  )}
                  {paymentMethod === 'va' && (
                    <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/50">
                      <p className="font-label-sm text-label-sm text-outline">
                        Nomor Virtual Account Simulasi
                      </p>
                      <p className="font-label-lg text-label-lg text-on-surface tracking-wider">
                        8801 0812 9940 2026
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      check_circle
                    </span>
                    <span>Saya sudah bayar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="w-full h-10 rounded-xl bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    Ubah nominal atau metode
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          SCREEN 4: GALANG DANA (Matches Stitch Screen 4 Exactly)
      ========================================================= */}
      {currentScreen === 'galang' && (
        <div className="w-full max-w-[420px] mx-auto bg-surface font-body-md text-on-surface flex flex-col min-h-screen">
          {/* Header */}
          <header className="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(28,25,21,0.04)] pt-safe">
            <div className="max-w-[420px] mx-auto h-16 px-margin-mobile flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <button
                  aria-label="Kembali"
                  onClick={() => navigateTo('beranda')}
                  type="button"
                  className="w-11 h-11 -ml-space-xs rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[24px]">
                    arrow_back
                  </span>
                </button>
                <h1 className="font-headline-sm text-headline-sm text-on-surface">
                  Galang Dana
                </h1>
              </div>
              <div className="flex items-center gap-space-sm">
                <button
                  type="button"
                  aria-label="Profil"
                  onClick={() => navigateTo('tentang')}
                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-on-primary text-[18px]">
                    person
                  </span>
                </button>
              </div>
            </div>
          </header>

          {/* Main */}
          <main className="flex flex-col relative w-full pt-16 bg-surface min-h-screen">
            <div className="flex flex-col w-full">
              <div className="px-margin-mobile pt-space-md pb-space-xs">
                <div className="flex items-center gap-space-xs mb-1">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-container/15 text-primary">
                    <span className="material-symbols-outlined text-[14px]">
                      volunteer_activism
                    </span>
                  </span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                    Inisiatif Kebaikan
                  </span>
                </div>
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-semibold tracking-tight">
                  Galang dana
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Halaman ini menggantikan catatan di chat.
                </p>
              </div>

              <div className="px-margin-mobile my-space-sm">
                <div className="bg-surface-container-high rounded-xl p-space-sm flex items-center gap-space-sm shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">
                      bolt
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                      Mode Pratinjau Instan
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant text-[13px] leading-tight">
                      Campaign langsung tayang di demo ini.
                    </p>
                  </div>
                  <span className="inline-flex px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-[10px]">
                    Aktif
                  </span>
                </div>
              </div>

              <div className="px-margin-mobile pb-32">
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md">
                  {/* Judul */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between"
                      htmlFor="campaign-title"
                    >
                      <span>Judul penggalangan dana</span>
                      <span className="font-body-sm text-on-surface-variant text-xs font-normal">
                        {newTitle.length}/60
                      </span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="campaign-title"
                        type="text"
                        maxLength={60}
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Contoh: Renovasi Jembatan Desa..."
                        className="w-full h-12 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all placeholder:text-outline"
                      />
                    </div>
                  </div>

                  {/* Kategori */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface font-semibold">
                      Kategori
                    </label>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
                      {(['Medis', 'Pendidikan', 'Bencana', 'Sosial'] as CategoryType[]).map(
                        (cat) => {
                          const isSelected = newCategory === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setNewCategory(cat)}
                              className={
                                isSelected
                                  ? 'h-9 px-4 rounded-full bg-primary-container text-on-primary font-label-md text-label-md flex items-center gap-1.5 shadow-sm shrink-0 transition-transform active:scale-95 cursor-pointer'
                                  : 'h-9 px-4 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md flex items-center gap-1.5 shrink-0 hover:bg-surface-container-high transition-transform active:scale-95 cursor-pointer'
                              }
                            >
                              {isSelected && (
                                <span className="material-symbols-outlined text-[16px]">
                                  check
                                </span>
                              )}
                              <span>{cat}</span>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Target & Durasi */}
                  <div className="grid grid-cols-2 gap-space-sm">
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="font-label-md text-label-md text-on-surface font-semibold truncate"
                        htmlFor="target-amount"
                      >
                        Target donasi
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="target-amount"
                          type="text"
                          inputMode="numeric"
                          value={newTargetStr}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '');
                            setNewTargetStr(
                              digits
                                ? 'Rp' + parseInt(digits, 10).toLocaleString('id-ID')
                                : 'Rp'
                            );
                          }}
                          className="w-full h-12 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md font-semibold tracking-tight focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="font-label-md text-label-md text-on-surface font-semibold truncate"
                        htmlFor="duration-select"
                      >
                        Durasi penggalangan
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="duration-select"
                          type="text"
                          value={newDurationStr}
                          onChange={(e) => setNewDurationStr(e.target.value)}
                          className="w-full h-12 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all pr-8"
                        />
                        <span className="material-symbols-outlined text-[20px] text-on-surface-variant absolute right-2.5 pointer-events-none">
                          calendar_month
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nama Penggalang & Lokasi */}
                  <div className="grid grid-cols-2 gap-space-sm">
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="font-label-md text-label-md text-on-surface font-semibold"
                        htmlFor="fundraiser-name"
                      >
                        Nama penggalang
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3 pointer-events-none">
                          person
                        </span>
                        <input
                          id="fundraiser-name"
                          type="text"
                          value={newOrganizer}
                          onChange={(e) => setNewOrganizer(e.target.value)}
                          className="w-full h-12 pl-9 pr-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="font-label-md text-label-md text-on-surface font-semibold"
                        htmlFor="fundraiser-location"
                      >
                        Kota / Lokasi
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3 pointer-events-none">
                          location_on
                        </span>
                        <input
                          id="fundraiser-location"
                          type="text"
                          value={newLocation}
                          onChange={(e) => setNewLocation(e.target.value)}
                          className="w-full h-12 pl-9 pr-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cerita Penggalangan */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between"
                      htmlFor="campaign-story"
                    >
                      <span>Cerita penggalangan</span>
                      <span className="font-body-sm text-on-surface-variant text-xs font-normal">
                        Transparan &amp; Jelas
                      </span>
                    </label>
                    <textarea
                      id="campaign-story"
                      rows={4}
                      value={newStory}
                      onChange={(e) => setNewStory(e.target.value)}
                      placeholder="Ceritakan latar belakang penerima manfaat dan rincian kebutuhan dana..."
                      className="w-full p-space-md rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm leading-relaxed focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all resize-none placeholder:text-outline"
                    />
                  </div>

                  {/* Foto Utama */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface font-semibold">
                      Foto utama
                    </label>
                    <div className="bg-surface-container-low p-space-sm rounded-xl flex items-center gap-space-md">
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 shadow-sm bg-surface-container">
                        <img
                          alt="Pratinjau foto"
                          src={SAMPLE_PHOTOS[photoIndex % SAMPLE_PHOTOS.length].url}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-inverse-surface/75 text-inverse-on-surface font-label-sm text-[9px]">
                          16:9
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                          {SAMPLE_PHOTOS[photoIndex % SAMPLE_PHOTOS.length].name}
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mt-0.5">
                          {SAMPLE_PHOTOS[photoIndex % SAMPLE_PHOTOS.length].desc}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setPhotoIndex((prev) => (prev + 1) % SAMPLE_PHOTOS.length)
                          }
                          className="mt-2 inline-flex items-center gap-1.5 text-primary hover:text-primary-container font-label-sm text-label-sm self-start transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            photo_camera
                          </span>
                          <span>Ganti foto</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Ajukan badge terverifikasi */}
                  <div className="bg-surface-container-low/70 rounded-xl p-space-md flex flex-col gap-2.5">
                    <label className="flex items-start gap-space-sm cursor-pointer select-none">
                      <div className="relative flex items-center justify-center mt-0.5">
                        <input
                          type="checkbox"
                          checked={requestVerifiedBadge}
                          onChange={(e) => setRequestVerifiedBadge(e.target.checked)}
                          className="peer appearance-none w-5 h-5 rounded bg-surface-container checked:bg-primary transition-all cursor-pointer"
                        />
                        <span className="material-symbols-outlined text-on-primary text-[16px] absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
                          check
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-label-md text-label-md text-on-surface font-semibold">
                            Ajukan badge terverifikasi
                          </span>
                          <span className="material-symbols-outlined text-primary text-[16px]">
                            verified
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant text-[13px] leading-snug mt-1">
                          Verifikasi membutuhkan KTP penggalang dan rujukan dokumen medis resmi dari rumah sakit terkait demi kepercayaan bersama.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mt-space-md p-space-sm rounded-lg bg-surface-container-low flex items-center justify-center gap-1.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    security
                  </span>
                  <span className="font-body-sm text-body-sm text-xs">
                    SatuPeduli menjamin transparansi penyaluran tanpa potongan tersembunyi.
                  </span>
                </div>
              </div>

              {/* Sticky Bottom Button */}
              <div className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md px-margin-mobile pt-3 pb-safe shadow-[0_-4px_16px_rgba(30,27,23,0.06)]">
                <div className="max-w-[420px] mx-auto pb-3">
                  <button
                    type="button"
                    onClick={handlePublishCampaign}
                    className="w-full h-12 bg-primary-container text-on-primary hover:bg-primary font-label-lg text-label-lg rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <span>Tayangkan campaign</span>
                    <span className="material-symbols-outlined text-[20px]">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* =========================================================
          SCREEN 5: KALKULATOR ZAKAT (Bottom Nav Tab)
      ========================================================= */}
      {currentScreen === 'zakat' && (
        <div className="mx-auto w-full max-w-[420px] min-h-screen relative flex flex-col bg-surface">
          <header className="fixed top-0 w-full max-w-[420px] z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(28,25,21,0.04)] pt-safe">
            <div className="h-16 px-margin-mobile flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <button
                  type="button"
                  onClick={() => navigateTo('beranda')}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    arrow_back
                  </span>
                </button>
                <h1 className="font-headline-sm text-headline-sm text-on-surface">
                  Kalkulator Zakat
                </h1>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
                Zakat Profesi 2,5%
              </span>
            </div>
          </header>

          <main className="flex-1 pt-16 pb-28 px-margin-mobile space-y-4 mt-2">
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-3.5">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Hitung Zakat Penghasilan
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Nisab zakat penghasilan setara 85 gram emas per tahun (atau ~7,08 gram emas per bulan).
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Harga Emas Saat Ini per Gram (Rp)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={goldPriceStr}
                    onChange={(e) => {
                      const d = e.target.value.replace(/\D/g, '');
                      setGoldPriceStr(d ? parseInt(d, 10).toLocaleString('id-ID') : '');
                    }}
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low font-semibold text-on-surface outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Penghasilan Bulanan (Rp)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={monthlyIncomeStr}
                    onChange={(e) => {
                      const d = e.target.value.replace(/\D/g, '');
                      setMonthlyIncomeStr(
                        d ? parseInt(d, 10).toLocaleString('id-ID') : ''
                      );
                    }}
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low font-semibold text-on-surface outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                      Pendapatan Lain (Rp)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={monthlyBonusStr}
                      onChange={(e) => {
                        const d = e.target.value.replace(/\D/g, '');
                        setMonthlyBonusStr(
                          d ? parseInt(d, 10).toLocaleString('id-ID') : ''
                        );
                      }}
                      className="w-full h-11 px-3 rounded-xl bg-surface-container-low font-semibold text-on-surface outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                      Kebutuhan Pokok/Cicilan
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={monthlyNeedsStr}
                      onChange={(e) => {
                        const d = e.target.value.replace(/\D/g, '');
                        setMonthlyNeedsStr(
                          d ? parseInt(d, 10).toLocaleString('id-ID') : ''
                        );
                      }}
                      className="w-full h-11 px-3 rounded-xl bg-surface-container-low font-semibold text-on-surface outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Hasil Perhitungan */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-on-surface-variant">Penghasilan Bersih</span>
                <span className="font-semibold text-on-surface">
                  {formatRupiah(zakatCalc.netIncome)}
                </span>
              </div>
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-on-surface-variant">Batas Nisab Bulanan</span>
                <span className="font-semibold text-on-surface">
                  {formatRupiah(zakatCalc.nisabMonthly)}
                </span>
              </div>
              <div className="border-t border-surface-container pt-3 flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                    Status Kewajiban
                  </span>
                  <p
                    className={`font-label-lg text-label-lg ${
                      zakatCalc.isWajib ? 'text-primary' : 'text-secondary'
                    }`}
                  >
                    {zakatCalc.isWajib
                      ? 'Wajib Zakat (Mencapai Nisab)'
                      : 'Belum Mencapai Nisab (Dianjurkan Infaq)'}
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {zakatCalc.isWajib ? 'Estimasi Zakat (2,5%)' : 'Rekomendasi Sedekah'}
                  </span>
                  <p className="font-data-metric text-data-metric text-primary">
                    {formatRupiah(
                      zakatCalc.isWajib ? zakatCalc.zakatAmount : 50000
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const amt = zakatCalc.isWajib ? zakatCalc.zakatAmount : 50000;
                    handleSelectPresetNominal(amt);
                    navigateTo('donasi', activeCampaign.id);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-sm cursor-pointer"
                >
                  Salurkan Sekarang
                </button>
              </div>
            </div>
          </main>

          {/* Bottom Nav */}
          <nav className="fixed bottom-0 w-full max-w-[420px] z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(28,25,21,0.05)]">
            <div className="flex justify-around items-center h-20 px-space-xs">
              <button
                type="button"
                onClick={() => navigateTo('beranda')}
                className="flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] px-2 py-1 text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">home</span>
                <span className="font-label-sm text-label-sm">Beranda</span>
              </button>
              <button
                type="button"
                onClick={() => navigateTo('donasi', activeCampaign.id)}
                className="flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] px-2 py-1 text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">
                  volunteer_activism
                </span>
                <span className="font-label-sm text-label-sm">Donasi</span>
              </button>
              <button
                type="button"
                onClick={() => navigateTo('zakat')}
                className="flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] px-2 py-1 text-primary font-label-md transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">
                  payments
                </span>
                <span className="font-label-sm text-label-sm">Zakat</span>
              </button>
              <button
                type="button"
                onClick={() => navigateTo('galang')}
                className="flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] px-2 py-1 text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">
                  campaign
                </span>
                <span className="font-label-sm text-label-sm">Galang</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* =========================================================
          SCREEN 6: TENTANG & RIWAYAT DONASI SIMULASI
      ========================================================= */}
      {currentScreen === 'tentang' && (
        <div className="mx-auto w-full max-w-[420px] min-h-screen relative flex flex-col bg-surface">
          <header className="fixed top-0 w-full max-w-[420px] z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(28,25,21,0.04)] pt-safe">
            <div className="h-16 px-margin-mobile flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <button
                  type="button"
                  onClick={() => navigateTo('beranda')}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    arrow_back
                  </span>
                </button>
                <h1 className="font-headline-sm text-headline-sm text-on-surface">
                  Tentang &amp; Riwayat
                </h1>
              </div>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEY_CAMPAIGNS);
                  localStorage.removeItem(STORAGE_KEY_HISTORY);
                  setCampaigns(INITIAL_CAMPAIGNS);
                  setUserDonations([]);
                  showToast('Data simulasi berhasil direset ke awal.');
                }}
                className="text-label-sm font-label-sm text-secondary px-2.5 py-1 rounded-lg bg-secondary-fixed/50 cursor-pointer"
              >
                Reset Data Demo
              </button>
            </div>
          </header>

          <main className="flex-1 pt-16 pb-24 px-margin-mobile space-y-4 mt-2">
            {/* Riwayat Donasi Anda di Browser Ini */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Riwayat Donasi Simulasi
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
                  {userDonations.length} transaksi
                </span>
              </div>
              {userDonations.length === 0 ? (
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Belum ada donasi yang Anda lakukan di sesi browser ini. Silakan pilih campaign dan klik &ldquo;Saya sudah bayar&rdquo; untuk melihat simulasi penambahan saldo.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {userDonations.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigateTo('detail', item.campaignId)}
                      className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-label-md text-label-md text-on-surface truncate">
                          {item.campaignTitle}
                        </p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">
                          {item.donorName} · {item.method} · {item.timestamp}
                        </p>
                      </div>
                      <span className="font-label-md text-label-md text-primary shrink-0">
                        {formatRupiah(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rincian Biaya & Transparansi SatuPeduli */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-3">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                Transparansi &amp; Biaya Layanan
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                SatuPeduli dibangun dengan semangat gotong royong warga. Seluruh data donasi dan pembuatan campaign baru pada aplikasi ini disimpan secara lokal di browser Anda (LocalStorage) sehingga tetap tersimpan meskipun halaman dimuat ulang.
              </p>
              <div className="bg-surface-container-low p-3 rounded-xl space-y-1.5 text-body-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Penyaluran Medis Darurat</span>
                  <span className="font-semibold text-primary">100% (0% Potongan)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Operasional &amp; Audit Berkala</span>
                  <span className="font-semibold text-on-surface">Maks. 5%</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
