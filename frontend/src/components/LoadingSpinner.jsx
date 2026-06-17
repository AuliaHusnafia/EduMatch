export default function LoadingSpinner() {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p>Loading...</p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #1890ff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// Tambahkan ke index.css
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);