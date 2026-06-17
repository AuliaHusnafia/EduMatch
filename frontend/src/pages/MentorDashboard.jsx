import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// ─── SVG Icons ─────────────────────────────────────────────────────────────────
const Ic = {
  Overview:  () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M12 17V5"/><path d="M6 17v-3"/></svg>),
  User:      () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
  Calendar:  () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
  Booking:   () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  Session:   () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
  Star:      () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
  Money:     () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>),
  Logout:    () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>),
  Link:      () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>),
  Plus:      () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  Trash:     () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>),
  Check:     () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  Close:     () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
};

// ─── Status Badge ───────────────────────────────────────────────────────────────
const STATUS = {
  pending:   { bg:'#fff3cd', color:'#856404', text:'Menunggu' },
  accepted:  { bg:'#cce5ff', color:'#004085', text:'Diterima' },
  ongoing:   { bg:'#d4edda', color:'#155724', text:'Berlangsung' },
  completed: { bg:'#fff3cd', color:'#856404', text:'Menunggu Bayar' },
  paid:      { bg:'#d4edda', color:'#155724', text:'Lunas' },
  rejected:  { bg:'#f8d7da', color:'#721c24', text:'Ditolak' },
};
const Badge = ({ s }) => {
  const c = STATUS[s] || { bg:'#eee', color:'#555', text: s };
  return <span style={{ background:c.bg, color:c.color, padding:'3px 10px', borderRadius:'99px', fontSize:'11px', fontWeight:'700', whiteSpace:'nowrap' }}>{c.text}</span>;
};

