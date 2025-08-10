"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import useLists from "@/hooks/useLists";
import { createList, deleteList } from "@/utils/ListActions";
import Card from "@/components/Card";
import CardTitle from "@/components/CardTitle";
import ListItem from "@/components/ListItem";
import ListItemSkeleton from "@/components/ListItemSkeleton";
import SearchResultItem from "@/components/SearchResultItem";

export default function ListsPage() {
const { lists, error, loading, setError, setLists, searchLists } = useLists();
const [listName, setListName] = useState("");
const [isInputVisible, setIsInputVisible] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [isSearching, setIsSearching] = useState(false);

const handleCreateList = async () => {
await createList(listName, setError, setLists, lists);
setListName("");
setIsInputVisible(false);
};

const handleSearch = (value) => {
setSearchTerm(value);
setIsSearching(value.length >= 3);
searchLists(value);
};

const handleDeleteItem = (item) => {
if (item.searchType === 'list') {
deleteList(item.id, setError, setLists, lists);
} else {
// Öğeler için silme işlemi şimdilik desteklenmiyor
console.log('Öğe silme işlemi henüz desteklenmiyor');
}
};

	return (
		<Card>
			<CardTitle>Listelerinizi Yönetin</CardTitle>
			{error && <p className="text-center text-red-500 mb-4">{error}</p>}
<div className="flex justify-between gap-2 items-center mb-4">
<div className="flex-grow">
<input
type="text"
value={searchTerm}
placeholder="Kutu veya öğe ara..."
className="p-2 border rounded-lg focus:outline-none focus:border-blue-300 w-full"
onChange={(e) => handleSearch(e.target.value)}
/>
</div>
<div className="flex gap-2 items-center">
<button
onClick={() => setIsInputVisible(!isInputVisible)}
className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center gap-1"
>
<FaPlus />
<span>Yeni Liste</span>
</button>
</div>
</div>

			{isInputVisible && (
				<div className="flex w-full mb-6">
					<input
						onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
						type="text"
						value={listName}
						onChange={(e) => setListName(e.target.value)}
						placeholder="Yeni liste adı"
						className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:border-blue-300"
					/>
					<button
						onClick={handleCreateList}
						className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-r-lg transition duration-300"
					>
						Liste Oluştur
					</button>
				</div>
			)}

{isSearching && searchTerm.length >= 3 && (
<div className="mb-4 p-3 bg-blue-50 rounded-lg">
<p className="text-sm text-blue-600">
&ldquo;{searchTerm}&rdquo; için arama sonuçları ({lists.length} sonuç bulundu)
</p>
</div>
)}

{isSearching ? (
<div className="grid grid-cols-1 gap-4">
{loading && <ListItemSkeleton />}
{lists.length === 0 && !loading ? (
<p className="text-center text-gray-600">
Arama kriterlerinize uygun sonuç bulunamadı.
</p>
) : (
lists.map((list) => (
<SearchResultItem
key={list.id}
item={list}
handleDeleteList={() => handleDeleteItem(list)}
/>
))
)}
</div>
) : (
<div className="grid grid-cols-2 gap-4">
{loading && <ListItemSkeleton />}
{lists.length === 0 && !loading ? (
<p className="col-span-2 text-center text-gray-600">
Henüz oluşturulmuş bir listeniz yok.
</p>
) : (
lists.map((list) => (
<ListItem
key={list.id}
list={list}
handleDeleteList={() =>
deleteList(list.id, setError, setLists, lists)
}
/>
))
)}
</div>
)}
		</Card>
	);
}
