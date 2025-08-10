"use client";

import { useState, useCallback, useMemo } from "react";
import { FaPlus, FaSearch, FaTimes, FaSpinner } from "react-icons/fa";
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

const handleDeleteItem = useCallback((item) => {
if (item.searchType === 'list') {
deleteList(item.id, setError, setLists, lists);
} else {
// Öğeler için silme işlemi şimdilik desteklenmiyor
console.log('Öğe silme işlemi henüz desteklenmiyor');
}
}, [setError, setLists, lists]);

// Memoize expensive calculations
const memoizedSearchResults = useMemo(() => {
if (!isSearching) return null;
return lists.map((list) => (
<SearchResultItem
key={list.id}
item={list}
searchTerm={searchTerm}
handleDeleteList={() => handleDeleteItem(list)}
/>
));
}, [lists, searchTerm, isSearching, handleDeleteItem]);

const memoizedListResults = useMemo(() => {
if (isSearching) return null;
return lists.map((list) => (
<ListItem
key={list.id}
list={list}
handleDeleteList={() => deleteList(list.id, setError, setLists, lists)}
/>
));
}, [lists, isSearching, setError, setLists]);

	return (
		<Card>
			<CardTitle>Listelerinizi Yönetin</CardTitle>
			{error && <p className="text-center text-red-500 mb-4">{error}</p>}
<div className="flex flex-col sm:flex-row justify-between gap-2 items-stretch sm:items-center mb-4">
<div className="flex-grow relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<FaSearch className="h-4 w-4 text-gray-400" />
</div>
<input
type="text"
value={searchTerm}
placeholder="Kutu veya öğe ara..."
className="pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 w-full transition duration-200"
onChange={(e) => handleSearch(e.target.value)}
/>
{searchTerm && (
<button
onClick={() => handleSearch("")}
className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition duration-200"
>
<FaTimes className="h-4 w-4 text-gray-400" />
</button>
)}
{loading && isSearching && (
<div className="absolute inset-y-0 right-8 flex items-center">
<FaSpinner className="h-4 w-4 text-blue-500 animate-spin" />
</div>
)}
</div>
<div className="flex gap-2 items-center">
<button
onClick={() => setIsInputVisible(!isInputVisible)}
className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center gap-1 whitespace-nowrap"
>
<FaPlus />
<span className="hidden sm:inline">Yeni Liste</span>
<span className="sm:hidden">Yeni</span>
</button>
</div>
</div>

{isInputVisible && (
<div className="flex flex-col sm:flex-row w-full mb-6 gap-2 sm:gap-0">
<input
onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
type="text"
value={listName}
onChange={(e) => setListName(e.target.value)}
placeholder="Yeni liste adı"
className="flex-grow p-3 border rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition duration-200"
/>
<button
onClick={handleCreateList}
disabled={!listName.trim()}
className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg sm:rounded-l-none sm:rounded-r-lg transition duration-300"
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
memoizedSearchResults
)}
</div>
) : (
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
{loading && <ListItemSkeleton />}
{lists.length === 0 && !loading ? (
<p className="col-span-full text-center text-gray-600">
Henüz oluşturulmuş bir listeniz yok.
</p>
) : (
memoizedListResults
)}
</div>
)}
		</Card>
	);
}
