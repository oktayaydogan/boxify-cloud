"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { FaTimes, FaDownload, FaQrcode } from "react-icons/fa";

export default function QRCodeModal({ isOpen, onClose, listId, listName }) {
const [qrValue, setQrValue] = useState("");

useEffect(() => {
if (isOpen && listId) {
// Kutu detay sayfasının tam URL'ini oluştur
const currentUrl = window.location.origin;
const qrUrl = `${currentUrl}/lists/${listId}`;
setQrValue(qrUrl);
}
}, [isOpen, listId]);

const downloadQR = () => {
const svg = document.getElementById("qr-code-svg");
const svgData = new XMLSerializer().serializeToString(svg);
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();

canvas.width = 256;
canvas.height = 256;
ctx.fillStyle = "white";
ctx.fillRect(0, 0, 256, 256);

img.onload = () => {
ctx.drawImage(img, 0, 0, 256, 256);
const pngFile = canvas.toDataURL("image/png");
const downloadLink = document.createElement("a");
downloadLink.download = `${listName || 'kutu'}-qr-kod.png`;
downloadLink.href = pngFile;
downloadLink.click();
};

img.src = "data:image/svg+xml;base64," + btoa(svgData);
};

if (!isOpen) return null;

return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
{/* Header */}
<div className="flex items-center justify-between mb-6">
<div className="flex items-center gap-3">
<div className="p-2 rounded-full bg-blue-100 text-blue-600">
<FaQrcode size={20} />
</div>
<h3 className="text-xl font-bold text-gray-800">QR Kod</h3>
</div>
<button
onClick={onClose}
className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition duration-200"
>
<FaTimes size={18} />
</button>
</div>

{/* QR Code */}
{qrValue && (
<div className="text-center">
<div className="mb-4">
<h4 className="text-lg font-semibold text-gray-800 mb-2">
{listName}
</h4>
<p className="text-sm text-gray-600 mb-4">
Bu QR kodu tarayarak kutunuza doğrudan erişim sağlayabilirsiniz
</p>
</div>

{/* QR Code Display */}
<div className="bg-white p-6 rounded-xl border-2 border-gray-200 mb-6 inline-block">
<QRCode
id="qr-code-svg"
value={qrValue}
size={200}
level="M"
includeMargin={false}
/>
</div>

{/* QR Code URL */}
<div className="mb-6 p-3 bg-gray-50 rounded-lg">
<p className="text-xs text-gray-500 mb-1">QR Kod Linki:</p>
<p className="text-sm text-gray-700 break-all font-mono">
{qrValue}
</p>
</div>

{/* Action Buttons */}
<div className="flex gap-3">
<button
onClick={downloadQR}
className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
>
<FaDownload size={16} />
QR Kodu İndir
</button>
<button
onClick={onClose}
className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-300"
>
Kapat
</button>
</div>
</div>
)}
</div>
</div>
);
}
