import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// ─── SVG Icons ─────────────────────────────────────────────────────────────────
const IcSearch     = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const IcCalendar   = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);
const IcHistory    = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/><polyline points="12 7 12 12 15 15"/></svg>);
const IcUser       = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const IcLogout     = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>);
const IcClose      = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const IcMentor     = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const IcLink       = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>);
const IcPayment    = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>);
const IcInvoice    = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>);
const IcCheck      = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const IcClock      = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const IcSkill      = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>);
const IcEdu        = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const IcPhone      = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.18 2 2 0 0 1 3.64 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>);
const IcNote       = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const IcEmail      = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>);
const IcBook       = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2a6b9e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>);

// ─── Status Badge ──────────────────────────────────────────────────────────────
const STATUS_MAP = {
  pending:         { bg: '#fff3cd', color: '#856404', text: 'Menunggu Konfirmasi', icon: <IcClock /> },
  accepted:        { bg: '#cce5ff', color: '#004085', text: 'Diterima',            icon: null },
  ongoing:         { bg: '#d4edda', color: '#155724', text: 'Berlangsung',          icon: <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} /> },
  completed:       { bg: '#fff3cd', color: '#856404', text: 'Menunggu Pembayaran', icon: <IcInvoice /> },
  paid:            { bg: '#d4edda', color: '#155724', text: 'Lunas',               icon: <IcCheck /> },
  rejected:        { bg: '#f8d7da', color: '#721c24', text: 'Ditolak',             icon: null },
  cancelled:       { bg: '#f8d7da', color: '#721c24', text: 'Dibatalkan',          icon: null },
  pending_payment: { bg: '#fff3cd', color: '#856404', text: 'Menunggu Pembayaran', icon: <IcInvoice /> },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] || { bg: '#eee', color: '#555', text: status, icon: null };
  return (
    <span style={{ background: s.bg, color: s.color, padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      {s.icon}{s.text}
    </span>
  );
};

// ─── Component ─────────────────────────────────────────────────────────────────
export default function MenteeDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]               = useState('search');
  const [user, setUser]                         = useState(null);
  const [loading, setLoading]                   = useState(true);
  const [mentors, setMentors]                   = useState([]);
  const [filteredMentors, setFilteredMentors]   = useState([]);
  const [searchTerm, setSearchTerm]             = useState('');
  const [skillFilter, setSkillFilter]           = useState('');
  const [priceFilter, setPriceFilter]           = useState('');
  const [myBookings, setMyBookings]             = useState([]);
  const [ongoingSessions, setOngoingSessions]   = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [selectedMentor, setSelectedMentor]     = useState(null);
  const [showModal, setShowModal]               = useState(false);
  const [selectedSlot, setSelectedSlot]         = useState(null);
  const [bookingNotes, setBookingNotes]         = useState('');
  const [bookingMsg, setBookingMsg]             = useState('');
  const [payingId, setPayingId]                 = useState(null);
  const [flash, setFlash]                       = useState({ type: '', msg: '' });

  const showFlash = (type, msg) => {
    setFlash({ type, msg });
    setTimeout(() => setFlash({ type: '', msg: '' }), 5000);
  };

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    try {
      const res = await api.get('/auth/me/');
      if (res.data.role !== 'mentee') { navigate('/login'); return; }
      setUser(res.data);
      await Promise.all([fetchMentors(), fetchMyBookings(), fetchMySessions()]);
    } catch { localStorage.clear(); navigate('/login'); }
  };

  const getList = (res) => {
    if (!res || !res.data) return [];
    if (res.data.results && Array.isArray(res.data.results)) return res.data.results;
    if (Array.isArray(res.data)) return res.data;
    return [];
  };

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/mentee/mentors/');
      const data = getList(res);
      console.log('Mentors data dari API:', data); // Debug
      console.log('Jumlah mentor:', data.length); // Debug
      setMentors(data); 
      setFilteredMentors(data);
    } catch (e) { 
      console.error('Error fetch mentors:', e); 
    }
    finally { setLoading(false); }
  };

  const fetchMyBookings = async () => {
    try { const r = await api.get('/mentee/bookings/'); setMyBookings(getList(r)); }
    catch (e) { console.error(e); }
  };

  const fetchMySessions = async () => {
    try {
      const [a, b] = await Promise.all([
        api.get('/mentee/ongoing-sessions/'),
        api.get('/mentee/completed-sessions/')
      ]);
      setOngoingSessions(getList(a));
      
      // Tambahkan price ke completed sessions
      const bData = getList(b);
      const completedWithPrice = bData.map(session => ({
        ...session,
        price: session.price || 75000,
        invoice_amount: session.invoice_amount || session.price || 75000
      }));
      setCompletedSessions(completedWithPrice);
    } catch (e) { 
      console.error(e); 
    }
  };

  const refreshAll = async () => {
  await Promise.all([
    fetchMyBookings(),
    fetchMySessions()
  ]);
};

  useEffect(() => {
    let f = [...mentors];
    if (searchTerm)  f = f.filter(m => m.username?.toLowerCase().includes(searchTerm.toLowerCase()) || m.skills?.toLowerCase().includes(searchTerm.toLowerCase()));
    if (skillFilter) f = f.filter(m => m.skills?.toLowerCase().includes(skillFilter.toLowerCase()));
    if (priceFilter) f = f.filter(m => m.price_per_session <= parseInt(priceFilter));
    setFilteredMentors(f);
  }, [searchTerm, skillFilter, priceFilter, mentors]);

  const handleMentorClick = async (mentor) => {
    try {
      const res = await api.get(`/mentee/mentors/${mentor.id}/`);
      setSelectedMentor(res.data); setSelectedSlot(null); setBookingNotes(''); setBookingMsg(''); setShowModal(true);
    } catch { showFlash('error', 'Gagal memuat detail mentor'); }
  };

  const handleBook = async () => {
    if (!selectedSlot) { setBookingMsg('Pilih jadwal terlebih dahulu'); return; }
    try {
      await api.post('/mentee/book/', { mentor_id: selectedMentor.id, slot_id: selectedSlot.id, notes: bookingNotes });
      setBookingMsg('✅ Booking berhasil! Menunggu konfirmasi mentor.');
      setTimeout(() => { setShowModal(false); fetchMyBookings(); }, 1800);
    } catch (e) { setBookingMsg('❌ ' + (e.response?.data?.error || 'Gagal booking')); }
  };

  const handlePayInvoice = async (bookingId) => {
    if (payingId === bookingId) return;
    setPayingId(bookingId);
    
    try {
      // 1. Dapatkan Snap Token dari Backend
      const res = await api.post('/payments/pay/', { booking_id: bookingId });
      const { token } = res.data;

      if (!token) {
        throw new Error('Gagal mendapatkan token pembayaran');
      }

      // 2. Tampilkan Midtrans Snap Pop-up
      window.snap.pay(token, {
        onSuccess: (result) => {
          console.log('Success:', result);
          showFlash('success', '✅ Pembayaran Berhasil! Tunggu konfirmasi sistem.');
          refreshAll();
        },
        onPending: (result) => {
          console.log('Pending:', result);
          showFlash('warning', '⏳ Pembayaran sedang diproses. Segera selesaikan pembayaran Anda.');
        },
        onError: (result) => {
          console.error('Error:', result);
          showFlash('error', '❌ Pembayaran Gagal.');
        },
        onClose: () => {
          console.log('User closed the popup without finishing the payment');
          showFlash('info', 'ℹ️ Anda menutup jendela pembayaran.');
        }
      });

    } catch (err) {
      console.error('Payment Error:', err);
      showFlash('error', err.response?.data?.error || err.message || 'Gagal memproses pembayaran');
    } finally {
      setPayingId(null);
    }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  // ─── Styles ───────────────────────────────────────────────────────────────
  const S = {
    wrap:      { display:'flex', minHeight:'100vh', background:'linear-gradient(145deg,#cfe9ff 0%,#a0c4e8 50%,#7db4e6 100%)', fontFamily:"'Inter',-apple-system,sans-serif" },
    sidebar:   { width:'256px', background:'rgba(255,255,255,0.92)', backdropFilter:'blur(14px)', padding:'24px 16px', height:'100vh', position:'fixed', overflowY:'auto', borderRight:'1px solid rgba(255,255,255,0.6)', zIndex:10 },
    logo:      { fontSize:'20px', fontWeight:'800', color:'#1e4a76', marginBottom:'24px', paddingBottom:'16px', borderBottom:'1px solid rgba(30,74,118,0.12)', display:'flex', alignItems:'center', gap:'8px' },
    userBox:   { padding:'14px', background:'rgba(42,107,158,0.1)', borderRadius:'14px', marginBottom:'20px', border:'1px solid rgba(42,107,158,0.12)' },
    uName:     { fontSize:'15px', fontWeight:'700', color:'#1e4a76', display:'flex', alignItems:'center', gap:'6px' },
    uEmail:    { fontSize:'12px', color:'#4a7a9b', marginTop:'4px' },
    uRole:     { fontSize:'11px', color:'#2a6b9e', background:'rgba(42,107,158,0.15)', borderRadius:'20px', padding:'2px 10px', display:'inline-block', marginTop:'6px', fontWeight:'700' },
    nav:       { display:'flex', alignItems:'center', gap:'10px', width:'100%', padding:'11px 14px', background:'transparent', border:'none', borderRadius:'12px', color:'#2c5a7a', fontSize:'14px', fontWeight:'500', cursor:'pointer', marginBottom:'4px', textAlign:'left', transition:'all .15s' },
    navOn:     { background:'rgba(42,107,158,0.15)', color:'#0d3b5e', fontWeight:'700' },
    badge:     { background:'#e74c3c', color:'#fff', borderRadius:'20px', padding:'2px 8px', fontSize:'11px', marginLeft:'auto', fontWeight:'700' },
    logout:    { width:'100%', padding:'11px 14px', background:'rgba(220,38,38,0.1)', border:'1px solid rgba(220,38,38,0.2)', borderRadius:'12px', color:'#b91c1c', cursor:'pointer', marginTop:'20px', display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', fontWeight:'600' },
    main:      { marginLeft:'256px', padding:'28px 32px', width:'calc(100% - 256px)', minHeight:'100vh' },
    h1:        { fontSize:'26px', fontWeight:'800', color:'#0a2a3a', margin:'0 0 4px 0' },
    sub:       { fontSize:'14px', color:'#2c5a7a', marginBottom:'24px' },
    card:      { background:'rgba(255,255,255,0.8)', borderRadius:'16px', padding:'20px', marginBottom:'14px', border:'1px solid rgba(255,255,255,0.6)', backdropFilter:'blur(8px)' },
    secTitle:  { fontSize:'16px', fontWeight:'700', color:'#1e4a76', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' },
    flashOk:   { background:'#d4edda', color:'#155724', padding:'12px 16px', borderRadius:'12px', marginBottom:'16px', fontWeight:'500', display:'flex', alignItems:'center', gap:'8px' },
    flashErr:  { background:'#f8d7da', color:'#721c24', padding:'12px 16px', borderRadius:'12px', marginBottom:'16px', fontWeight:'500', display:'flex', alignItems:'center', gap:'8px' },
    empty:     { textAlign:'center', padding:'40px 20px', color:'#4a7a9b', background:'rgba(255,255,255,0.5)', borderRadius:'14px' },
    mRow:      { display:'flex', justifyContent:'space-between', alignItems:'center', gap:'16px', flexWrap:'wrap' },
    mName:     { fontSize:'16px', fontWeight:'700', color:'#1e4a76', display:'flex', alignItems:'center', gap:'6px' },
    mMeta:     { fontSize:'13px', color:'#4a7a9b', marginTop:'5px', display:'flex', alignItems:'center', gap:'6px' },
    mPrice:    { fontSize:'18px', fontWeight:'800', color:'#2a6b9e', marginTop:'10px' },
    bookBtn:   { background:'linear-gradient(135deg,#2a6b9e,#1a4a7e)', color:'#fff', border:'none', padding:'10px 22px', borderRadius:'12px', cursor:'pointer', fontWeight:'700', fontSize:'13px', whiteSpace:'nowrap', flexShrink:0 },
    searchIn:  { flex:2, padding:'11px 36px 11px 14px', border:'1.5px solid rgba(42,107,158,0.2)', borderRadius:'12px', fontSize:'14px', background:'white', outline:'none', minWidth:'160px' },
    selIn:     { padding:'11px 14px', border:'1.5px solid rgba(42,107,158,0.2)', borderRadius:'12px', fontSize:'13px', background:'white', outline:'none', color:'#2c5a7a', cursor:'pointer' },
    bRow:      { display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'14px', flexWrap:'wrap' },
    meetLink:  { display:'inline-flex', alignItems:'center', gap:'6px', background:'#1a73e8', color:'#fff', padding:'8px 16px', borderRadius:'10px', textDecoration:'none', fontSize:'13px', fontWeight:'600', marginTop:'10px' },
    invBox:    { marginTop:'10px', padding:'10px 14px', background:'#fff3cd', borderRadius:'10px', border:'1px solid #ffc107', display:'inline-flex', alignItems:'center', gap:'6px' },
    invPaid:   { marginTop:'10px', padding:'10px 14px', background:'#d4edda', borderRadius:'10px', border:'1px solid #c3e6cb', display:'inline-flex', alignItems:'center', gap:'6px' },
    payBtn:    { marginTop:'10px', display:'inline-flex', alignItems:'center', gap:'8px', border:'none', padding:'10px 22px', borderRadius:'10px', fontSize:'13px', fontWeight:'700', cursor:'pointer', color:'#fff', background:'#e53e3e' },
    payBtnDis: { marginTop:'10px', display:'inline-flex', alignItems:'center', gap:'8px', border:'none', padding:'10px 22px', borderRadius:'10px', fontSize:'13px', fontWeight:'700', cursor:'not-allowed', color:'#fff', background:'#aaa' },
    overlay:   { position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 },
    modal:     { background:'#fff', borderRadius:'20px', padding:'28px', width:'520px', maxWidth:'94%', maxHeight:'85vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.25)' },
    mHead:     { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'18px' },
    mTitle:    { fontSize:'20px', fontWeight:'800', color:'#1e4a76', display:'flex', alignItems:'center', gap:'8px' },
    closeBtn:  { background:'none', border:'none', cursor:'pointer', color:'#888' },
    slotItem:  { padding:'12px 14px', border:'1.5px solid #e0e0e0', borderRadius:'10px', cursor:'pointer', display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' },
    slotOn:    { background:'#2a6b9e', color:'#fff', border:'1.5px solid #2a6b9e' },
    textarea:  { width:'100%', padding:'12px', border:'1.5px solid #ddd', borderRadius:'10px', fontSize:'14px', marginTop:'6px', fontFamily:'inherit', resize:'vertical', boxSizing:'border-box', outline:'none' },
    subBtn:    { width:'100%', padding:'13px', background:'linear-gradient(135deg,#2a6b9e,#1a4a7e)', color:'#fff', border:'none', borderRadius:'12px', fontSize:'15px', fontWeight:'700', cursor:'pointer', marginTop:'6px' },
    subBtnDis: { width:'100%', padding:'13px', background:'#ccc', color:'#fff', border:'none', borderRadius:'12px', fontSize:'15px', fontWeight:'700', cursor:'not-allowed', marginTop:'6px' },
    msgOk:     { padding:'12px', borderRadius:'10px', marginBottom:'12px', background:'#d4edda', color:'#155724', fontSize:'14px', fontWeight:'500' },
    msgErr:    { padding:'12px', borderRadius:'10px', marginBottom:'12px', background:'#f8d7da', color:'#721c24', fontSize:'14px', fontWeight:'500' },
    profRow:   { display:'flex', gap:'12px', padding:'13px 16px', background:'rgba(42,107,158,0.06)', borderRadius:'12px', marginBottom:'8px', alignItems:'center' },
    profLabel: { fontWeight:'700', color:'#1e4a76', minWidth:'130px', fontSize:'14px', display:'flex', alignItems:'center', gap:'6px' },
    profVal:   { color:'#2c5a7a', fontSize:'14px' },
  };

  if (loading && mentors.length === 0) {
    return (
      <div style={{ ...S.wrap, alignItems:'center', justifyContent:'center' }}>
        <p style={{ color:'#1e4a76', fontSize:'16px', fontWeight:'600' }}>Memuat data...</p>
      </div>
    );
  }

  const pendingCount = myBookings.filter(b => b.status === 'pending').length;
  const allSkills = [...new Set(mentors.flatMap(m => (m.skills||'').split(',').map(s=>s.trim()).filter(Boolean)))];

  // Helper: render invoice + pay button
  const InvoiceBlock = ({ item }) => {
    if (item.status === 'paid') {
      return (
        <div style={S.invPaid}>
          <IcCheck />
          <span style={{ fontSize:'13px', color:'#155724', fontWeight:'700' }}>
            Lunas — Rp {Number(item.invoice_amount).toLocaleString('id-ID')}
          </span>
        </div>
      );
    }
    if (item.status === 'completed' && Number(item.invoice_amount) > 0) {
      return (
        <div>
          <div style={S.invBox}>
            <IcInvoice />
            <span style={{ fontSize:'13px', color:'#856404', fontWeight:'700' }}>
              Tagihan: Rp {Number(item.invoice_amount).toLocaleString('id-ID')}
            </span>
          </div>
          <br />
          <button
            style={payingId === item.id ? S.payBtnDis : S.payBtn}
            disabled={payingId === item.id}
            onClick={() => handlePayInvoice(item.id)}
          >
            <IcPayment />
            {payingId === item.id ? 'Memproses...' : 'Bayar Sekarang'}
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={S.wrap}>

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside style={S.sidebar}>
        <div style={S.logo}><IcBook /> EduMatch</div>

        <div style={S.userBox}>
          <div style={S.uName}><IcUser /> {user?.username || 'Mentee'}</div>
          <div style={S.uEmail}>{user?.email}</div>
          <div style={S.uRole}>Mentee</div>
        </div>

        {[
          { tab:'search',   label:'Cari Mentor',        icon:<IcSearch />   },
          { tab:'bookings', label:'Booking Saya',        icon:<IcCalendar />, badge: pendingCount },
          { tab:'history',  label:'Riwayat & Tagihan',   icon:<IcHistory />  },
          { tab:'profile',  label:'Profil Saya',         icon:<IcUser />     },
        ].map(({ tab, label, icon, badge }) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ ...S.nav, ...(activeTab===tab ? S.navOn : {}) }}>
            {icon} <span>{label}</span>
            {badge > 0 && <span style={S.badge}>{badge}</span>}
          </button>
        ))}

        <button onClick={handleLogout} style={S.logout}><IcLogout /> Logout</button>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main style={S.main}>
        <h1 style={S.h1}>Dashboard Mentee</h1>
        <p style={S.sub}>Temukan mentor terbaik untuk membantumu berkembang</p>

        {flash.msg && (
          <div style={flash.type === 'success' ? S.flashOk : S.flashErr}>
            {flash.type === 'success' ? <IcCheck /> : '⚠️'} {flash.msg}
          </div>
        )}

        {/* ── Cari Mentor ─────────────────────────────────────────────── */}
        {activeTab === 'search' && (<>
          <div style={{ ...S.card, display:'flex', gap:'10px', flexWrap:'wrap', alignItems:'center' }}>
            <div style={{ position:'relative', flex:2, minWidth:'160px' }}>
              <span style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#4a7a9b', pointerEvents:'none' }}><IcSearch /></span>
              <input type="text" placeholder="Cari nama atau keahlian..."
                value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
                style={{ ...S.searchIn, paddingLeft:'38px', width:'100%', boxSizing:'border-box' }} />
            </div>
            <select value={skillFilter} onChange={e=>setSkillFilter(e.target.value)} style={S.selIn}>
              <option value="">Semua Keahlian</option>
              {allSkills.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            <select value={priceFilter} onChange={e=>setPriceFilter(e.target.value)} style={S.selIn}>
              <option value="">Semua Harga</option>
              <option value="50000">≤ Rp 50.000</option>
              <option value="75000">≤ Rp 75.000</option>
              <option value="100000">≤ Rp 100.000</option>
              <option value="150000">≤ Rp 150.000</option>
            </select>
          </div>

          <p style={{ fontSize:'13px', color:'#4a7a9b', marginBottom:'12px' }}>
            {filteredMentors.length} mentor ditemukan
          </p>

          {filteredMentors.length === 0
            ? <div style={S.empty}><IcMentor /><p style={{ marginTop:'12px' }}>Tidak ada mentor ditemukan.</p></div>
            : filteredMentors.map(m => (
              <div key={m.id} style={{ ...S.card, cursor:'pointer' }} onClick={() => handleMentorClick(m)}>
                <div style={S.mRow}>
                  <div style={{ flex:1 }}>
                    <div style={S.mName}><IcMentor /> {m.username}</div>
                    {m.skills    && <div style={S.mMeta}><IcSkill /> {m.skills}</div>}
                    {m.education && <div style={S.mMeta}><IcEdu />   {m.education}</div>}
                    {m.bio       && <div style={{ ...S.mMeta, marginTop:'8px', lineHeight:'1.4' }}>{m.bio.slice(0,100)}{m.bio.length>100?'...':''}</div>}
                    <div style={S.mPrice}>
                      Rp {m.price_per_session?.toLocaleString('id-ID')}
                      <span style={{ fontSize:'13px', fontWeight:'400', color:'#4a7a9b' }}> / sesi</span>
                    </div>
                  </div>
                  <button style={S.bookBtn} onClick={e=>{ e.stopPropagation(); handleMentorClick(m); }}>
                    Pilih Mentor
                  </button>
                </div>
              </div>
            ))
          }
        </>)}

        {/* ── Booking Saya ─────────────────────────────────────────────── */}
        {activeTab === 'bookings' && (
          <div style={S.card}>
            <div style={S.secTitle}><IcCalendar /> Booking Saya</div>
            {myBookings.length === 0
              ? <div style={S.empty}><IcCalendar /><p style={{ marginTop:'12px' }}>Belum ada booking.</p><p style={{ fontSize:'12px', color:'#aaa', marginTop:'4px' }}>Cari mentor dan buat booking pertamamu!</p></div>
              : myBookings.map(b => (
                <div key={b.id} style={{ ...S.card, border:'1px solid rgba(42,107,158,0.15)', marginBottom:'12px' }}>
                  <div style={S.bRow}>
                    <div style={{ flex:1 }}>
                      <div style={S.mName}><IcMentor /> {b.mentor_name}</div>
                      <div style={S.mMeta}><IcCalendar />{new Date(b.date).toLocaleString('id-ID',{dateStyle:'long',timeStyle:'short'})}</div>
                      {b.notes && <div style={S.mMeta}><IcNote /> {b.notes}</div>}
                      {b.meeting_link && (
                        <a href={b.meeting_link} target="_blank" rel="noopener noreferrer" style={S.meetLink}>
                          <IcLink /> Join Meeting
                        </a>
                      )}
                      <InvoiceBlock item={b} />
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {activeTab === 'history' && (<>
        {/* Sesi Sedang Berlangsung */}
        <div style={S.card}>
          <div style={S.secTitle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            Sesi Sedang Berlangsung
          </div>
          {ongoingSessions.length === 0 ? (
            <div style={S.empty}>
              <IcClock /><p style={{ marginTop: '10px' }}>Tidak ada sesi berlangsung.</p>
            </div>
          ) : (
            ongoingSessions.map(s => (
              <div key={s.id} style={{ ...S.card, border: '1.5px solid #d4edda', marginBottom: '12px' }}>
                <div style={S.bRow}>
                  <div style={{ flex: 1 }}>
                    <div style={S.mName}><IcMentor /> {s.mentor_name}</div>
                    <div style={S.mMeta}>
                      <IcCalendar /> {new Date(s.date).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                    </div>
                    {s.meeting_link ? (
                      <a href={s.meeting_link} target="_blank" rel="noopener noreferrer" style={S.meetLink}>
                        <IcLink /> Join Meeting
                      </a>
                    ) : (
                      <div style={{ marginTop: '8px', fontSize: '13px', color: '#999', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <IcClock /> Menunggu mentor mengirim link meeting...
                      </div>
                    )}
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sesi Selesai dengan Status Pembayaran */}
        <div style={S.card}>
          <div style={S.secTitle}>
            <IcHistory /> Riwayat Sesi &amp; Pembayaran
          </div>
          {completedSessions.length === 0 ? (
            <div style={S.empty}>
              <IcHistory /><p style={{ marginTop: '10px' }}>Belum ada riwayat sesi.</p>
            </div>
          ) : (
            completedSessions.map(s => {
              // Tentukan status pembayaran
              const isPaid = s.status === 'paid';
              const isPending = s.status === 'completed' || s.status === 'pending_payment';
              
              return (
                <div key={s.id} style={{ ...S.card, border: '1px solid rgba(42,107,158,0.15)', marginBottom: '12px' }}>
                  <div style={S.bRow}>
                    <div style={{ flex: 1 }}>
                      <div style={S.mName}><IcMentor /> {s.mentor_name}</div>
                      <div style={S.mMeta}>
                        <IcCalendar /> {new Date(s.date).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                      </div>
                      {s.notes && (
                        <div style={S.mMeta}>
                          <IcNote /> {s.notes}
                        </div>
                      )}
                      
                      {/* Tampilkan status pembayaran dengan warna berbeda */}
                      {isPaid ? (
                        <div style={{
                          marginTop: '12px',
                          padding: '10px 14px',
                          background: '#d4edda',
                          borderRadius: '10px',
                          border: '1px solid #c3e6cb',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <IcCheck />
                          <span style={{ fontSize: '13px', color: '#155724', fontWeight: '700' }}>
                            ✅ LUNAS — Rp {Number(s.invoice_amount || s.price || 75000).toLocaleString('id-ID')}
                          </span>
                        </div>
                      ) : isPending ? (
                        <div>
                          <div style={{
                            marginTop: '12px',
                            padding: '10px 14px',
                            background: '#fff3cd',
                            borderRadius: '10px',
                            border: '1px solid #ffc107',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <IcInvoice />
                            <span style={{ fontSize: '13px', color: '#856404', fontWeight: '700' }}>
                              💰 Tagihan: Rp {Number(s.invoice_amount || s.price || 75000).toLocaleString('id-ID')}
                            </span>
                          </div>
                          <button
                            onClick={() => handlePayInvoice(s.id)}
                            style={{
                              marginTop: '12px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              border: 'none',
                              padding: '10px 22px',
                              borderRadius: '10px',
                              fontSize: '13px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              color: '#fff',
                              background: '#e53e3e'
                            }}
                          >
                            <IcPayment /> Bayar Sekarang
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <StatusBadge status={s.status === 'paid' ? 'paid' : 'pending_payment'} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </>)}

        {/* ── Profil ───────────────────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div style={S.card}>
            <div style={S.secTitle}><IcUser /> Profil Saya</div>
            {[
              [<IcUser />,       'Username',    user?.username],
              [<IcEmail />,      'Email',       user?.email],
              [<IcEdu />,        'Universitas', user?.university || 'Belum diisi'],
              [<IcPhone />,      'No. Telepon', user?.phone      || 'Belum diisi'],
            ].map(([icon, label, val], i) => (
              <div key={i} style={S.profRow}>
                <span style={S.profLabel}>{icon} {label}</span>
                <span style={S.profVal}>{val}</span>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Modal Booking ─────────────────────────────────────────────────── */}
      {showModal && selectedMentor && (
        <div style={S.overlay} onClick={() => setShowModal(false)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={S.mHead}>
              <h2 style={S.mTitle}><IcMentor /> {selectedMentor.username}</h2>
              <button style={S.closeBtn} onClick={()=>setShowModal(false)}><IcClose /></button>
            </div>

            <div style={{ background:'rgba(42,107,158,0.06)', borderRadius:'14px', padding:'16px', marginBottom:'18px' }}>
              <div style={{ fontSize:'24px', fontWeight:'800', color:'#2a6b9e', marginBottom:'8px' }}>
                Rp {selectedMentor.price_per_session?.toLocaleString('id-ID')}
                <span style={{ fontSize:'14px', fontWeight:'400', color:'#4a7a9b' }}> / sesi</span>
              </div>
              {selectedMentor.education && <div style={S.mMeta}><IcEdu />   {selectedMentor.education}</div>}
              {selectedMentor.skills    && <div style={S.mMeta}><IcSkill /> {selectedMentor.skills}</div>}
              {selectedMentor.bio       && <p style={{ fontSize:'13px', color:'#2c5a7a', marginTop:'10px', lineHeight:'1.6' }}>{selectedMentor.bio}</p>}
            </div>

            <p style={{ fontWeight:'700', color:'#1e4a76', marginBottom:'10px', display:'flex', alignItems:'center', gap:'6px' }}>
              <IcCalendar /> Pilih Jadwal Tersedia
            </p>

            {/* PERBAIKAN: gunakan slot.date bukan slot.day */}
            {selectedMentor.available_slots?.length > 0
              ? selectedMentor.available_slots.map(slot => (
                  <div key={slot.id}
                    style={{ ...S.slotItem, ...(selectedSlot?.id === slot.id ? S.slotOn : {}) }}
                    onClick={() => setSelectedSlot(slot)}>
                    <input type="radio" readOnly checked={selectedSlot?.id === slot.id} />
                    <IcCalendar />
                    <span style={{ fontWeight:'500' }}>{slot.date} — {slot.time}</span>
                  </div>
                ))
              : <p style={{ color:'#aaa', fontSize:'13px', marginBottom:'16px' }}>Belum ada jadwal tersedia dari mentor ini.</p>
            }

            <label style={{ display:'block', fontWeight:'700', color:'#1e4a76', marginTop:'14px', marginBottom:'6px', fontSize:'14px' }}>
              Catatan untuk Mentor <span style={{ fontWeight:'400', color:'#aaa' }}>(opsional)</span>
            </label>
            <textarea
              placeholder="Tuliskan topik yang ingin kamu pelajari..."
              value={bookingNotes} onChange={e=>setBookingNotes(e.target.value)}
              rows="3" style={S.textarea}
            />

            {bookingMsg && <div style={bookingMsg.includes('✅') ? S.msgOk : S.msgErr}>{bookingMsg}</div>}

            <button style={selectedSlot ? S.subBtn : S.subBtnDis} onClick={handleBook} disabled={!selectedSlot}>
              {selectedSlot ? 'Konfirmasi Booking' : 'Pilih Jadwal Terlebih Dahulu'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}