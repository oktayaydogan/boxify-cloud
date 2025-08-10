"use client";

import { useSession } from "@supabase/auth-helpers-react";
import { signInWithGoogle } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaGoogle, FaList, FaQrcode, FaLock, FaMobile } from "react-icons/fa";

import Card from "@/components/Card";
import CardTitle from "@/components/CardTitle";

export default function HomePage() {
	const session = useSession();
	const router = useRouter();

useEffect(() => {
// Update page title
document.title = "Boxify - Kutularınızı Yönetin";
}, []);

useEffect(() => {
if (session) router.push("/lists");
}, [session, router]);

return (
<Card>
<CardTitle>Boxify&apos;a Hoşgeldiniz!</CardTitle>
<p className="text-lg text-center text-gray-600 mb-8 max-w-2xl mx-auto">
Kendi kutularınızı oluşturun, düzenleyin ve QR kodlarla yönetimi
kolaylaştırın.
</p>

{/* CTA Button */}
<div className="flex justify-center mb-12 w-full">
<button
onClick={() => signInWithGoogle()}
className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
>
<FaGoogle className="group-hover:rotate-12 transition-transform duration-300" />
Google ile Giriş Yap
</button>
</div>

{/* Features Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
{/* Feature 1 */}
<div className="group p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-blue-50">
<div className="flex items-center gap-4 mb-4">
<div className="p-3 rounded-full bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform duration-300">
<FaList size={24} />
</div>
<h2 className="text-xl font-bold text-gray-800">
Kutularınızı Yönetin
</h2>
</div>
<p className="text-gray-600">
Farklı kutular oluşturun, öğeleri düzenleyin ve her kutuyu kendi
QR koduyla yönetin.
</p>
</div>

{/* Feature 2 */}
<div className="group p-6 border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-green-50">
<div className="flex items-center gap-4 mb-4">
<div className="p-3 rounded-full bg-green-100 text-green-600 group-hover:scale-110 transition-transform duration-300">
<FaQrcode size={24} />
</div>
<h2 className="text-xl font-bold text-gray-800">
Kolay Erişim Sağlayın
</h2>
</div>
<p className="text-gray-600">
QR kodları kullanarak fiziksel nesnelerinizi kolayca etiketleyin ve
her yerden erişim sağlayın.
</p>
</div>

{/* Feature 3 */}
<div className="group p-6 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-purple-50">
<div className="flex items-center gap-4 mb-4">
<div className="p-3 rounded-full bg-purple-100 text-purple-600 group-hover:scale-110 transition-transform duration-300">
<FaLock size={24} />
</div>
<h2 className="text-xl font-bold text-gray-800">
Güvenli ve Gizli
</h2>
</div>
<p className="text-gray-600">
Kutularınızı genel veya özel yaparak kimin erişebileceğini siz
belirleyin.
</p>
</div>

{/* Feature 4 */}
<div className="group p-6 border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-orange-50">
<div className="flex items-center gap-4 mb-4">
<div className="p-3 rounded-full bg-orange-100 text-orange-600 group-hover:scale-110 transition-transform duration-300">
<FaMobile size={24} />
</div>
<h2 className="text-xl font-bold text-gray-800">
Mobil Uyumlu
</h2>
</div>
<p className="text-gray-600">
Tüm cihazlarda kullanabileceğiniz, mobil uyumlu ve kullanıcı dostu
bir deneyim sunuyoruz.
</p>
</div>
</div>
</Card>
);
}
