"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase, signInWithGoogle, signOut } from "@/lib/supabase/client";
import {
	FaUserCircle,
	FaBars,
	FaList,
	FaInfoCircle,
	FaSignOutAlt,
} from "react-icons/fa"; // Importing icons

export default function Navbar() {
	const session = useSession();
	const router = useRouter();
	const [menuOpen, setMenuOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (session !== undefined) {
			setLoading(false); // Oturum durumu yüklendiğinde "Yükleniyor..." göstergesini kaldır
		}
	}, [session]);

	const handleSignOut = async () => {
		await signOut();
		router.push("/"); // Sayfayı yenile
	};

	// Kullanıcının adı ve soyadının ilk iki harfini almak
	const getInitials = () => {
		const name = session?.user?.user_metadata?.name || "";
		const nameParts = name.split(" ");
		const firstname = nameParts[0] || ""; // İlk kelime (ad)
		const surname = nameParts[1] || ""; // İkinci kelime (soyad)

		const initials = `${firstname.charAt(0).toUpperCase()}${surname
			.charAt(0)
			.toUpperCase()}`;
		return initials || null;
	};

return (
<nav className="fixed top-0 w-full flex items-center justify-between px-6 py-4 bg-white backdrop-blur-lg bg-opacity-95 border-b border-gray-200 shadow-lg z-50">
{/* Logo */}
<Link href="/">
<div className="flex items-center space-x-3 cursor-pointer group">
<div className="relative">
<Image
src="/icon512_rounded.png"
width={40}
height={40}
alt="Boxify Logo"
className="transition-transform duration-300 group-hover:scale-110"
/>
</div>
<h1 className="text-xl font-bold text-gray-800">
Boxify
</h1>
</div>
</Link>

<div className="ml-auto flex items-center space-x-4">
{loading ? (
// Yükleniyor göstergesi
<div className="flex items-center gap-2">
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
<span className="text-gray-600">Yükleniyor...</span>
</div>
) : session ? (
<div className="relative">
<button
onClick={() => setUserMenuOpen(!userMenuOpen)}
className="group p-2 bg-gray-600 rounded-full hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
>
{/* Kullanıcı adı yoksa ikon göster */}
{getInitials() ? (
<div className="bg-white text-gray-700 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
<span>{getInitials()}</span>
</div>
) : (
<FaUserCircle size={24} className="text-white" />
)}
</button>
{userMenuOpen && (
<div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
<div className="py-2">
<div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
<p className="text-sm font-semibold text-gray-700">
{session?.user?.user_metadata?.name || "Kullanıcı"}
</p>
<p className="text-xs text-gray-500">
{session?.user?.email}
</p>
</div>
<button
onClick={handleSignOut}
className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-red-50 transition duration-200 text-gray-700 hover:text-red-600"
>
<FaSignOutAlt className="text-red-500" />
<span>Çıkış Yap</span>
</button>
</div>
</div>
)}
</div>
) : (
<button
onClick={signInWithGoogle}
className="px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
>
<FaUserCircle />
Giriş Yap
</button>
)}
</div>
</nav>
);
}
