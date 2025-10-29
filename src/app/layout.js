import ClientRoot from './ClientLayout';

export const metadata = {
  title: 'Dispatcher Dashboard',
  description: 'AI-Powered Dispatcher Console',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
