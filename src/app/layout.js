import "./globals.css";

export const metadata = {
  title: "Wedding Invitation",
  description: "A beautiful wedding invitation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}