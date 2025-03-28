import "../../src/styles/globals.css"; // Impor file CSS global
import { AuthProvider } from '@/contexts/AuthContext';

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
