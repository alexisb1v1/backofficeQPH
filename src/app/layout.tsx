import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QPH Backoffice Suite | QuePlanesHoy',
  description: 'Plataforma administrativa interna para supervisión de eventos, liquidaciones y operaciones.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
        />
      </head>
      <body className="bg-surface text-on-surface antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

