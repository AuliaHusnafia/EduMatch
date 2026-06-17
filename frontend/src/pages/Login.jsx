import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Logo from '../components/Logo';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
        const res = await api.post('/auth/login/', { username, password });
        
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        
        const userRes = await api.get('/auth/me/');
        console.log('Login - User data:', userRes.data);
        console.log('Login - Role:', userRes.data.role);
        
        localStorage.setItem('role', userRes.data.role);
        localStorage.setItem('user_id', userRes.data.id);
        localStorage.setItem('username', userRes.data.username);
        
        // Redirect berdasarkan role
        if (userRes.data.role === 'admin') {
            console.log('Redirecting to /admin');
            window.location.href = '/admin';
        } else if (userRes.data.role === 'mentor') {
            console.log('Redirecting to /mentor');
            window.location.href = '/mentor';
        } else {
            console.log('Redirecting to /mentee');
            window.location.href = '/mentee';
        }
        
    } catch (err) {
        console.error('Login error:', err);
        setError('Username atau password salah');
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
      maxWidth: '460px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      margin: '20px',
    },
    logoWrapper: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '32px',
    },
    title: { fontSize: '30px', fontWeight: '700', textAlign: 'center', color: '#0a2a3a', marginBottom: '10px', letterSpacing: '-0.5px' },
    subtitle: { fontSize: '14px', textAlign: 'center', color: '#2c5a7a', marginBottom: '36px' },
    errorBox: {
      background: 'rgba(220, 38, 38, 0.1)',
      color: '#b91c1c',
      padding: '12px 16px',
      borderRadius: '12px',
      marginBottom: '24px',
      fontSize: '13px',
      textAlign: 'center',
    },
    inputGroup: { marginBottom: '22px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e4a76', marginBottom: '8px' },
    input: {
      width: '100%',
      padding: '14px 16px',
      fontSize: '14px',
      border: '1px solid rgba(100, 150, 200, 0.3)',
      borderRadius: '14px',
      background: 'rgba(255, 255, 255, 0.5)',
      transition: 'all 0.2s ease',
      outline: 'none',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
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
      transition: 'all 0.2s ease',
      marginTop: '8px',
    },
    registerLink: { textAlign: 'center', marginTop: '28px', fontSize: '13px', color: '#2c5a7a' },
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
        
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Masuk untuk melanjutkan ke EduMatch</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder="Masukkan username"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Masukkan password"
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p style={styles.registerLink}>
          Belum punya akun? <Link to="/register" style={styles.link}>Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}