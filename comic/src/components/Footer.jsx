const Footer = () => (
  <footer
    style={{
      backgroundColor: '#0d0d0d',
      color: '#fff',
      textAlign: 'center',
      padding: '20px 10px',
      borderTop: '1px solid #ff69b4',
      boxShadow: '0 0 15px rgba(255, 105, 180, 0.3)',
      fontFamily: "'Poppins', sans-serif",
      marginTop: '40px',
    }}
  >
    <p
      style={{
        color: '#ff69b4',
        fontSize: '0.95rem',
        marginBottom: '5px',
        textShadow: '0 0 10px rgba(255, 105, 180, 0.6)',
      }}
    >
      © 2025 <strong>マンガ森 MangaMori Bookstore</strong> — 物語はここから始まる。
    </p>
    <p
      style={{
        color: '#bbb',
        fontSize: '0.8rem',
        letterSpacing: '0.5px',
      }}
    >
      All rights reserved.
    </p>
  </footer>
);

export default Footer;
