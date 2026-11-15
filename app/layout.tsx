import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./styles.css";

export const metadata: Metadata = {
  title: { default: "Mathing", template: "%s · Mathing" },
  description: "A reading-first mathematics study desk for deliberate practice.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to study content</a>
        {children}
      </body>
    </html>
  );
}
