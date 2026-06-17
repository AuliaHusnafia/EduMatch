export default function Logo({ size = 'default', variant = 'default', color = '#1e4a76' }) {
  const getSize = () => {
    switch(size) {
      case 'small': return { icon: '28px', text: '18px', gap: '8px' };
      case 'large': return { icon: '48px', text: '28px', gap: '12px' };
      default: return { icon: '36px', text: '22px', gap: '10px' };
    }
  };

  const sizeStyle = getSize();

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: sizeStyle.gap,
    },
    icon: {
      width: sizeStyle.icon,
      height: sizeStyle.icon,
    },
    text: {
      fontSize: sizeStyle.text,
      fontWeight: '600',
      color: color,
      letterSpacing: '-0.5px',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }
  };

  return (
    <div style={styles.container}>
      <svg 
        style={styles.icon} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M2 17L12 22L22 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M2 12L12 17L22 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="12" cy="12" r="2" stroke={color} strokeWidth="1.5" fill="none"/>
      </svg>
      <span style={styles.text}>EduMatch</span>
    </div>
  );
}