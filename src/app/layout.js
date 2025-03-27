import "../../src/styles/globals.css"; // Impor file CSS global


export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
