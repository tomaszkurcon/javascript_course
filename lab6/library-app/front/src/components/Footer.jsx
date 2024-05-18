const Footer = () => {
  return (
    <>
      <footer className="d-flex justify-content-center bg-light bg-gradient my-5 px-2 container-xl">
        <div className="d-flex gap-3">
          <span className="w-100">
            Biblioteka Główna Akademii Górniczo-Hutniczej
          </span>

          <span className="w-100 d-flex">
            <i className="bi bi-envelope-fill me-1"></i>
            <a className="link-primary link-underline-dark">
              bgagh@bg.agh.edu.pl
            </a>
          </span>
          <span className="w-100 d-flex">
            <i className="bi bi-telephone-fill me-1"></i>
            <a className="link-primary link-underline-dark">+48 12 617 32 08</a>
          </span>
        </div>
      </footer>
    </>
  );
};
export default Footer;
