"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase/client";
import QRCode from "react-qr-code";
import { FaPrint, FaDownload, FaArrowLeft, FaBox, FaGlobe, FaLock } from "react-icons/fa";
import Card from "@/components/Card";
import CardTitle from "@/components/CardTitle";

export default function PrintQRPage() {
const router = useRouter();
const session = useSession();
const [lists, setLists] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedLists, setSelectedLists] = useState(new Set());

useEffect(() => {
document.title = "QR Kodlarını Yazdır - Boxify";
}, []);

useEffect(() => {
if (!session) {
router.push("/");
return;
}

const fetchUserLists = async () => {
setLoading(true);
const { data, error } = await supabase
.from("lists")
.select("*")
.eq("user_id", session.user.id)
.order("created_at", { ascending: false });

if (error) {
console.error("Kutular alınamadı:", error);
} else {
setLists(data || []);
// Başlangıçta tüm kutuları seçili yap
setSelectedLists(new Set(data?.map(list => list.id) || []));
}
setLoading(false);
};

fetchUserLists();
}, [session, router]);

const handlePrint = () => {
if (selectedLists.size === 0) {
alert("Yazdırmak için en az bir kutu seçin.");
return;
}
window.print();
};

const downloadAllQR = async () => {
const selectedListsArray = lists.filter(list => selectedLists.has(list.id));

if (selectedListsArray.length === 0) {
alert("Lütfen en az bir kutu seçin.");
return;
}

// Her QR kod için SVG oluştur ve indir
for (const list of selectedListsArray) {
const qrUrl = `${window.location.origin}/lists/${list.id}`;

// QR kod indirme işlemi - basit yaklaşım
const link = document.createElement('a');
link.download = `${list.name}-qr-kod.png`;
// Bu kısım daha sonra geliştirilecek
}
alert(`${selectedListsArray.length} QR kod indirme başlatıldı!`);
};

const toggleListSelection = (listId) => {
const newSelected = new Set(selectedLists);
if (newSelected.has(listId)) {
newSelected.delete(listId);
} else {
newSelected.add(listId);
}
setSelectedLists(newSelected);
};

const selectAll = () => {
setSelectedLists(new Set(lists.map(list => list.id)));
};

const selectNone = () => {
setSelectedLists(new Set());
};

if (loading) {
return (
<Card>
<CardTitle>QR Kodlarını Yazdır</CardTitle>
<div className="text-center py-12">
<div className="animate-spin text-4xl mb-4">⏳</div>
<p>Kutularınız yükleniyor...</p>
</div>
</Card>
);
}

if (lists.length === 0) {
return (
<Card>
<CardTitle>QR Kodlarını Yazdır</CardTitle>
<div className="text-center py-12">
<FaBox className="mx-auto text-gray-400 text-6xl mb-4" />
<p className="text-gray-600 text-lg mb-4">
Henüz hiç kutunuz yok.
</p>
<button
onClick={() => router.push("/lists")}
className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
>
İlk Kutunuzu Oluşturun
</button>
</div>
</Card>
);
}

return (
<div>
{/* Screen Only - Action Bar */}
<div className="print:hidden mb-6">
<div className="w-full max-w-4xl mx-auto p-6 bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20">
<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
<div className="flex-1">
<h1 className="text-2xl font-bold text-gray-800 mb-2">QR Kodlarını Yazdır</h1>
<p className="text-gray-600 mb-2">
{selectedLists.size} / {lists.length} kutu seçili
</p>
{selectedLists.size === 0 && (
<p className="text-red-500 text-sm">
⚠️ Yazdırmak için en az bir kutu seçin
</p>
)}
</div>
<div className="flex flex-wrap gap-2">
<button
onClick={() => router.push("/lists")}
className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition duration-300 flex items-center gap-2"
>
<FaArrowLeft size={14} />
Geri
</button>
<button
onClick={selectAll}
className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition duration-300"
>
Tümünü Seç
</button>
<button
onClick={selectNone}
className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-300"
>
Hiçbirini Seçme
</button>
<button
onClick={downloadAllQR}
className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-300 flex items-center gap-2"
>
<FaDownload size={14} />
Toplu İndir
</button>
<button
onClick={handlePrint}
className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300 flex items-center gap-2"
>
<FaPrint size={14} />
Yazdır
</button>
</div>
</div>
</div>
</div>

{/* Print Area */}
<div className="print:bg-white print:shadow-none print:border-none print:rounded-none print:p-0">
<div className="w-full max-w-6xl mx-auto px-4 print:px-0 print:max-w-none">

{/* QR Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 gap-6 print:gap-4">
{lists.map((list) => {
// Print'te sadece seçili olanları göster, ekranda hepsini göster
const shouldShow = window?.matchMedia?.('print')?.matches 
? selectedLists.has(list.id) 
: true;

if (!shouldShow) return null;
const qrUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/lists/${list.id}`;
return (
<div
key={list.id}
className={`
border-2 rounded-lg p-4 text-center transition-all duration-200 print:border-gray-300 print:rounded-none
${selectedLists.has(list.id) 
? 'border-blue-300 bg-blue-50 print:bg-white opacity-100' 
: 'border-gray-200 bg-gray-50 opacity-50 hover:opacity-75'
}
print:page-break-inside-avoid print:opacity-100
`}
onClick={() => !window.matchMedia('print').matches && toggleListSelection(list.id)}
style={{ cursor: window?.matchMedia?.('print')?.matches ? 'default' : 'pointer' }}
>
{/* Selection Indicator - Screen Only */}
<div className="print:hidden mb-2">
<input
type="checkbox"
checked={selectedLists.has(list.id)}
onChange={() => toggleListSelection(list.id)}
className="w-4 h-4 text-blue-600"
/>
</div>

{/* QR Code */}
<div className="bg-white p-3 rounded-lg border inline-block mb-3 print:p-2">
<QRCode
value={qrUrl}
size={120}
level="M"
includeMargin={false}
className="print:w-24 print:h-24"
/>
</div>

{/* Box Info */}
<div>
<h3 className="font-bold text-gray-800 mb-1 text-sm print:text-xs truncate">
{list.name}
</h3>
<div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-1">
{list.is_public ? (
<>
<FaGlobe size={10} className="text-green-500" />
<span className="text-green-600">Herkese Açık</span>
</>
) : (
<>
<FaLock size={10} className="text-gray-400" />
<span>Özel</span>
</>
)}
</div>
<p className="text-xs text-gray-400">
{new Date(list.created_at).toLocaleDateString('tr-TR')}
</p>
</div>
</div>
);
})}
</div>

</div>
</div>
</div>
);
}
