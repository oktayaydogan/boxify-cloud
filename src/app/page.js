"use client";

import Card from "@/components/Card";
import { useSession } from "@supabase/auth-helpers-react";
import { signInWithGoogle } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
	const session = useSession();
	const router = useRouter();

	useEffect(() => {
		if (session) router.push("/lists");
	}, [session, router]);

	return (
		<Card>
			<h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
				Boxify'a Hoşgeldiniz!
			</h1>
			<p className="text-lg text-center text-gray-600 mb-8">
				Kendi listelerinizi oluşturun, düzenleyin ve QR kodlarla yönetimi
				kolaylaştırın.
			</p>
			<div className="flex justify-center mb-4 w-full">
				<button
					onClick={signInWithGoogle}
					className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 w-full md:w-auto"
				>
					Şimdi Başlayın
				</button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
				<div className="p-6 border rounded-lg hover:shadow-lg transition duration-300">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">
						Listelerinizi Yönetin
					</h2>
					<p className="text-gray-600">
						Farklı listeler oluşturun, öğeleri düzenleyin ve her listeyi kendi
						QR koduyla yönetin.
					</p>
				</div>
				<div className="p-6 border rounded-lg hover:shadow-lg transition duration-300">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">
						Kolay Erişim Sağlayın
					</h2>
					<p className="text-gray-600">
						QR kodları kullanarak fiziksel nesnelerinizi kolayca etiketleyin ve
						her yerden erişim sağlayın.
					</p>
				</div>
				<div className="p-6 border rounded-lg hover:shadow-lg transition duration-300">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">
						Güvenli ve Gizli
					</h2>
					<p className="text-gray-600">
						Listelerinizi genel veya özel yaparak kimin erişebileceğini siz
						belirleyin.
					</p>
				</div>
				<div className="p-6 border rounded-lg hover:shadow-lg transition duration-300">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">
						Mobil Uyumlu
					</h2>
					<p className="text-gray-600">
						Tüm cihazlarda kullanabileceğiniz, mobil uyumlu ve kullanıcı dostu
						bir deneyim sunuyoruz.
					</p>
				</div>
			</div>
		</Card>
	);
}
