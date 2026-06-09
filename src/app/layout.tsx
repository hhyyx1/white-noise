import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "泡泡白噪音 - 找到内心的平静",
  description: "一个清新现代的白噪音网站，帮助你在心情郁闷烦躁时找到内心的平静。支持多种环境音效的混合播放，创造属于你的宁静空间。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var savedMode = localStorage.getItem('themeMode');
                  var shouldUseDark = false;

                  if (savedMode === 'manual' && savedTheme) {
                    shouldUseDark = savedTheme === 'dark';
                  } else {
                    // Auto mode or no saved theme - check time
                    var hour = new Date().getHours();
                    shouldUseDark = hour >= 22 || hour < 8;
                  }

                  if (shouldUseDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
