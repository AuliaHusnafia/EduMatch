import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faUniversity, faUserTag } from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';
import Logo from '../components/Logo';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'mentee',
    university: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      await api.post('/auth/register/', formData);
      setSuccess('Pendaftaran berhasil! Silakan login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.username?.[0] || 'Pendaftaran gagal');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: 'linear-gradient(145deg, #cfe9ff 0%, #a0c4e8 50%, #7db4e6 100%)',
    },
    glow1: {
      position: 'absolute',
      width: '40%',
      height: '40%',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
      top: '-5%',
      right: '-5%',
      pointerEvents: 'none',
    },
    glow2: {
      position: 'absolute',
      width: '35%',
      height: '35%',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 70%)',
      bottom: '-5%',
      left: '-5%',
      pointerEvents: 'none',
    },
    card: {
      position: 'relative',
      zIndex: 2,
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(12px)',
      borderRadius: '28px',
      padding: '44px 48px',
      width: '100%',
      maxWidth: '480px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      margin: '20px',
    },
    logoWrapper: { display: 'flex', justifyContent: 'center', marginBottom: '32px' },
    title: { fontSize: '30px', fontWeight: '700', textAlign: 'center', color: '#0a2a3a', marginBottom: '10px', letterSpacing: '-0.5px' },
    subtitle: { fontSize: '14px', textAlign: 'center', color: '#2c5a7a', marginBottom: '36px' },
    errorBox: { background: 'rgba(220, 38, 38, 0.1)', color: '#b91c1c', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '13px', textAlign: 'center' },
    successBox: { background: 'rgba(34, 197, 94, 0.1)', color: '#15803d', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '13px', textAlign: 'center' },
    inputGroup: { marginBottom: '22px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e4a76', marginBottom: '8px' },
    inputWrapper: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid rgba(100, 150, 200, 0.3)',
      borderRadius: '14px',
      background: 'rgba(255, 255, 255, 0.5)',
    },
    inputIcon: { padding: '0 0 0 16px', color: '#2c5a7a', fontSize: '14px' },
    input: {
      width: '100%',
      padding: '14px 16px',
      fontSize: '14px',
      border: 'none',
      borderRadius: '14px',
      background: 'transparent',
      outline: 'none',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
    },
    select: {
      width: '100%',
      padding: '14px 16px',
      fontSize: '14px',
      border: '1px solid rgba(100, 150, 200, 0.3)',
      borderRadius: '14px',
      background: 'rgba(255, 255, 255, 0.5)',
      cursor: 'pointer',
      outline: 'none',
      fontFamily: 'inherit',
    },
    button: {
      width: '100%',
      padding: '14px',
      fontSize: '15px',
      fontWeight: '600',
      color: 'white',
      background: '#2a6b9e',
      border: 'none',
      borderRadius: '14px',
      cursor: 'pointer',
      marginTop: '8px',
    },
    loginLink: { textAlign: 'center', marginTop: '28px', fontSize: '13px', color: '#2c5a7a' },
    link: { color: '#2a6b9e', textDecoration: 'none', fontWeight: '600' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.glow1}></div>
      <div style={styles.glow2}></div>
      
      <div style={styles.card}>
        <div style={styles.logoWrapper}>
          <Logo size="large" />
        </div>
        
        <h1 style={styles.title}>Daftar Akun</h1>
        <p style={styles.subtitle}>Isi data diri untuk bergabung</p>

        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <div style={styles.inputWrapper}>
              <FontAwesomeIcon icon={faUser} style={styles.inputIcon} />
              <input type="text" name="username" value={formData.username} onChange={handleChange} style={styles.input} placeholder="Masukkan username" required />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrapper}>
              <FontAwesomeIcon icon={faEnvelope} style={styles.inputIcon} />
              <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} placeholder="Masukkan email" required />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <FontAwesomeIcon icon={faLock} style={styles.inputIcon} />
              <input type="password" name="password" value={formData.password} onChange={handleChange} style={styles.input} placeholder="Masukkan password" required />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Universitas</label>
            <div style={styles.inputWrapper}>
              <FontAwesomeIcon icon={faUniversity} style={styles.inputIcon} />
              <input type="text" name="university" value={formData.university} onChange={handleChange} style={styles.input} placeholder="Nama universitas" />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Daftar sebagai</label>
            <div style={styles.inputWrapper}>
              <FontAwesomeIcon icon={faUserTag} style={styles.inputIcon} />
              <select name="role" value={formData.role} onChange={handleChange} style={styles.select}>
                <option value="mentee">Mentee (Mahasiswa - Mencari Bimbingan)</option>
                <option value="mentor">Mentor (Pengajar - Memberi Bimbingan)</option>
              </select>
            </div>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p style={styles.loginLink}>
          Sudah punya akun? <Link to="/login" style={styles.link}>Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}