import "../../src/styles/globals.css"; // Impor file CSS global
// import './layout.css' // HAPUS atau pastikan file ada
import { AuthProvider } from '@/contexts/AuthContext';
import Script from 'next/script';

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Script id="auth-check" strategy="afterInteractive">
          {`
            try {
              const path = window.location.pathname;
              const protectedPaths = ['/dashboard', '/admin', '/booking'];
              const hasAuth = localStorage.getItem('user') || document.cookie.includes('laravel_session');
              if (protectedPaths.some(p => path.startsWith(p)) && !hasAuth) {
                console.log('No auth detected on protected route');
                window.location.href = '/login';
              }
            } catch (e) {
              console.error('Error in auth check script:', e);
            }
          `}
        </Script>
      </body>
    </html>
  );
}
