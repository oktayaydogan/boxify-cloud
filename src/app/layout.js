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
			<body className="antialiased mt-20 bg-gray-100">
				<ClientWrapper>
					<Navbar />
					<main className="container mx-auto">{children}</main>
				</ClientWrapper>
			</body>
		</html>
	);
}
