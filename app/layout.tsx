import './globals.css';

export const metadata = {
  title: 'Bed-Rot Coder',
  description: 'Voice to code local AI agent',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}