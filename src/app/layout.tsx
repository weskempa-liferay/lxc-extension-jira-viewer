import 'bulma/css/bulma.min.css';

import Navbar from './components/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="container is-max-widescreen">
        <Navbar />

        <main>{children}</main>
      </body>
    </html>
  );
}
