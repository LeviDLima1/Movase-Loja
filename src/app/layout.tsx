import type { Metadata, Viewport } from "next";
import { Montserrat } from 'next/font/google';
import "./globals.css";
import { CartProvider } from '../context/CartContext';
import { ToastProvider } from '../context/ToastContext';
import { AdminProvider } from '../contexts/AdminContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { AuthProvider } from '../contexts/AuthContext';
import CartModal from '../components/CartModal';
import FloatingCart from '../components/FloatingCart';

// Configuração da fonte Montserrat
const montserrat = Montserrat({ 
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: "Movase - Livraria Cristã",
  description: "Livraria cristã com os melhores livros e produtos para sua fé",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const themeColor = "#dc2626";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${montserrat.variable} antialiased`}
      >
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <AdminProvider>
                <NotificationProvider>
                  {children}
                  <CartModal />
                  <FloatingCart />
                </NotificationProvider>
              </AdminProvider>
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
