import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const topMentors = [
    { id: 1, name: 'Prof. Ahmad R.', expertise: 'Machine Learning', price: 120, rating: 4.9, image: '🧠', students: 234 },
    { id: 2, name: 'Dr. Siti N.', expertise: 'Web Development', price: 100, rating: 4.8, image: '💻', students: 189 },
    { id: 3, name: 'Budi W.', expertise: 'Data Science', price: 110, rating: 4.9, image: '📊', students: 312 },
    { id: 4, name: 'Rina K.', expertise: 'Mobile Dev', price: 95, rating: 4.7, image: '📱', students: 156 },
  ];

  const categories = [
    { name: 'Programming', icon: '💻', color: '#667eea', count: 45, bg: 'rgba(102, 126, 234, 0.1)' },
    { name: 'Data Science', icon: '📊', color: '#f59e0b', count: 32, bg: 'rgba(245, 158, 11, 0.1)' },
    { name: 'Design', icon: '🎨', color: '#10b981', count: 28, bg: 'rgba(16, 185, 129, 0.1)' },
    { name: 'Business', icon: '💼', color: '#ef4444', count: 24, bg: 'rgba(239, 68, 68, 0.1)' },
    { name: 'Language', icon: '🌐', color: '#8b5cf6', count: 19, bg: 'rgba(139, 92, 246, 0.1)' },
    { name: 'Marketing', icon: '📈', color: '#06b6d4', count: 22, bg: 'rgba(6, 182, 212, 0.1)' },
  ];

  const stats = [
    { value: '500+', label: 'Mentor Ahli' },
    { value: '5,000+', label: 'Siswa Aktif' },
    { value: '98%', label: 'Kepuasan' },
    { value: '10K+', label: 'Sesi Selesai' },
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
      background: 'linear-gradient(145deg, #cfe9ff 0%, #a0c4e8 50%, #7db4e6 100%)',
    },
    navbar: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: scrolled ? '16px 48px' : '24px 48px',
      backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.05)' : 'none',
      transition: 'all 0.3s ease',
      zIndex: 1000,
    },
    logo: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e4a76',
      cursor: 'pointer',
    },
    navLinks: {
      display: 'flex',
      gap: '32px',
      alignItems: 'center',
    },
    navLink: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#1e4a76',
      cursor: 'pointer',
      transition: 'color 0.2s',
      textDecoration: 'none',
    },
    btnOutline: {
      padding: '8px 20px',
      border: '2px solid #2a6b9e',
      borderRadius: '40px',
      background: 'transparent',
      color: '#2a6b9e',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    btnPrimary: {
      padding: '8px 24px',
      background: '#2a6b9e',
      border: 'none',
      borderRadius: '40px',
      color: 'white',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    hero: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '120px 48px 80px',
      minHeight: '90vh',
    },
    heroLeft: {
      flex: 1,
    },
    heroBadge: {
      display: 'inline-block',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(8px)',
      color: '#2a6b9e',
      padding: '6px 14px',
      borderRadius: '40px',
      fontSize: '13px',
      fontWeight: '600',
      marginBottom: '24px',
    },
    heroTitle: {
      fontSize: '52px',
      fontWeight: '800',
      color: '#0a2a3a',
      lineHeight: '1.2',
      marginBottom: '20px',
    },
    heroHighlight: {
      color: '#2a6b9e',
      position: 'relative',
    },
    heroDesc: {
      fontSize: '16px',
      color: '#2c5a7a',
      lineHeight: '1.6',
      marginBottom: '32px',
      maxWidth: '500px',
    },
    heroButtons: {
      display: 'flex',
      gap: '16px',
    },
    heroRight: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    heroImage: {
      fontSize: '180px',
      background: 'rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(10px)',
      borderRadius: '50%',
      padding: '40px',
      border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    statsSection: {
      padding: '60px 48px',
      background: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(8px)',
      margin: '0 48px 40px',
      borderRadius: '24px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '40px',
      textAlign: 'center',
    },
    statValue: {
      fontSize: '36px',
      fontWeight: '800',
      color: '#1e4a76',
      marginBottom: '8px',
    },
    statLabel: {
      fontSize: '14px',
      color: '#2c5a7a',
    },
    section: {
      padding: '60px 48px',
    },
    sectionHeader: {
      textAlign: 'center',
      marginBottom: '48px',
    },
    sectionTitle: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#0a2a3a',
      marginBottom: '12px',
    },
    sectionSubtitle: {
      fontSize: '16px',
      color: '#2c5a7a',
    },
    mentorGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '24px',
      maxWidth: '900px',
      margin: '0 auto',
    },
    mentorCard: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(8px)',
      borderRadius: '20px',
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      transition: 'all 0.2s',
      cursor: 'pointer',
      border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    mentorAvatar: {
      fontSize: '56px',
      background: 'rgba(42, 107, 158, 0.1)',
      borderRadius: '50%',
      padding: '12px',
      width: '80px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mentorInfo: {
      flex: 1,
    },
    mentorName: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e4a76',
      marginBottom: '4px',
    },
    mentorExpertise: {
      fontSize: '13px',
      color: '#2a6b9e',
      marginBottom: '8px',
    },
    mentorRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
      fontSize: '13px',
      color: '#f59e0b',
    },
    mentorPrice: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e4a76',
    },
    priceUnit: {
      fontSize: '12px',
      color: '#6c6c6c',
      fontWeight: 'normal',
    },
    categoriesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      maxWidth: '800px',
      margin: '0 auto',
    },
    categoryCard: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(8px)',
      borderRadius: '16px',
      padding: '24px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    categoryIcon: {
      fontSize: '36px',
      marginBottom: '12px',
    },
    categoryName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e4a76',
      marginBottom: '4px',
    },
    categoryCount: {
      fontSize: '12px',
      color: '#2c5a7a',
    },
    ctaSection: {
      background: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(8px)',
      margin: '20px 48px 60px',
      borderRadius: '24px',
      padding: '50px',
      textAlign: 'center',
    },
    ctaTitle: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#0a2a3a',
      marginBottom: '12px',
    },
    ctaDesc: {
      fontSize: '14px',
      color: '#2c5a7a',
      marginBottom: '28px',
    },
    ctaButton: {
      padding: '12px 32px',
      background: '#2a6b9e',
      border: 'none',
      borderRadius: '40px',
      fontSize: '15px',
      fontWeight: '600',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    footer: {
      padding: '32px 48px',
      borderTop: '1px solid rgba(255, 255, 255, 0.3)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px',
    },
    footerLogo: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e4a76',
    },
    footerLinks: {
      display: 'flex',
      gap: '24px',
    },
    footerLink: {
      fontSize: '13px',
      color: '#2c5a7a',
      cursor: 'pointer',
    },
    copyright: {
      fontSize: '12px',
      color: '#2c5a7a',
    },
  };

  const handleMentorHover = (e, isEnter) => {
    if (isEnter) {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
    }
  };

  const handleCategoryHover = (e, isEnter) => {
    if (isEnter) {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
    }
  };

  const handleButtonHover = (e, isEnter, type) => {
    if (type === 'primary') {
      if (isEnter) {
        e.currentTarget.style.background = '#1a5578';
        e.currentTarget.style.transform = 'translateY(-2px)';
      } else {
        e.currentTarget.style.background = '#2a6b9e';
        e.currentTarget.style.transform = 'translateY(0)';
      }
    } else if (type === 'outline') {
      if (isEnter) {
        e.currentTarget.style.background = '#2a6b9e';
        e.currentTarget.style.color = 'white';
        e.currentTarget.style.transform = 'translateY(-2px)';
      } else {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = '#2a6b9e';
        e.currentTarget.style.transform = 'translateY(0)';
      }
    } else if (type === 'cta') {
      if (isEnter) {
        e.currentTarget.style.background = '#1a5578';
        e.currentTarget.style.transform = 'translateY(-2px)';
      } else {
        e.currentTarget.style.background = '#2a6b9e';
        e.currentTarget.style.transform = 'translateY(0)';
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          📚 EduMatch
        </div>
        <div style={styles.navLinks}>
          <a href="#home" style={styles.navLink}>Home</a>
          <a href="#mentors" style={styles.navLink}>Mentors</a>
          <a href="#categories" style={styles.navLink}>Categories</a>
          <button 
            style={styles.btnOutline} 
            onClick={() => navigate('/login')}
            onMouseEnter={(e) => handleButtonHover(e, true, 'outline')}
            onMouseLeave={(e) => handleButtonHover(e, false, 'outline')}
          >
            Sign In
          </button>
          <button 
            style={styles.btnPrimary} 
            onClick={() => navigate('/register')}
            onMouseEnter={(e) => handleButtonHover(e, true, 'primary')}
            onMouseLeave={(e) => handleButtonHover(e, false, 'primary')}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" style={styles.hero}>
        <div style={styles.heroLeft}>
          <div style={styles.heroBadge}>✨ Learn from the best</div>
          <h1 style={styles.heroTitle}>
            Learn to{' '}
            <span style={styles.heroHighlight}>Code Better</span>
            <br />
            From Now
          </h1>
          <p style={styles.heroDesc}>
            Temukan mentor terbaik untuk membantumu menguasai pemrograman, 
            data science, design, dan masih banyak lagi. Sesi 1-on-1 yang personal dan efektif.
          </p>
          <div style={styles.heroButtons}>
            <button 
              style={styles.btnPrimary} 
              onClick={() => navigate('/register')}
              onMouseEnter={(e) => handleButtonHover(e, true, 'primary')}
              onMouseLeave={(e) => handleButtonHover(e, false, 'primary')}
            >
              Start Learning →
            </button>
            <button 
              style={styles.btnOutline} 
              onClick={() => document.getElementById('mentors').scrollIntoView({ behavior: 'smooth' })}
              onMouseEnter={(e) => handleButtonHover(e, true, 'outline')}
              onMouseLeave={(e) => handleButtonHover(e, false, 'outline')}
            >
              Browse Mentors
            </button>
          </div>
        </div>
        <div style={styles.heroRight}>
          <div style={styles.heroImage}>
            📚🎓
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div style={styles.statsSection}>
        <div style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index}>
              <div style={styles.statValue}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Mentors Section - 2 columns */}
      <section id="mentors" style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Top Mentors</h2>
          <p style={styles.sectionSubtitle}>Belajar dari para ahli terbaik di bidangnya</p>
        </div>
        <div style={styles.mentorGrid}>
          {topMentors.map(mentor => (
            <div
              key={mentor.id}
              style={styles.mentorCard}
              onMouseEnter={(e) => handleMentorHover(e, true)}
              onMouseLeave={(e) => handleMentorHover(e, false)}
              onClick={() => navigate('/register')}
            >
              <div style={styles.mentorAvatar}>{mentor.image}</div>
              <div style={styles.mentorInfo}>
                <div style={styles.mentorName}>{mentor.name}</div>
                <div style={styles.mentorExpertise}>{mentor.expertise}</div>
                <div style={styles.mentorRating}>
                  {'⭐'.repeat(Math.floor(mentor.rating))} {mentor.rating}
                </div>
                <div style={styles.mentorPrice}>
                  ${mentor.price} <span style={styles.priceUnit}>/ sesi</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section - 3 columns */}
      <section id="categories" style={{ ...styles.section, paddingTop: 0 }}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Popular Categories</h2>
          <p style={styles.sectionSubtitle}>Pilih kategori yang sesuai dengan kebutuhanmu</p>
        </div>
        <div style={styles.categoriesGrid}>
          {categories.map(cat => (
            <div
              key={cat.name}
              style={styles.categoryCard}
              onMouseEnter={(e) => handleCategoryHover(e, true)}
              onMouseLeave={(e) => handleCategoryHover(e, false)}
              onClick={() => navigate('/register')}
            >
              <div style={styles.categoryIcon}>{cat.icon}</div>
              <div style={styles.categoryName}>{cat.name}</div>
              <div style={styles.categoryCount}>{cat.count} mentors</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <div style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to Start Your Journey?</h2>
        <p style={styles.ctaDesc}>
          Bergabunglah dengan ribuan siswa yang sudah mencapai tujuan belajar mereka
        </p>
        <button 
          style={styles.ctaButton} 
          onClick={() => navigate('/register')}
          onMouseEnter={(e) => handleButtonHover(e, true, 'cta')}
          onMouseLeave={(e) => handleButtonHover(e, false, 'cta')}
        >
          Get Started Now →
        </button>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div>
          <div style={styles.footerLogo}>📚 EduMatch</div>
          <div style={styles.copyright}>© 2026 EduMatch. All rights reserved.</div>
        </div>
        <div style={styles.footerLinks}>
          <span style={styles.footerLink}>About</span>
          <span style={styles.footerLink}>Privacy</span>
          <span style={styles.footerLink}>Terms</span>
          <span style={styles.footerLink}>Contact</span>
        </div>
      </footer>

      {/* Scroll to top button */}
      {scrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            background: '#2a6b9e',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            zIndex: 100,
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#1a5578'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#2a6b9e'}
        >
          ↑
        </button>
      )}
    </div>
  );
}