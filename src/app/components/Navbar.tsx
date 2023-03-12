import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <div className="navbar-item">
          <img src="https://github.com/atlassian.png" alt="Atlassian Logo" />
        </div>

        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div className="navbar-menu">
        <div className="navbar-start">
          <Link className="navbar-item" href="/">
            Home
          </Link>

          <Link className="navbar-item" href="/issues/assigned-to-me">
            My Tasks
          </Link>
        </div>
      </div>
    </nav>
  );
}
