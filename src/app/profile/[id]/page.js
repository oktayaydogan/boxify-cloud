"use client";

import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase/client";
import { FaUser, FaGlobe, FaLock, FaBox, FaCalendarAlt, FaList } from "react-icons/fa";
import Card from "@/components/Card";
import CardTitle from "@/components/CardTitle";
import ListItemSkeleton from "@/components/ListItemSkeleton";
import Link from "next/link";

export default function ProfilePage({ params }) {
const session = useSession();
const [profileUser, setProfileUser] = useState(null);
const [publicLists, setPublicLists] = useState([]);
const [loading, setLoading] = useState(true);
const [isOwnProfile, setIsOwnProfile] = useState(false);
const { id: profileUserId } = params;

useEffect(() => {
const fetchProfileData = async () => {
try {
setLoading(true);

// Check if this is the user's own profile
const isOwn = session?.user?.id === profileUserId;
setIsOwnProfile(isOwn);

// Fetch user's public lists (or all lists if own profile)
let query = supabase
.from("lists")
.select("*")
.eq("user_id", profileUserId);

// If not own profile, only get public lists
if (!isOwn) {
query = query.eq("is_public", true);
}

const { data: listsData, error: listsError } = await query
.order("created_at", { ascending: false });

if (listsError) {
console.error("Error fetching lists:", listsError);
} else {
setPublicLists(listsData || []);
}

// Set profile user info
if (isOwn && session?.user) {
// For own profile, use session data
setProfileUser({
id: session.user.id,
user_metadata: session.user.user_metadata,
created_at: session.user.created_at
});
} else {
// For other profiles, we need to get user info differently
// For now, set a placeholder
setProfileUser({
id: profileUserId,
user_metadata: { name: "Kullanıcı" },
created_at: new Date().toISOString()
});
}
} catch (error) {
console.error("Error fetching profile:", error);
} finally {
setLoading(false);
}
};

if (profileUserId) {
fetchProfileData();
}
}, [profileUserId, session]);

const getUserDisplayName = () => {
return profileUser?.user_metadata?.name || "Anonim Kullanıcı";
};

const getInitials = () => {
const name = profileUser?.user_metadata?.name || "";
const nameParts = name.split(" ");
const firstname = nameParts[0] || "";
const surname = nameParts[1] || "";
return `${firstname.charAt(0).toUpperCase()}${surname.charAt(0).toUpperCase()}` || "?";
};

if (loading) {
return (
<Card>
<div className="flex items-center gap-4 mb-6">
<div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
<div>
<div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
<div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{Array(3).fill(null).map((_, index) => (
<ListItemSkeleton key={index} />
))}
</div>
</Card>
);
}

return (
<Card>
{/* Profile Header */}
<div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-gray-200">
<div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
{getInitials()}
</div>
<div className="flex-1">
<h1 className="text-2xl font-bold text-gray-800 mb-2">
{getUserDisplayName()}
{isOwnProfile && <span className="text-lg text-gray-500 ml-2">(Siz)</span>}
</h1>
<div className="flex items-center gap-4 text-sm text-gray-600">
<div className="flex items-center gap-1">
<FaList size={12} />
<span>{publicLists.length} {isOwnProfile ? "liste" : "herkese açık liste"}</span>
</div>
<div className="flex items-center gap-1">
<FaCalendarAlt size={12} />
<span>Katılım: {new Date(profileUser?.created_at || Date.now()).toLocaleDateString('tr-TR', {
month: 'long',
year: 'numeric'
})}</span>
</div>
</div>
</div>
</div>

{/* Lists Section */}
<div className="mb-6">
<CardTitle>
{isOwnProfile ? "Listeleriniz" : `${getUserDisplayName()}'in Herkese Açık Listeleri`}
</CardTitle>
</div>

{/* Lists Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{publicLists.length === 0 ? (
<div className="col-span-full text-center py-12">
<FaUser className="mx-auto text-gray-400 text-6xl mb-4" />
<p className="text-gray-600 text-lg">
{isOwnProfile 
? "Henüz hiç liste oluşturmamışsınız." 
: "Bu kullanıcının herkese açık listesi bulunmuyor."}
</p>
{isOwnProfile && (
<Link 
href="/lists"
className="inline-block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
>
İlk Listenizi Oluşturun
</Link>
)}
</div>
) : (
publicLists.map((list) => (
<div
key={list.id}
className="group bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
>
{/* Header */}
<div className="p-4 border-b border-gray-100">
<div className="flex items-center gap-3 mb-2">
<div className={`p-2 rounded-full ${list.is_public ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
{list.is_public ? <FaGlobe size={16} /> : <FaLock size={16} />}
</div>
<Link 
href={`/lists/${list.id}`}
className="flex-1"
>
<h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition duration-200 truncate">
{list.name}
</h3>
</Link>
</div>
</div>

{/* Body */}
<div className="p-4">
<div className="flex justify-between items-center text-sm text-gray-500">
<div className="flex items-center gap-1">
<FaCalendarAlt size={12} />
<span>
{new Date(list.created_at).toLocaleDateString('tr-TR', {
day: '2-digit',
month: '2-digit',
year: 'numeric'
})}
</span>
</div>
<span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
list.is_public 
? 'bg-green-50 text-green-700 border-green-200' 
: 'bg-blue-50 text-blue-700 border-blue-200'
}`}>
{list.is_public ? '🌍 Herkese Açık' : '🔒 Özel'}
</span>
</div>
</div>

{/* Footer */}
<div className="px-4 pb-4">
<Link 
href={`/lists/${list.id}`}
className="block w-full text-center py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition duration-200 font-medium"
>
Listeyi Görüntüle
</Link>
</div>
</div>
))
)}
</div>
</Card>
);
}
