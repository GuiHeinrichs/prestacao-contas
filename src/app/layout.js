import { Roboto } from 'next/font/google';
import "./globals.css";

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: "Prestação contas Aluguéis",
  description: "Para gerar as prestações de contas de seus aluguéis.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