export default function MentorDashboard() {
  const navigate = useNavigate();
  const [tab, setTab]                       = useState('overview');
  const [loading, setLoading]               = useState(true);
  const [user, setUser]                     = useState(null);
  const [profile, setProfile]               = useState({ skills:'', price_per_session:75000, bio:'', education:'', available_slots:[] });
  const [bookingRequests, setBookingRequests] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [reviews, setReviews]               = useState([]);
  const [earnings, setEarnings]             = useState({ total:0, available:0, withdrawn:0, unpaid_sessions:0 });

  const getList = (res) => {
    if (!res || !res.data) return [];
    if (res.data.results && Array.isArray(res.data.results)) return res.data.results;
    if (Array.isArray(res.data)) return res.data;
    return [];
  };
  const [showSlotModal, setShowSlotModal]   = useState(false);
  const [newSlot, setNewSlot]               = useState({ date:'', time:'' });
  const [showMeetModal, setShowMeetModal]   = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [meetLink, setMeetLink]             = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawBank, setWithdrawBank]     = useState('');
  const [withdrawAccNum, setWithdrawAccNum] = useState('');
  const [withdrawAccName, setWithdrawAccName] = useState('');
  const [flash, setFlash]                   = useState({ type:'', msg:'' });

  const showFlash = (type, msg) => { setFlash({ type, msg }); setTimeout(() => setFlash({ type:'', msg:'' }), 4000); };

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    const role  = localStorage.getItem('role');
    if (!token || role !== 'mentor') { navigate('/login'); return; }
    await fetchAll();
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [userR, bookR, sessR, profR, revR, earnR] = await Promise.all([
        api.get('/auth/me/'),
        api.get('/mentor/booking-requests/'),
        api.get('/mentor/active-sessions/'),
        api.get('/mentor/profile/'),
        api.get('/mentor/reviews/'),
        api.get('/mentor/income/'),
      ]);

      setUser(userR.data);
      setBookingRequests(getList(bookR));
      setActiveSessions(getList(sessR));
      if (profR.data) setProfile({ skills:profR.data.skills||'', price_per_session:profR.data.price_per_session||75000, bio:profR.data.bio||'', education:profR.data.education||'', available_slots:profR.data.available_slots||[] });
      setReviews(getList(revR));
      setEarnings(earnR.data || { total:0, available:0, withdrawn:0, unpaid_sessions:0 });
    } catch (e) { showFlash('error', 'Gagal memuat data'); }
    finally { setLoading(false); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try { await api.put('/mentor/profile/', profile); showFlash('success', 'Profil berhasil diperbarui!'); }
    catch { showFlash('error', 'Gagal memperbarui profil'); }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!newSlot.date || !newSlot.time) { showFlash('error', 'Pilih tanggal dan waktu'); return; }
    try {
      await api.post('/mentor/available-slots/', newSlot);
      showFlash('success', 'Jadwal berhasil ditambahkan!');
      setShowSlotModal(false); setNewSlot({ date:'', time:'' }); fetchAll();
    } catch (e) { showFlash('error', e.response?.data?.error || 'Gagal menambahkan jadwal'); }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Hapus jadwal ini?')) return;
    try { await api.delete(`/mentor/available-slots/${slotId}/`); showFlash('success', 'Jadwal dihapus'); fetchAll(); }
    catch { showFlash('error', 'Gagal menghapus jadwal'); }
  };

  const handleConfirmBooking = async (bookingId, action) => {
    try {
      await api.post('/mentor/respond-booking/', { booking_id: bookingId, action });
      showFlash('success', action === 'accept' ? 'Booking diterima!' : 'Booking ditolak');
      await fetchAll();
      if (action === 'accept') setTab('sessions');
    } catch { showFlash('error', 'Gagal memproses booking'); }
  };

  const handleStartSession = (bookingId) => { setSelectedBookingId(bookingId); setMeetLink(''); setShowMeetModal(true); };

  const handleSubmitMeetLink = async (e) => {
    e.preventDefault();
    if (!meetLink.startsWith('http')) { showFlash('error', 'Link harus dimulai dengan https://'); return; }
    try {
      await api.post('/mentor/start-session/', { booking_id: selectedBookingId, meeting_link: meetLink });
      showFlash('success', 'Sesi dimulai! Link dikirim ke mentee.');
      setShowMeetModal(false); setMeetLink(''); setSelectedBookingId(null); fetchAll();
    } catch (e) { showFlash('error', e.response?.data?.error || 'Gagal memulai sesi'); }
  };

  const handleCompleteSession = async (bookingId) => {
    if (window.confirm('Apakah sesi mentoring sudah selesai?')) {
        try {
            const response = await api.post('/mentor/complete-session/', { 
                booking_id: bookingId 
            });
            console.log('Complete session response:', response.data);
            
            showFlash('success', 'Sesi selesai! Pendapatan akan masuk ke saldo Anda.');
            await fetchAll(); // Refresh data
        } catch (err) {
            console.error('Error:', err);
            showFlash('error', err.response?.data?.error || 'Gagal menyelesaikan sesi');
        }
    }
};

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) < 50000) { showFlash('error', 'Minimal pencairan Rp 50.000'); return; }
    if (!withdrawBank || !withdrawAccNum || !withdrawAccName) { showFlash('error', 'Lengkapi info rekening'); return; }
    try {
      await api.post('/payments/withdraw/', { amount: withdrawAmount, bank_name: withdrawBank, account_number: withdrawAccNum, account_name: withdrawAccName });
      showFlash('success', `Pencairan Rp ${Number(withdrawAmount).toLocaleString('id-ID')} berhasil diajukan!`);
      setWithdrawAmount(''); setWithdrawBank(''); setWithdrawAccNum(''); setWithdrawAccName('');
      fetchAll();
    } catch (e) { showFlash('error', e.response?.data?.error || 'Gagal mengajukan pencairan'); }
  };

  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const safeActiveSessions = Array.isArray(activeSessions) ? activeSessions : [];
  const safeBookingRequests = Array.isArray(bookingRequests) ? bookingRequests : [];

  const avgRating = safeReviews.length > 0 ? (safeReviews.reduce((s,r) => s + r.rating, 0) / safeReviews.length).toFixed(1) : '0.0';

  // Pisahkan sesi berdasarkan status
  const ongoingSess   = safeActiveSessions.filter(s => ['accepted','ongoing'].includes(s.status));
  const historySess   = safeActiveSessions.filter(s => ['completed','paid'].includes(s.status));
  const pendingCount  = safeBookingRequests.length;
  const ongoingCount  = ongoingSess.length;

  const S = {
    wrap:      { display:'flex', minHeight:'100vh', background:'linear-gradient(145deg,#cfe9ff 0%,#a0c4e8 50%,#7db4e6 100%)', fontFamily:"'Inter',-apple-system,sans-serif" },
    sidebar:   { width:'260px', background:'rgba(255,255,255,0.92)', backdropFilter:'blur(14px)', padding:'24px 16px', height:'100vh', position:'fixed', overflowY:'auto', borderRight:'1px solid rgba(255,255,255,0.6)', zIndex:10 },
    logo:      { fontSize:'20px', fontWeight:'800', color:'#1e4a76', marginBottom:'20px', paddingBottom:'16px', borderBottom:'1px solid rgba(30,74,118,0.12)', display:'flex', alignItems:'center', gap:'8px' },
    userBox:   { padding:'14px', background:'rgba(42,107,158,0.1)', borderRadius:'14px', marginBottom:'20px', border:'1px solid rgba(42,107,158,0.12)' },
    uName:     { fontSize:'15px', fontWeight:'700', color:'#1e4a76' },
    uEmail:    { fontSize:'12px', color:'#4a7a9b', marginTop:'4px' },
    uRating:   { fontSize:'12px', color:'#f59e0b', marginTop:'6px', fontWeight:'600' },
    nav:       { display:'flex', alignItems:'center', gap:'10px', width:'100%', padding:'10px 14px', background:'transparent', border:'none', borderRadius:'12px', color:'#2c5a7a', fontSize:'13px', fontWeight:'500', cursor:'pointer', marginBottom:'3px', textAlign:'left' },
    navOn:     { background:'rgba(42,107,158,0.15)', color:'#0d3b5e', fontWeight:'700' },
    badge:     { background:'#e74c3c', color:'#fff', borderRadius:'20px', padding:'2px 7px', fontSize:'10px', marginLeft:'auto', fontWeight:'700' },
    logout:    { width:'100%', padding:'10px 14px', background:'rgba(220,38,38,0.1)', border:'1px solid rgba(220,38,38,0.2)', borderRadius:'12px', color:'#b91c1c', cursor:'pointer', marginTop:'16px', display:'flex', alignItems:'center', gap:'10px', fontSize:'13px', fontWeight:'600' },
    main:      { marginLeft:'260px', padding:'28px 32px', width:'calc(100% - 260px)', minHeight:'100vh' },
    h1:        { fontSize:'26px', fontWeight:'800', color:'#0a2a3a', margin:'0 0 4px 0' },
    sub:       { fontSize:'13px', color:'#2c5a7a', marginBottom:'24px' },
    card:      { background:'rgba(255,255,255,0.82)', borderRadius:'16px', padding:'20px', marginBottom:'14px', border:'1px solid rgba(255,255,255,0.6)', backdropFilter:'blur(8px)' },
    secTitle:  { fontSize:'16px', fontWeight:'700', color:'#1e4a76', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' },
    statsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'12px', marginBottom:'20px' },
    statCard:  { background:'rgba(255,255,255,0.82)', borderRadius:'14px', padding:'18px', border:'1px solid rgba(255,255,255,0.6)', textAlign:'center' },
    statLabel: { fontSize:'12px', color:'#4a7a9b', marginBottom:'6px' },
    statVal:   { fontSize:'26px', fontWeight:'800', color:'#1e4a76' },
    flashOk:   { background:'#d4edda', color:'#155724', padding:'12px 16px', borderRadius:'12px', marginBottom:'16px', fontWeight:'500', display:'flex', alignItems:'center', gap:'8px' },
    flashErr:  { background:'#f8d7da', color:'#721c24', padding:'12px 16px', borderRadius:'12px', marginBottom:'16px', fontWeight:'500' },
    empty:     { textAlign:'center', padding:'40px', color:'#4a7a9b', background:'rgba(255,255,255,0.4)', borderRadius:'12px' },
    table:     { width:'100%', borderCollapse:'collapse' },
    th:        { textAlign:'left', padding:'11px 14px', borderBottom:'1px solid rgba(100,150,200,0.25)', color:'#1e4a76', fontSize:'12px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'.04em' },
    td:        { padding:'12px 14px', borderBottom:'1px solid rgba(100,150,200,0.15)', color:'#2c5a7a', fontSize:'13px' },
    btnPri:    { background:'linear-gradient(135deg,#2a6b9e,#1a4a7e)', color:'#fff', border:'none', padding:'9px 18px', borderRadius:'10px', cursor:'pointer', fontSize:'13px', fontWeight:'600', display:'inline-flex', alignItems:'center', gap:'6px' },
    btnOk:     { background:'#16a34a', color:'#fff', border:'none', padding:'6px 13px', borderRadius:'8px', cursor:'pointer', fontSize:'12px', fontWeight:'600', marginRight:'6px' },
    btnRed:    { background:'#dc2626', color:'#fff', border:'none', padding:'6px 13px', borderRadius:'8px', cursor:'pointer', fontSize:'12px', fontWeight:'600', marginRight:'6px' },
    btnAmb:    { background:'#f97316', color:'#fff', border:'none', padding:'6px 13px', borderRadius:'8px', cursor:'pointer', fontSize:'12px', fontWeight:'600', marginRight:'6px' },
    btnOut:    { background:'transparent', color:'#2a6b9e', border:'1px solid #2a6b9e', padding:'6px 13px', borderRadius:'8px', cursor:'pointer', fontSize:'12px', fontWeight:'600', marginRight:'6px' },
    input:     { width:'100%', padding:'10px 14px', border:'1.5px solid rgba(100,150,200,0.25)', borderRadius:'10px', fontSize:'13px', background:'rgba(255,255,255,0.7)', outline:'none', boxSizing:'border-box' },
    textarea:  { width:'100%', padding:'10px 14px', border:'1.5px solid rgba(100,150,200,0.25)', borderRadius:'10px', fontSize:'13px', background:'rgba(255,255,255,0.7)', outline:'none', boxSizing:'border-box', minHeight:'90px', fontFamily:'inherit', resize:'vertical' },
    label:     { display:'block', fontSize:'12px', fontWeight:'700', color:'#1e4a76', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'.04em' },
    fGroup:    { marginBottom:'14px' },
    slotRow:   { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 14px', background:'rgba(255,255,255,0.6)', borderRadius:'10px', marginBottom:'8px', border:'1px solid rgba(100,150,200,0.15)' },
    overlay:   { position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 },
    modal:     { background:'#fff', borderRadius:'20px', padding:'28px', width:'440px', maxWidth:'94%', boxShadow:'0 20px 60px rgba(0,0,0,0.25)' },
    mTitle:    { fontSize:'18px', fontWeight:'800', color:'#1e4a76', marginBottom:'6px' },
    mSub:      { fontSize:'13px', color:'#4a7a9b', marginBottom:'20px', lineHeight:'1.5' },
    meetLink:  { display:'inline-flex', alignItems:'center', gap:'5px', color:'#2a6b9e', textDecoration:'none', fontSize:'13px', fontWeight:'600' },
    invBox:    { display:'inline-flex', alignItems:'center', gap:'6px', background:'#fff3cd', border:'1px solid #ffc107', borderRadius:'8px', padding:'6px 12px', fontSize:'12px', fontWeight:'700', color:'#856404' },
    invPaid:   { display:'inline-flex', alignItems:'center', gap:'6px', background:'#d4edda', border:'1px solid #c3e6cb', borderRadius:'8px', padding:'6px 12px', fontSize:'12px', fontWeight:'700', color:'#155724' },
  };

  if (loading) return <div style={{ ...S.wrap, alignItems:'center', justifyContent:'center' }}><p style={{ color:'#1e4a76', fontWeight:'700' }}>Memuat data...</p></div>;

  return (
    <div style={S.wrap}>
      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside style={S.sidebar}>
        <div style={S.logo}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2a6b9e" strokeWidth="2.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          EduMatch
        </div>
        <div style={S.userBox}>
          <div style={S.uName}>👨‍🏫 {user?.username}</div>
          <div style={S.uEmail}>{user?.email}</div>
          <div style={S.uRating}>⭐ Rating: {avgRating} / 5.0</div>
        </div>
        {[
          { id:'overview',  label:'Overview',           icon:<Ic.Overview /> },
          { id:'profile',   label:'Kelola Profil',       icon:<Ic.User /> },
          { id:'schedule',  label:'Jadwal Saya',          icon:<Ic.Calendar /> },
          { id:'bookings',  label:'Permintaan Booking',   icon:<Ic.Booking />,  badge: pendingCount },
          { id:'sessions',  label:'Sesi Aktif',           icon:<Ic.Session />,  badge: ongoingCount },
          { id:'history',   label:'Riwayat Sesi',         icon:<Ic.Calendar /> },
          { id:'reviews',   label:'Ulasan & Rating',      icon:<Ic.Star />,     badge: reviews.length > 0 ? reviews.length : 0 },
          { id:'earnings',  label:'Pendapatan',            icon:<Ic.Money /> },
        ].map(({ id, label, icon, badge }) => (
          <button key={id} onClick={() => setTab(id)} style={{ ...S.nav, ...(tab===id ? S.navOn : {}) }}>
            {icon} <span>{label}</span>
            {badge > 0 && <span style={S.badge}>{badge}</span>}
          </button>
        ))}
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={S.logout}><Ic.Logout /> Logout</button>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────── */}
      <main style={S.main}>
        <h1 style={S.h1}>Dashboard Mentor</h1>
        <p style={S.sub}>Kelola jadwal, sesi mentoring, dan pendapatan kamu</p>

        {flash.msg && <div style={flash.type==='success' ? S.flashOk : S.flashErr}>{flash.type==='success' ? <Ic.Check /> : '⚠️'} {flash.msg}</div>}

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <>
            <div style={S.statsGrid}>
              {[
                ['Total Sesi', activeSessions.length],
                ['Menunggu Bayar', earnings.unpaid_sessions],
                ['Sesi Selesai', historySess.length],
                ['Total Pendapatan', `Rp ${earnings.total?.toLocaleString('id-ID')}`],
                ['Saldo Tersedia', `Rp ${earnings.available?.toLocaleString('id-ID')}`],
                ['Rating', `⭐ ${avgRating}`],
              ].map(([label, val]) => (
                <div key={label} style={S.statCard}>
                  <div style={S.statLabel}>{label}</div>
                  <div style={{ ...S.statVal, fontSize: typeof val === 'string' && val.length > 8 ? '18px' : '26px' }}>{val}</div>
                </div>
              ))}
            </div>
            {/* Alert pending */}
            {pendingCount > 0 && (
              <div style={{ ...S.card, border:'1.5px solid #ffc107', background:'#fffbeb' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontWeight:'700', color:'#856404' }}>🔔 {pendingCount} permintaan booking menunggu konfirmasi</span>
                  <button style={S.btnPri} onClick={() => setTab('bookings')}>Lihat →</button>
                </div>
              </div>
            )}
            {earnings.unpaid_sessions > 0 && (
              <div style={{ ...S.card, border:'1.5px solid #a0c4e8', background:'#eff6ff' }}>
                <span style={{ fontWeight:'700', color:'#1e4a76' }}>💰 {earnings.unpaid_sessions} sesi menunggu pembayaran dari mentee</span>
              </div>
            )}
          </>
        )}

        {/* PROFIL */}
        {tab === 'profile' && (
          <div style={S.card}>
            <div style={S.secTitle}><Ic.User /> Kelola Profil Mentor</div>
            <form onSubmit={handleUpdateProfile}>
              {[
                ['Keahlian (pisahkan dengan koma)', 'skills', 'text', 'Python, React, Data Science...'],
                ['Harga per Sesi (Rp)', 'price_per_session', 'number', '75000'],
                ['Pendidikan Terakhir', 'education', 'text', 'S1 Teknik Informatika - UI'],
              ].map(([label, key, type, ph]) => (
                <div key={key} style={S.fGroup}>
                  <label style={S.label}>{label}</label>
                  <input type={type} value={profile[key]} placeholder={ph} onChange={e => setProfile({ ...profile, [key]: type==='number' ? parseInt(e.target.value)||0 : e.target.value })} style={S.input} />
                </div>
              ))}
              <div style={S.fGroup}>
                <label style={S.label}>Bio / Deskripsi</label>
                <textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} style={S.textarea} placeholder="Ceritakan pengalamanmu sebagai mentor..." />
              </div>
              <button type="submit" style={S.btnPri}>Simpan Profil</button>
            </form>
          </div>
        )}

        {/* JADWAL */}
        {tab === 'schedule' && (
          <div style={S.card}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <div style={S.secTitle}><Ic.Calendar /> Jadwal Ketersediaan</div>
              <button style={S.btnPri} onClick={() => setShowSlotModal(true)}><Ic.Plus /> Tambah Jadwal</button>
            </div>
            {profile.available_slots.length === 0
              ? <div style={S.empty}><Ic.Calendar /><p style={{ marginTop:'10px' }}>Belum ada jadwal. Tambahkan jadwal ketersediaanmu.</p></div>
              : profile.available_slots.map(slot => (
                <div key={slot.id} style={S.slotRow}>
                  <span style={{ fontWeight:'600', color:'#1e4a76' }}>📅 {slot.date} — {slot.time}</span>
                  <button style={S.btnRed} onClick={() => handleDeleteSlot(slot.id)}><Ic.Trash /> Hapus</button>
                </div>
              ))
            }
          </div>
        )}

        {/* PERMINTAAN BOOKING */}
        {tab === 'bookings' && (
          <div style={S.card}>
            <div style={S.secTitle}><Ic.Booking /> Permintaan Booking</div>
            {bookingRequests.length === 0
              ? <div style={S.empty}><Ic.Booking /><p style={{ marginTop:'10px' }}>Tidak ada permintaan booking.</p></div>
              : <table style={S.table}>
                  <thead><tr><th style={S.th}>Mentee</th><th style={S.th}>Tanggal</th><th style={S.th}>Catatan</th><th style={S.th}>Aksi</th></tr></thead>
                  <tbody>
                    {bookingRequests.map(b => (
                      <tr key={b.id}>
                        <td style={S.td}><strong>{b.mentee_name}</strong></td>
                        <td style={S.td}>{new Date(b.date).toLocaleString('id-ID', { dateStyle:'long', timeStyle:'short' })}</td>
                        <td style={S.td}>{b.notes || <span style={{ color:'#aaa' }}>-</span>}</td>
                        <td style={S.td}>
                          <button style={S.btnOk} onClick={() => handleConfirmBooking(b.id,'accept')}><Ic.Check /> Terima</button>
                          <button style={S.btnRed} onClick={() => handleConfirmBooking(b.id,'reject')}><Ic.Close /> Tolak</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </div>
        )}

        {/* SESI AKTIF */}
        {tab === 'sessions' && (
          <div style={S.card}>
            <div style={S.secTitle}><Ic.Session /> Sesi Aktif</div>
            {ongoingSess.length === 0
              ? <div style={S.empty}><Ic.Session /><p style={{ marginTop:'10px' }}>Tidak ada sesi aktif.</p></div>
              : <table style={S.table}>
                  <thead><tr><th style={S.th}>Mentee</th><th style={S.th}>Tanggal</th><th style={S.th}>Meeting Link</th><th style={S.th}>Status</th><th style={S.th}>Aksi</th></tr></thead>
                  <tbody>
                    {ongoingSess.map(s => (
                      <tr key={s.id}>
                        <td style={S.td}><strong>{s.mentee_name}</strong></td>
                        <td style={S.td}>{new Date(s.date).toLocaleString('id-ID', { dateStyle:'medium', timeStyle:'short' })}</td>
                        <td style={S.td}>
                          {s.meeting_link
                            ? <a href={s.meeting_link} target="_blank" rel="noopener noreferrer" style={S.meetLink}><Ic.Link /> Join</a>
                            : <span style={{ color:'#aaa', fontSize:'12px' }}>Belum ada</span>
                          }
                        </td>
                        <td style={S.td}><Badge s={s.status} /></td>
                        <td style={S.td}>
                          {s.status === 'accepted'
                            ? <button style={S.btnAmb} onClick={() => handleStartSession(s.id)}>▶ Mulai Sesi</button>
                            : <button style={S.btnOk} onClick={() => handleCompleteSession(s.id)}><Ic.Check /> Selesai</button>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </div>
        )}

        {/* RIWAYAT SESI */}
        {tab === 'history' && (
          <div style={S.card}>
            <div style={S.secTitle}><Ic.Calendar /> Riwayat Sesi</div>
            {historySess.length === 0
              ? <div style={S.empty}><Ic.Calendar /><p style={{ marginTop:'10px' }}>Belum ada riwayat sesi.</p></div>
              : <table style={S.table}>
                  <thead><tr><th style={S.th}>Mentee</th><th style={S.th}>Tanggal</th><th style={S.th}>Tagihan</th><th style={S.th}>Status</th></tr></thead>
                  <tbody>
                    {historySess.map(s => (
                      <tr key={s.id}>
                        <td style={S.td}><strong>{s.mentee_name}</strong></td>
                        <td style={S.td}>{new Date(s.date).toLocaleString('id-ID', { dateStyle:'medium', timeStyle:'short' })}</td>
                        <td style={S.td}>
                          {s.status === 'paid'
                            ? <span style={S.invPaid}><Ic.Check /> Rp {Number(s.invoice_amount).toLocaleString('id-ID')} — Lunas</span>
                            : <span style={S.invBox}>🧾 Rp {Number(s.invoice_amount).toLocaleString('id-ID')} — Menunggu</span>
                          }
                        </td>
                        <td style={S.td}><Badge s={s.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </div>
        )}

        {/* ULASAN */}
        {tab === 'reviews' && (
          <div style={S.card}>
            <div style={S.secTitle}><Ic.Star /> Ulasan dari Mentee</div>
            {reviews.length === 0
              ? <div style={S.empty}><Ic.Star /><p style={{ marginTop:'10px' }}>Belum ada ulasan.</p></div>
              : reviews.map(r => (
                <div key={r.id} style={{ ...S.card, marginBottom:'10px', border:'1px solid rgba(100,150,200,0.2)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                    <strong style={{ color:'#1e4a76' }}>{r.mentee_name}</strong>
                    <span style={{ fontSize:'12px', color:'#aaa' }}>{r.created_at}</span>
                  </div>
                  <div style={{ color:'#f59e0b', marginBottom:'8px' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)} <span style={{ color:'#555', fontSize:'12px' }}>{r.rating}/5.0</span></div>
                  <p style={{ color:'#2c5a7a', fontSize:'13px', lineHeight:'1.6', margin:0 }}>{r.comment}</p>
                </div>
              ))
            }
          </div>
        )}

        {/* PENDAPATAN */}
        {tab === 'earnings' && (
          <>
            <div style={S.statsGrid}>
              {[
                ['Total Pendapatan (setelah fee)', `Rp ${earnings.total?.toLocaleString('id-ID')}`],
                ['Saldo Tersedia', `Rp ${earnings.available?.toLocaleString('id-ID')}`],
                ['Sudah Dicairkan', `Rp ${earnings.withdrawn?.toLocaleString('id-ID')}`],
                ['Menunggu Pembayaran', `${earnings.unpaid_sessions} sesi`],
              ].map(([label, val]) => (
                <div key={label} style={S.statCard}>
                  <div style={S.statLabel}>{label}</div>
                  <div style={{ ...S.statVal, fontSize:'18px' }}>{val}</div>
                </div>
              ))}
            </div>

            <div style={S.card}>
              <div style={S.secTitle}><Ic.Money /> Ajukan Pencairan Saldo</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'12px' }}>
                <div style={S.fGroup}>
                  <label style={S.label}>Jumlah (Rp)</label>
                  <input type="number" placeholder="Min. 50.000" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} style={S.input} />
                </div>
                <div style={S.fGroup}>
                  <label style={S.label}>Nama Bank</label>
                  <select value={withdrawBank} onChange={e => setWithdrawBank(e.target.value)} style={S.input}>
                    <option value="">Pilih Bank</option>
                    {['BCA','BNI','BRI','Mandiri','BSI','CIMB Niaga','Jenius','GoPay','OVO'].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div style={S.fGroup}>
                  <label style={S.label}>No. Rekening</label>
                  <input type="text" placeholder="1234567890" value={withdrawAccNum} onChange={e => setWithdrawAccNum(e.target.value)} style={S.input} />
                </div>
                <div style={S.fGroup}>
                  <label style={S.label}>Atas Nama</label>
                  <input type="text" placeholder="Nama pemilik rekening" value={withdrawAccName} onChange={e => setWithdrawAccName(e.target.value)} style={S.input} />
                </div>
              </div>
              <button style={S.btnPri} onClick={handleWithdraw}><Ic.Money /> Ajukan Pencairan</button>
              <p style={{ fontSize:'12px', color:'#aaa', marginTop:'10px' }}>Dana diproses admin dalam 1–3 hari kerja. Fee platform sudah dipotong otomatis.</p>
            </div>
          </>
        )}
      </main>

      {/* Modal Tambah Jadwal */}
      {showSlotModal && (
        <div style={S.overlay} onClick={() => setShowSlotModal(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={S.mTitle}>Tambah Jadwal</div>
            <div style={S.mSub}>Pilih tanggal dan waktu ketersediaanmu</div>
            <form onSubmit={handleAddSlot}>
              <div style={S.fGroup}>
                <label style={S.label}>Tanggal</label>
                <input type="date" value={newSlot.date} onChange={e => setNewSlot({ ...newSlot, date: e.target.value })} style={S.input} required />
              </div>
              <div style={S.fGroup}>
                <label style={S.label}>Waktu</label>
                <select value={newSlot.time} onChange={e => setNewSlot({ ...newSlot, time: e.target.value })} style={S.input} required>
                  <option value="">Pilih waktu</option>
                  {['07:00','08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00','19:00','20:00','21:00'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
                <button type="button" style={S.btnOut} onClick={() => setShowSlotModal(false)}>Batal</button>
                <button type="submit" style={S.btnPri}>Simpan Jadwal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Meeting Link */}
      {showMeetModal && (
        <div style={S.overlay} onClick={() => setShowMeetModal(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={S.mTitle}>🔗 Input Meeting Link</div>
            <div style={S.mSub}>Masukkan link Google Meet atau Zoom. Link akan otomatis diterima mentee.</div>
            <form onSubmit={handleSubmitMeetLink}>
              <div style={S.fGroup}>
                <label style={S.label}>Meeting Link</label>
                <input type="url" placeholder="https://meet.google.com/xxx-xxxx-xxx" value={meetLink} onChange={e => setMeetLink(e.target.value)} style={S.input} required autoFocus />
              </div>
              <p style={{ fontSize:'12px', color:'#aaa', marginBottom:'16px' }}>Contoh: https://meet.google.com/abc-defg-hij</p>
              <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
                <button type="button" style={S.btnOut} onClick={() => setShowMeetModal(false)}>Batal</button>
                <button type="submit" style={S.btnPri}>Mulai Sesi & Kirim Link →</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}