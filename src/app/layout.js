import "./globals.css";
import { AuthProvider } from "./providers";
import Header from "./components/Header";
import { Montserrat, Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const montserrat = Montserrat({
  weight: "400",
  subsets: ["latin"],
  variable: "--montserrat",
  display: "swap",
});

export const metadata = {
  title: "Parola",
  description: "Vocabulary App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
