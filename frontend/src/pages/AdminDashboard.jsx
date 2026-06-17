import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// ─── SVG Icons ─────────────────────────────────────────────────────────────────
const Ic = {
  Overview: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M12 17V5"/><path d="M6 17v-3"/></svg>),
  Verify:   () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>),
  Mentor:   () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  Mentee:   () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
  Booking:  () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
  Payment:  () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>),
  Withdraw: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>),
  Finance:  () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>),
  Logout:   () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>),
  Plus:     () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  Edit:     () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  Trash:    () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>),
  Check:    () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  Close:    () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  Search:   () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
};

// ─── Status Badge ───────────────────────────────────────────────────────────────
const BOOKING_STATUS = {
  pending:   { bg:'#fff3cd', color:'#856404', text:'Menunggu' },
  accepted:  { bg:'#cce5ff', color:'#004085', text:'Diterima' },
  ongoing:   { bg:'#d4edda', color:'#155724', text:'Berlangsung' },
  completed: { bg:'#fff3cd', color:'#856404', text:'Selesai' },
  paid:      { bg:'#d4edda', color:'#155724', text:'Lunas' },
  rejected:  { bg:'#f8d7da', color:'#721c24', text:'Ditolak' },
  cancelled: { bg:'#f8d7da', color:'#721c24', text:'Dibatalkan' },
};
const PAYMENT_STATUS = {
  pending: { bg:'#fff3cd', color:'#856404', text:'Pending' },
  success: { bg:'#d4edda', color:'#155724', text:'Berhasil' },
  failed:  { bg:'#f8d7da', color:'#721c24', text:'Gagal' },
};
const WITHDRAW_STATUS = {
  pending:  { bg:'#fff3cd', color:'#856404', text:'Menunggu' },
  approved: { bg:'#d4edda', color:'#155724', text:'Disetujui' },
  rejected: { bg:'#f8d7da', color:'#721c24', text:'Ditolak' },
};
const Badge = ({ status, map }) => {
  const m = map || BOOKING_STATUS;
  const c = m[status] || { bg:'#eee', color:'#555', text: status };
  return <span style={{ background:c.bg, color:c.color, padding:'3px 10px', borderRadius:'99px', fontSize:'11px', fontWeight:'700', whiteSpace:'nowrap' }}>{c.text}</span>;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab]                     = useState('overview');
  const [loading, setLoading]             = useState(true);
  const [stats, setStats]                 = useState({});
  const [pendingMentors, setPendingMentors] = useState([]);
  const [allMentors, setAllMentors]       = useState([]);
  const [allMentees, setAllMentees]       = useState([]);
  const [allBookings, setAllBookings]     = useState([]);
  const [allPayments, setAllPayments]     = useState([]);
  const [withdrawals, setWithdrawals]     = useState([]);
  const [transactions, setTransactions]   = useState([]);
  const [transactionStats, setTransactionStats] = useState({ total: 0, revenue: 0, commission: 0 });
  const [flash, setFlash]                 = useState({ type:'', msg:'' });
  const [search, setSearch]               = useState('');
  const [bookingFilter, setBookingFilter] = useState('');

  // Modal
  const [showModal, setShowModal]         = useState(false);
  const [modalType, setModalType]         = useState('');
  const [modalAction, setModalAction]     = useState('');
  const [selectedData, setSelectedData]   = useState(null);
  const [form, setForm]                   = useState({ username:'', email:'', university:'', phone:'', password:'' });

  // Withdraw modal
  const [showWdModal, setShowWdModal]     = useState(false);
  const [selectedWd, setSelectedWd]       = useState(null);
  const [wdNote, setWdNote]               = useState('');

  const showFlash = (type, msg) => { setFlash({ type, msg }); setTimeout(() => setFlash({ type:'', msg:'' }), 4000); };

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    try {
      const res = await api.get('/auth/me/');
      if (res.data.role !== 'admin') { navigate('/login'); return; }
      await fetchAll();
    } catch { localStorage.clear(); navigate('/login'); }
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsR, pendR, mentR, menteR, bookR, payR, wdR] = await Promise.all([
        api.get('/admin/stats/'),
        api.get('/admin/pending-mentors/'),
        api.get('/admin/all-mentors/'),
        api.get('/admin/all-mentees/'),
        api.get('/admin/bookings/'),
        api.get('/admin/payments/'),
        api.get('/admin/withdraw-requests/'),
      ]);
      setStats(statsR.data || {});
      setPendingMentors(pendR.data.results || pendR.data || []);
      setAllMentors(mentR.data.results || mentR.data || []);
      setAllMentees(menteR.data.results || menteR.data || []);
      setAllBookings(bookR.data.results || bookR.data || []);
      setAllPayments(payR.data.results || payR.data || []);
      setWithdrawals(wdR.data.results || wdR.data || []);
      
      // Panggil fetchTransactions
      await fetchTransactions();
    } catch (e) { showFlash('error', 'Gagal memuat data'); }
    finally { setLoading(false); }
  };

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/admin/transactions/');
      const data = res.data.results || res.data || [];
      setTransactions(data);
      const paid = data.filter(t => t.status === 'Berhasil');
      const total = paid.length;
      const revenue = paid.reduce((sum, t) => sum + (t.nominal || 0), 0);
      const commission = paid.reduce((sum, t) => sum + (t.komisi || 0), 0);
      setTransactionStats({ total, revenue, commission });
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  // ── Verifikasi Mentor ──────────────────────────────────────────────────────
  const handleVerify = async (mentorId, action) => {
    try {
      await api.post('/admin/pending-mentors/', { mentor_id: mentorId, action });
      showFlash('success', action === 'approve' ? 'Mentor disetujui!' : 'Mentor ditolak');
      fetchAll();
    } catch { showFlash('error', 'Gagal memproses verifikasi'); }
  };

  // ── CRUD Modal ─────────────────────────────────────────────────────────────
  const openModal = (type, action, data = null) => {
    setModalType(type); setModalAction(action); setSelectedData(data);
    setForm(data ? { username:data.username, email:data.email, university:data.university||'', phone:data.phone||'', password:'' }
                 : { username:'', email:'', university:'', phone:'', password:'' });
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    const url = modalType === 'mentor' ? '/admin/mentors/' : '/admin/mentees/';
    try {
      if (modalAction === 'add') {
        await api.post(url, form);
        showFlash('success', `${modalType === 'mentor' ? 'Mentor' : 'Mentee'} berhasil ditambahkan`);
      } else {
        await api.put(`${url}${selectedData.id}/`, form);
        showFlash('success', 'Data berhasil diperbarui');
      }
      setShowModal(false); fetchAll();
    } catch (e) { showFlash('error', e.response?.data?.error || 'Gagal menyimpan data'); }
  };

  const handleDelete = async (type, id, name) => {
    if (!window.confirm(`Hapus ${name}?`)) return;
    const url = type === 'mentor' ? `/admin/mentors/${id}/` : `/admin/mentees/${id}/`;
    try { await api.delete(url); showFlash('success', `${name} berhasil dihapus`); fetchAll(); }
    catch { showFlash('error', 'Gagal menghapus'); }
  };

  // ── Withdrawal ─────────────────────────────────────────────────────────────
  const openWdModal = (wd) => { setSelectedWd(wd); setWdNote(''); setShowWdModal(true); };
  const handleWdAction = async (action) => {
    try {
      await api.post('/admin/withdraw-requests/', { withdrawal_id: selectedWd.id, action, admin_note: wdNote });
      showFlash('success', action === 'approve' ? 'Pencairan disetujui!' : 'Pencairan ditolak');
      setShowWdModal(false); fetchAll();
    } catch { showFlash('error', 'Gagal memproses pencairan'); }
  };

  // ── Filter helpers ─────────────────────────────────────────────────────────
  const filterSearch = (arr, keys) => {
    if (!search) return arr;
    return arr.filter(item => keys.some(k => String(item[k]||'').toLowerCase().includes(search.toLowerCase())));
  };
  const filteredBookings = allBookings.filter(b => {
    const matchStatus = !bookingFilter || b.status === bookingFilter;
    const matchSearch = !search || b.mentee_name?.toLowerCase().includes(search.toLowerCase()) || b.mentor_name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const financeSummary = [
    ['Total Pembayaran Masuk', `Rp ${allPayments.filter(p=>p.status==='success').reduce((s,p)=>s+(p.amount||0),0).toLocaleString('id-ID')}`],
    ['Komisi Platform (10%)', `Rp ${(stats.platform_commission||0).toLocaleString('id-ID')}`],
    ['Pencairan Disetujui', `Rp ${withdrawals.filter(w=>w.status==='approved').reduce((s,w)=>s+(w.amount||0),0).toLocaleString('id-ID')}`],
    ['Menunggu Pencairan', withdrawals.filter(w=>w.status==='pending').length + ' permintaan'],
  ];

  const S = {
    wrap:      { display:'flex', minHeight:'100vh', background:'linear-gradient(145deg,#cfe9ff 0%,#a0c4e8 50%,#7db4e6 100%)', fontFamily:"'Inter',-apple-system,sans-serif" },
    sidebar:   { width:'240px', background:'rgba(255,255,255,0.92)', backdropFilter:'blur(14px)', padding:'20px 14px', height:'100vh', position:'fixed', overflowY:'auto', borderRight:'1px solid rgba(255,255,255,0.6)', zIndex:10 },
    logo:      { fontSize:'18px', fontWeight:'800', color:'#1e4a76', marginBottom:'18px', paddingBottom:'14px', borderBottom:'1px solid rgba(30,74,118,0.12)', display:'flex', alignItems:'center', gap:'8px' },
    adminTag:  { fontSize:'10px', background:'#e53e3e', color:'#fff', borderRadius:'6px', padding:'2px 6px', fontWeight:'700', letterSpacing:'.04em' },
    nav:       { display:'flex', alignItems:'center', gap:'9px', width:'100%', padding:'9px 12px', background:'transparent', border:'none', borderRadius:'10px', color:'#2c5a7a', fontSize:'13px', fontWeight:'500', cursor:'pointer', marginBottom:'2px', textAlign:'left' },
    navOn:     { background:'rgba(42,107,158,0.15)', color:'#0d3b5e', fontWeight:'700' },
    badge:     { background:'#e74c3c', color:'#fff', borderRadius:'20px', padding:'2px 7px', fontSize:'10px', marginLeft:'auto', fontWeight:'700' },
    navSec:    { fontSize:'10px', color:'#aaa', fontWeight:'700', textTransform:'uppercase', letterSpacing:'.08em', padding:'12px 12px 4px', marginTop:'8px' },
    logout:    { width:'100%', padding:'9px 12px', background:'rgba(220,38,38,0.1)', border:'1px solid rgba(220,38,38,0.2)', borderRadius:'10px', color:'#b91c1c', cursor:'pointer', marginTop:'14px', display:'flex', alignItems:'center', gap:'9px', fontSize:'13px', fontWeight:'600' },
    main:      { marginLeft:'240px', padding:'28px 32px', width:'calc(100% - 240px)', minHeight:'100vh' },
    h1:        { fontSize:'24px', fontWeight:'800', color:'#0a2a3a', margin:'0 0 4px 0' },
    sub:       { fontSize:'13px', color:'#2c5a7a', marginBottom:'24px' },
    card:      { background:'rgba(255,255,255,0.82)', borderRadius:'16px', padding:'20px', marginBottom:'14px', border:'1px solid rgba(255,255,255,0.6)', backdropFilter:'blur(8px)' },
    secTitle:  { fontSize:'15px', fontWeight:'700', color:'#1e4a76', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' },
    statsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:'12px', marginBottom:'20px' },
    statCard:  { background:'rgba(255,255,255,0.85)', borderRadius:'14px', padding:'16px 18px', border:'1px solid rgba(255,255,255,0.6)' },
    statLabel: { fontSize:'11px', color:'#4a7a9b', marginBottom:'6px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'.04em' },
    statVal:   { fontSize:'24px', fontWeight:'800', color:'#1e4a76' },
    statSub:   { fontSize:'11px', color:'#aaa', marginTop:'2px' },
    flashOk:   { background:'#d4edda', color:'#155724', padding:'12px 16px', borderRadius:'12px', marginBottom:'16px', fontWeight:'500', display:'flex', alignItems:'center', gap:'8px' },
    flashErr:  { background:'#f8d7da', color:'#721c24', padding:'12px 16px', borderRadius:'12px', marginBottom:'16px', fontWeight:'500' },
    empty:     { textAlign:'center', padding:'40px', color:'#4a7a9b', background:'rgba(255,255,255,0.4)', borderRadius:'12px' },
    table:     { width:'100%', borderCollapse:'collapse' },
    th:        { textAlign:'left', padding:'10px 14px', borderBottom:'1px solid rgba(100,150,200,0.25)', color:'#1e4a76', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'.05em' },
    td:        { padding:'11px 14px', borderBottom:'1px solid rgba(100,150,200,0.12)', color:'#2c5a7a', fontSize:'13px', verticalAlign:'middle' },
    btnPri:    { background:'linear-gradient(135deg,#2a6b9e,#1a4a7e)', color:'#fff', border:'none', padding:'8px 16px', borderRadius:'10px', cursor:'pointer', fontSize:'12px', fontWeight:'700', display:'inline-flex', alignItems:'center', gap:'5px' },
    btnOk:     { background:'#16a34a', color:'#fff', border:'none', padding:'5px 12px', borderRadius:'8px', cursor:'pointer', fontSize:'12px', fontWeight:'600', marginRight:'5px', display:'inline-flex', alignItems:'center', gap:'4px' },
    btnRed:    { background:'#dc2626', color:'#fff', border:'none', padding:'5px 12px', borderRadius:'8px', cursor:'pointer', fontSize:'12px', fontWeight:'600', marginRight:'5px', display:'inline-flex', alignItems:'center', gap:'4px' },
    btnOut:    { background:'transparent', color:'#2a6b9e', border:'1.5px solid #2a6b9e', padding:'5px 12px', borderRadius:'8px', cursor:'pointer', fontSize:'12px', fontWeight:'600', marginRight:'5px', display:'inline-flex', alignItems:'center', gap:'4px' },
    btnAmb:    { background:'#f97316', color:'#fff', border:'none', padding:'5px 12px', borderRadius:'8px', cursor:'pointer', fontSize:'12px', fontWeight:'600', marginRight:'5px', display:'inline-flex', alignItems:'center', gap:'4px' },
    searchRow: { display:'flex', gap:'10px', alignItems:'center', marginBottom:'16px', flexWrap:'wrap' },
    searchIn:  { flex:1, padding:'9px 14px', border:'1.5px solid rgba(42,107,158,0.2)', borderRadius:'10px', fontSize:'13px', background:'white', outline:'none', minWidth:'180px' },
    selIn:     { padding:'9px 14px', border:'1.5px solid rgba(42,107,158,0.2)', borderRadius:'10px', fontSize:'13px', background:'white', outline:'none', color:'#2c5a7a' },
    overlay:   { position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 },
    modal:     { background:'#fff', borderRadius:'20px', padding:'28px', width:'440px', maxWidth:'94%', boxShadow:'0 20px 60px rgba(0,0,0,0.25)', maxHeight:'90vh', overflowY:'auto' },
    mTitle:    { fontSize:'18px', fontWeight:'800', color:'#1e4a76', marginBottom:'18px' },
    input:     { width:'100%', padding:'10px 14px', border:'1.5px solid #e0e0e0', borderRadius:'10px', fontSize:'13px', outline:'none', boxSizing:'border-box', marginBottom:'10px' },
    label:     { display:'block', fontSize:'11px', fontWeight:'700', color:'#4a7a9b', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'.04em' },
  };

  if (loading) return <div style={{ ...S.wrap, alignItems:'center', justifyContent:'center' }}><p style={{ color:'#1e4a76', fontWeight:'700' }}>Memuat data...</p></div>;

  return (
    <div style={S.wrap}>
      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside style={S.sidebar}>
        <div style={S.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2a6b9e" strokeWidth="2.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          EduMatch <span style={S.adminTag}>ADMIN</span>
        </div>

        <div style={S.navSec}>Utama</div>
        <button onClick={() => setTab('overview')} style={{ ...S.nav, ...(tab==='overview'?S.navOn:{}) }}><Ic.Overview /> Overview</button>
        <button onClick={() => setTab('verify')}   style={{ ...S.nav, ...(tab==='verify'?S.navOn:{}) }}>
          <Ic.Verify /> Verifikasi Mentor
          {pendingMentors.length > 0 && <span style={S.badge}>{pendingMentors.length}</span>}
        </button>

        <div style={S.navSec}>Kelola Pengguna</div>
        <button onClick={() => setTab('mentors')}  style={{ ...S.nav, ...(tab==='mentors'?S.navOn:{}) }}><Ic.Mentor /> Kelola Mentor</button>
        <button onClick={() => setTab('mentees')}  style={{ ...S.nav, ...(tab==='mentees'?S.navOn:{}) }}><Ic.Mentee /> Kelola Mentee</button>

        <div style={S.navSec}>Transaksi</div>
        <button onClick={() => setTab('bookings')} style={{ ...S.nav, ...(tab==='bookings'?S.navOn:{}) }}><Ic.Booking /> Semua Booking</button>
        <button onClick={() => setTab('payments')} style={{ ...S.nav, ...(tab==='payments'?S.navOn:{}) }}>
          <Ic.Payment /> Pembayaran
          {allPayments.filter(p=>p.status==='success').length > 0 && <span style={{ ...S.badge, background:'#16a34a' }}>{allPayments.filter(p=>p.status==='success').length}</span>}
        </button>
        <button onClick={() => setTab('withdraw')} style={{ ...S.nav, ...(tab==='withdraw'?S.navOn:{}) }}>
          <Ic.Withdraw /> Pencairan Dana
          {withdrawals.filter(w=>w.status==='pending').length > 0 && <span style={S.badge}>{withdrawals.filter(w=>w.status==='pending').length}</span>}
        </button>
        <button onClick={() => setTab('finance')}  style={{ ...S.nav, ...(tab==='finance'?S.navOn:{}) }}><Ic.Finance /> Laporan Keuangan</button>
        <button onClick={() => setTab('transactions')} style={{ ...S.nav, ...(tab==='transactions'?S.navOn:{}) }}><Ic.Payment /> Riwayat Transaksi</button>

        <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={S.logout}><Ic.Logout /> Logout</button>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────── */}
      <main style={S.main}>
        <h1 style={S.h1}>Dashboard Admin</h1>
        <p style={S.sub}>Kelola seluruh platform EduMatch dari sini</p>

        {flash.msg && <div style={flash.type==='success'?S.flashOk:S.flashErr}>{flash.type==='success'?<Ic.Check />:'⚠️'} {flash.msg}</div>}

        {/* ── OVERVIEW ────────────────────────────────────────────────── */}
        {tab === 'overview' && (<>
          <div style={S.statsGrid}>
            {[
              ['Total Mentor',      stats.total_mentors,     'terverifikasi'],
              ['Menunggu Verif.',   stats.pending_mentors,   'belum disetujui'],
              ['Total Mentee',      stats.total_mentees,     'terdaftar'],
              ['Total Booking',     stats.total_bookings,    'semua status'],
              ['Sesi Lunas',        stats.paid_sessions,     'sudah dibayar'],
              ['Komisi Platform',   `Rp ${(stats.platform_commission||0).toLocaleString('id-ID')}`, '10% dari transaksi'],
            ].map(([label, val, sub]) => (
              <div key={label} style={S.statCard}>
                <div style={S.statLabel}>{label}</div>
                <div style={{ ...S.statVal, fontSize: typeof val === 'string' && val.length > 10 ? '16px' : '24px' }}>{val ?? 0}</div>
                <div style={S.statSub}>{sub}</div>
              </div>
            ))}
          </div>

          {pendingMentors.length > 0 && (
            <div style={{ ...S.card, border:'1.5px solid #ffc107', background:'#fffbeb', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontWeight:'700', color:'#856404' }}>🔔 {pendingMentors.length} mentor menunggu verifikasi</span>
              <button style={S.btnPri} onClick={() => setTab('verify')}>Verifikasi Sekarang →</button>
            </div>
          )}
          {withdrawals.filter(w=>w.status==='pending').length > 0 && (
            <div style={{ ...S.card, border:'1.5px solid #a0c4e8', background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontWeight:'700', color:'#1e4a76' }}>💰 {withdrawals.filter(w=>w.status==='pending').length} permintaan pencairan</span>
              <button style={S.btnPri} onClick={() => setTab('withdraw')}>Proses →</button>
            </div>
          )}

          <div style={S.card}>
            <div style={S.secTitle}><Ic.Payment /> Pembayaran Terbaru</div>
            {allPayments.length === 0
              ? <div style={S.empty}>Belum ada pembayaran</div>
              : <table style={S.table}>
                  <thead><tr><th style={S.th}>Order ID</th><th style={S.th}>Mentee</th><th style={S.th}>Mentor</th><th style={S.th}>Nominal</th><th style={S.th}>Status</th></tr></thead>
                  <tbody>
                    {allPayments.slice(0,5).map(p => (
                      <tr key={p.id}>
                        <td style={S.td}><code style={{ fontSize:'11px', background:'#f5f5f5', padding:'2px 6px', borderRadius:'4px' }}>{p.order_id}</code></td>
                        <td style={S.td}>{p.mentee_name}</td>
                        <td style={S.td}>{p.mentor_name}</td>
                        <td style={S.td}><strong>Rp {p.amount?.toLocaleString('id-ID')}</strong></td>
                        <td style={S.td}><Badge status={p.status} map={PAYMENT_STATUS} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </div>
        </>)}

        {/* ── VERIFIKASI MENTOR ──────────────────────────────────────── */}
        {tab === 'verify' && (
          <div style={S.card}>
            <div style={S.secTitle}><Ic.Verify /> Verifikasi Mentor Baru</div>
            {pendingMentors.length === 0
              ? <div style={S.empty}><Ic.Verify /><p style={{ marginTop:'10px' }}>Semua mentor sudah terverifikasi ✓</p></div>
              : <table style={S.table}>
                  <thead><tr><th style={S.th}>Username</th><th style={S.th}>Email</th><th style={S.th}>Universitas</th><th style={S.th}>Aksi</th></tr></thead>
                  <tbody>
                    {pendingMentors.map(m => (
                      <tr key={m.id}>
                        <td style={S.td}><strong>{m.username}</strong></td>
                        <td style={S.td}>{m.email}</td>
                        <td style={S.td}>{m.university || '-'}</td>
                        <td style={S.td}>
                          <button style={S.btnOk} onClick={() => handleVerify(m.id,'approve')}><Ic.Check /> Setujui</button>
                          <button style={S.btnRed} onClick={() => handleVerify(m.id,'reject')}><Ic.Close /> Tolak</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </div>
        )}

        {/* ── KELOLA MENTOR ──────────────────────────────────────────── */}
        {tab === 'mentors' && (
          <div style={S.card}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px', flexWrap:'wrap', gap:'10px' }}>
              <div style={S.secTitle}><Ic.Mentor /> Daftar Mentor ({allMentors.length})</div>
              <button style={S.btnPri} onClick={() => openModal('mentor','add')}><Ic.Plus /> Tambah Mentor</button>
            </div>
            <div style={S.searchRow}>
              <div style={{ position:'relative', flex:1 }}>
                <span style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#aaa' }}><Ic.Search /></span>
                <input type="text" placeholder="Cari nama atau email..." value={search} onChange={e=>setSearch(e.target.value)} style={{ ...S.searchIn, paddingLeft:'36px' }} />
              </div>
            </div>
            {filterSearch(allMentors,['username','email']).length === 0
              ? <div style={S.empty}>Tidak ada mentor ditemukan</div>
              : <table style={S.table}>
                  <thead><tr><th style={S.th}>Username</th><th style={S.th}>Email</th><th style={S.th}>Universitas</th><th style={S.th}>Aksi</th></tr></thead>
                  <tbody>
                    {filterSearch(allMentors,['username','email']).map(m => (
                      <tr key={m.id}>
                        <td style={S.td}><strong>{m.username}</strong></td>
                        <td style={S.td}>{m.email}</td>
                        <td style={S.td}>{m.university || '-'}</td>
                        <td style={S.td}>
                          <button style={S.btnOut} onClick={() => openModal('mentor','edit',m)}><Ic.Edit /> Edit</button>
                          <button style={S.btnRed} onClick={() => handleDelete('mentor',m.id,m.username)}><Ic.Trash /> Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </div>
        )}

        {/* ── KELOLA MENTEE ──────────────────────────────────────────── */}
        {tab === 'mentees' && (
          <div style={S.card}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px', flexWrap:'wrap', gap:'10px' }}>
              <div style={S.secTitle}><Ic.Mentee /> Daftar Mentee ({allMentees.length})</div>
              <button style={S.btnPri} onClick={() => openModal('mentee','add')}><Ic.Plus /> Tambah Mentee</button>
            </div>
            <div style={S.searchRow}>
              <div style={{ position:'relative', flex:1 }}>
                <span style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#aaa' }}><Ic.Search /></span>
                <input type="text" placeholder="Cari nama atau email..." value={search} onChange={e=>setSearch(e.target.value)} style={{ ...S.searchIn, paddingLeft:'36px' }} />
              </div>
            </div>
            {filterSearch(allMentees,['username','email']).length === 0
              ? <div style={S.empty}>Tidak ada mentee ditemukan</div>
              : <table style={S.table}>
                  <thead><tr><th style={S.th}>Username</th><th style={S.th}>Email</th><th style={S.th}>Universitas</th><th style={S.th}>Aksi</th></tr></thead>
                  <tbody>
                    {filterSearch(allMentees,['username','email']).map(m => (
                      <tr key={m.id}>
                        <td style={S.td}><strong>{m.username}</strong></td>
                        <td style={S.td}>{m.email}</td>
                        <td style={S.td}>{m.university || '-'}</td>
                        <td style={S.td}>
                          <button style={S.btnOut} onClick={() => openModal('mentee','edit',m)}><Ic.Edit /> Edit</button>
                          <button style={S.btnRed} onClick={() => handleDelete('mentee',m.id,m.username)}><Ic.Trash /> Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </div>
        )}

        {/* ── SEMUA BOOKING ──────────────────────────────────────────── */}
        {tab === 'bookings' && (
          <div style={S.card}>
            <div style={S.secTitle}><Ic.Booking /> Semua Booking ({allBookings.length})</div>
            <div style={S.searchRow}>
              <div style={{ position:'relative', flex:1 }}>
                <span style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#aaa' }}><Ic.Search /></span>
                <input type="text" placeholder="Cari mentee atau mentor..." value={search} onChange={e=>setSearch(e.target.value)} style={{ ...S.searchIn, paddingLeft:'36px' }} />
              </div>
              <select value={bookingFilter} onChange={e=>setBookingFilter(e.target.value)} style={S.selIn}>
                <option value="">Semua Status</option>
                {Object.entries(BOOKING_STATUS).map(([k,v]) => <option key={k} value={k}>{v.text}</option>)}
              </select>
            </div>
            {filteredBookings.length === 0
              ? <div style={S.empty}>Tidak ada booking ditemukan</div>
              : <table style={S.table}>
                  <thead><tr><th style={S.th}>Mentee</th><th style={S.th}>Mentor</th><th style={S.th}>Tanggal</th><th style={S.th}>Status</th></tr></thead>
                  <tbody>
                    {filteredBookings.map(b => (
                      <tr key={b.id}>
                        <td style={S.td}><strong>{b.mentee_name}</strong></td>
                        <td style={S.td}>{b.mentor_name}</td>
                        <td style={S.td}><span style={{ fontSize:'12px' }}>{new Date(b.date).toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'})}</span></td>
                        <td style={S.td}><Badge status={b.status} map={BOOKING_STATUS} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </div>
        )}

        {/* ── PEMBAYARAN ─────────────────────────────────────────────── */}
        {tab === 'payments' && (
          <div style={S.card}>
            <div style={S.secTitle}><Ic.Payment /> Riwayat Pembayaran ({allPayments.length})</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'16px' }}>
              {[
                ['Total Transaksi', allPayments.filter(p=>p.status==='success').length, '#16a34a'],
                ['Total Revenue', `Rp ${allPayments.filter(p=>p.status==='success').reduce((s,p)=>s+(p.amount||0),0).toLocaleString('id-ID')}`, '#1e4a76'],
                ['Komisi Platform', `Rp ${allPayments.filter(p=>p.status==='success').reduce((s,p)=>s+(p.platform_fee||0),0).toLocaleString('id-ID')}`, '#f97316'],
              ].map(([label, val, color]) => (
                <div key={label} style={{ ...S.statCard, padding:'14px' }}>
                  <div style={S.statLabel}>{label}</div>
                  <div style={{ fontSize:'18px', fontWeight:'800', color }}>{val}</div>
                </div>
              ))}
            </div>
            {allPayments.length === 0
              ? <div style={S.empty}>Belum ada pembayaran</div>
              : <table style={S.table}>
                  <thead><tr><th style={S.th}>Order ID</th><th style={S.th}>Mentee</th><th style={S.th}>Mentor</th><th style={S.th}>Nominal</th><th style={S.th}>Status</th><th style={S.th}>Waktu</th></tr></thead>
                  <tbody>
                    {allPayments.map(p => (
                      <tr key={p.id}>
                        <td style={S.td}><code style={{ fontSize:'11px', background:'#f5f5f5', padding:'2px 6px', borderRadius:'4px' }}>{p.order_id}</code></td>
                        <td style={S.td}>{p.mentee_name}</td>
                        <td style={S.td}>{p.mentor_name}</td>
                        <td style={S.td}><strong>Rp {p.amount?.toLocaleString('id-ID')}</strong></td>
                        <td style={S.td}><Badge status={p.status} map={PAYMENT_STATUS} /></td>
                        <td style={S.td}><span style={{ fontSize:'11px', color:'#aaa' }}>{p.paid_at ? new Date(p.paid_at).toLocaleString('id-ID',{dateStyle:'short',timeStyle:'short'}) : '-'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </div>
        )}

        {/* ── PENCAIRAN DANA ─────────────────────────────────────────── */}
        {tab === 'withdraw' && (
          <div style={S.card}>
            <div style={S.secTitle}><Ic.Withdraw /> Permintaan Pencairan Dana</div>
            {withdrawals.length === 0
              ? <div style={S.empty}><Ic.Withdraw /><p style={{ marginTop:'10px' }}>Belum ada permintaan pencairan</p></div>
              : <table style={S.table}>
                  <thead><tr><th style={S.th}>Mentor</th><th style={S.th}>Bank</th><th style={S.th}>Nominal</th><th style={S.th}>Status</th><th style={S.th}>Aksi</th></tr></thead>
                  <tbody>
                    {withdrawals.map(w => (
                      <tr key={w.id}>
                        <td style={S.td}><strong>{w.mentor_name}</strong></td>
                        <td style={S.td}>{w.bank_name || '-'}</td>
                        <td style={S.td}><strong>Rp {w.amount?.toLocaleString('id-ID')}</strong></td>
                        <td style={S.td}><Badge status={w.status} map={WITHDRAW_STATUS} /></td>
                        <td style={S.td}>
                          {w.status === 'pending'
                            ? <button style={S.btnAmb} onClick={() => openWdModal(w)}>Proses</button>
                            : <span style={{ fontSize:'12px', color:'#aaa' }}>{w.admin_note || '-'}</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </div>
        )}

        {/* ── LAPORAN KEUANGAN ──────────────────────────────────────── */}
        {tab === 'finance' && (
          <>
            <div style={S.statsGrid}>
              {financeSummary.map(([label, val]) => (
                <div key={label} style={S.statCard}>
                  <div style={S.statLabel}>{label}</div>
                  <div style={{ fontSize:'16px', fontWeight:'800', color:'#1e4a76', marginTop:'4px' }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={S.card}>
              <div style={S.secTitle}><Ic.Finance /> Ringkasan Transaksi</div>
              <table style={S.table}>
                <thead><tr><th style={S.th}>Metrik</th><th style={S.th}>Nilai</th></tr></thead>
                <tbody>
                  {[
                    ['Total Transaksi Sukses', allPayments.filter(p=>p.status==='success').length],
                    ['Total Transaksi Gagal', allPayments.filter(p=>p.status==='failed').length],
                    ['Transaksi Pending', allPayments.filter(p=>p.status==='pending').length],
                    ['Sesi Menunggu Pembayaran', (stats.completed_sessions||0) - (stats.paid_sessions||0) || 0],
                  ].map(([label, val]) => (
                    <tr key={label}>
                      <td style={S.td}>{label}</td>
                      <td style={{ ...S.td, fontWeight:'700', color:'#1e4a76' }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── RIWAYAT TRANSAKSI ───────────────────────────────────────── */}
        {tab === 'transactions' && (
          <div style={S.card}>
            <div style={S.secTitle}><Ic.Payment /> Riwayat Transaksi ({transactions.length})</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'16px' }}>
              {[
                ['TOTAL TRANSAKSI', transactionStats.total, '#16a34a'],
                ['TOTAL REVENUE', `Rp ${transactionStats.revenue.toLocaleString()}`, '#1e4a76'],
                ['KOMISI PLATFORM (10%)', `Rp ${transactionStats.commission.toLocaleString()}`, '#f97316'],
              ].map(([label, val, color]) => (
                <div key={label} style={{ ...S.statCard, padding:'14px' }}>
                  <div style={S.statLabel}>{label}</div>
                  <div style={{ fontSize:'18px', fontWeight:'800', color }}>{val}</div>
                </div>
              ))}
            </div>
            {transactions.length === 0
              ? <div style={S.empty}>Belum ada transaksi</div>
              : <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>ORDER ID</th>
                      <th style={S.th}>MENTEE</th>
                      <th style={S.th}>MENTOR</th>
                      <th style={S.th}>NOMINAL</th>
                      <th style={S.th}>KOMISI (10%)</th>
                      <th style={S.th}>MENTOR DAPAT</th>
                      <th style={S.th}>STATUS</th>
                      <th style={S.th}>WAKTU</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(tx => (
                      <tr key={tx.order_id}>
                        <td style={S.td}><code style={{ fontSize:'11px', background:'#f5f5f5', padding:'2px 6px', borderRadius:'4px' }}>{tx.order_id}</code></td>
                        <td style={S.td}>{tx.mentee}</td>
                        <td style={S.td}>{tx.mentor}</td>
                        <td style={S.td}><strong>Rp {tx.nominal?.toLocaleString()}</strong></td>
                        <td style={S.td}>Rp {tx.komisi?.toLocaleString()}</td>
                        <td style={S.td}>Rp {tx.mentor_dapat?.toLocaleString()}</td>
                        <td style={S.td}>
                          <span style={{
                            background: tx.status === 'Berhasil' ? '#d4edda' : '#fff3cd',
                            color: tx.status === 'Berhasil' ? '#155724' : '#856404',
                            padding: '4px 8px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '700'
                          }}>
                            {tx.status}
                          </span>
                        </td>
                        <td style={S.td}><span style={{ fontSize:'11px', color:'#aaa' }}>{tx.waktu}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </div>
        )}
      </main>

      {/* ── Modal CRUD Mentor/Mentee ───────────────────────────────── */}
      {showModal && (
        <div style={S.overlay} onClick={() => setShowModal(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={S.mTitle}>{modalAction==='add'?'Tambah':'Edit'} {modalType==='mentor'?'Mentor':'Mentee'}</div>
            {[
              ['Username', 'username', 'text'],
              ['Email', 'email', 'email'],
              ['Universitas', 'university', 'text'],
              ['No. Telepon', 'phone', 'text'],
              ...(modalAction==='add' ? [['Password', 'password', 'password']] : []),
            ].map(([label, key, type]) => (
              <div key={key}>
                <label style={S.label}>{label}</label>
                <input type={type} placeholder={label} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={S.input} />
              </div>
            ))}
            <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end', marginTop:'16px' }}>
              <button style={{ ...S.btnOut, marginRight:0 }} onClick={() => setShowModal(false)}>Batal</button>
              <button style={S.btnPri} onClick={handleModalSubmit}><Ic.Check /> Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Proses Pencairan ─────────────────────────────────── */}
      {showWdModal && selectedWd && (
        <div style={S.overlay} onClick={() => setShowWdModal(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={S.mTitle}>Proses Pencairan Dana</div>
            <div style={{ background:'#f5f9ff', borderRadius:'12px', padding:'14px', marginBottom:'16px' }}>
              <div style={{ fontSize:'13px', color:'#2c5a7a', lineHeight:'1.8' }}>
                <strong>Mentor:</strong> {selectedWd.mentor_name}<br/>
                <strong>Bank:</strong> {selectedWd.bank_name} — {selectedWd.account_number}<br/>
                <strong>Atas Nama:</strong> {selectedWd.account_name}<br/>
                <strong>Nominal:</strong> <span style={{ color:'#1e4a76', fontWeight:'800', fontSize:'16px' }}>Rp {selectedWd.amount?.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <label style={S.label}>Catatan Admin (opsional)</label>
            <input type="text" placeholder="Misal: Dana sudah ditransfer via BCA" value={wdNote} onChange={e => setWdNote(e.target.value)} style={{ ...S.input, marginBottom:'16px' }} />
            <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
              <button style={S.btnOut} onClick={() => setShowWdModal(false)}>Batal</button>
              <button style={S.btnRed} onClick={() => handleWdAction('reject')}><Ic.Close /> Tolak</button>
              <button style={S.btnOk} onClick={() => handleWdAction('approve')}><Ic.Check /> Setujui</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}