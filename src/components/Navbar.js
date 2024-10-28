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
		<nav className="fixed top-0 w-full flex items-center justify-between p-4 bg-gray-800 text-white z-50">
			{/* Logo */}
			<Link href="/">
				<div className="flex items-center space-x-2 cursor-pointer">
					<Image
						src="/icon512_rounded.png"
						width={40}
						height={40}
						alt="Boxify Logo"
					/>
					<h1 className="text-lg font-bold cursor-pointer">Boxify</h1>
				</div>
			</Link>

			<div className="ml-auto flex items-center space-x-4">
				{loading ? (
					// Yükleniyor göstergesi
					<span className="text-gray-400">Yükleniyor...</span>
				) : session ? (
					<div className="relative">
						<button
							onClick={() => setUserMenuOpen(!userMenuOpen)}
							className="p-1 bg-gray-700 rounded-full"
						>
							{/* Kullanıcı adı yoksa ikon göster */}
							{getInitials() ? (
								<div className="bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center">
									<span>{getInitials()}</span>
								</div>
							) : (
								<FaUserCircle size={24} className="text-white" /> // User Icon
							)}
						</button>
						{userMenuOpen && (
							<ul className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
								<li>
									<button
										onClick={handleSignOut}
										className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-gray-200 rounded"
									>
										<FaSignOutAlt /> {/* Çıkış Yap Icon */}
										<span>Çıkış Yap</span>
									</button>
								</li>
							</ul>
						)}
					</div>
				) : (
					<button
						onClick={signInWithGoogle}
						className="px-4 py-2 bg-blue-500 rounded"
					>
						Giriş Yap
					</button>
				)}
			</div>
		</nav>
	);
}
