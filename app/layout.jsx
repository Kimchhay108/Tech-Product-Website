import "../styles/global.css";
import { CartProvider } from "./context/CartContext";
import ClientWrapper from "./ClientWrapper";

export const metadata = {
  title: "Tech Product Website",
  description: "Cyber store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[var(--background)] text-[var(--text)]">
        <CartProvider>
          {/* Render client wrapper */}
          <ClientWrapper>{children}</ClientWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
