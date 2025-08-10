import "@/styles/globals.css";
import ClientWrapper from "./client-wrapper";
import Navbar from "@/components/Navbar";

export const metadata = {
	title: "Boxify",
	description:
		"Kendi listelerinizi oluşturun, düzenleyin ve QR kodlarla yönetimi kolaylaştırın.",
};

export default function RootLayout({ children }) {
	return (
		<html lang="tr">
			<link
				rel="icon"
				type="image/png"
				href="/favicon-48x48.png"
				sizes="48x48"
			/>
			<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
			<link rel="shortcut icon" href="/favicon.ico" />
			<link
				rel="apple-touch-icon"
				sizes="180x180"
				href="/apple-touch-icon.png"
			/>
			<meta name="apple-mobile-web-app-title" content="Boxify" />
			<link rel="manifest" href="/manifest.json" />
<body className="antialiased pt-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
<ClientWrapper>
<Navbar />
<main className="container mx-auto px-4 py-6">{children}</main>
</ClientWrapper>
</body>
		</html>
	);
}
