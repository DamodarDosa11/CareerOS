import "./globals.css";

export const metadata = {
  title: "CareerOS — AI Job Platform",
  description: "Find jobs, improve your resume, and get hired faster with AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
