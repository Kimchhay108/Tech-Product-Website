import "../styles/global.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartProvider } from "./context/CartContext";


export const metadata = {
  title: "Tech Product Website",
  description: "Cyber store",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-[var(--background)] text-[var(--text)]">
                <CartProvider>
                    <Header />
                        <main >
                            {children}
                        </main>
                    <Footer />
                </CartProvider>
            </body>
        </html>
    );
}
