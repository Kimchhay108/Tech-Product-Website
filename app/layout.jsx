import "../styles/global.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "Tech Product Website",
  description: "Your tech product store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[var(--background)] text-[var(--text)]">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
