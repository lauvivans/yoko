const Footer = () => {
  return (
    <footer className="c-footer">
      <div className="c-footer__copyright">
        <div>
          <img src="/mascot.svg" />
        </div>
        <span>
          &copy; Yoko! 2024-{new Date().getFullYear()}. All rights reserved.
        </span>
      </div>
      <span className="c-footer__version">v 1.0.0</span>
      <div className="c-footer__data">
        <span>Export all my data</span>
        <span>Import my data</span>
      </div>
    </footer>
  );
};

export default Footer;
