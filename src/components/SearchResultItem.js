import { useRouter } from "next/navigation";
import { FaBox, FaList, FaTrash } from "react-icons/fa";
import { memo } from "react";

// Arama terimini vurgulayan yardımcı fonksiyon
const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm || !text) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
        {part}
      </mark>
    ) : part
  );
};

function SearchResultItem({ item, searchTerm, handleDeleteList }) {
  const router = useRouter();

  const handleClick = () => {
    if (item.searchType === 'list') {
      router.push(`/lists/${item.id}`);
    } else if (item.searchType === 'item') {
      router.push(`/lists/${item.list_id}`);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    handleDeleteList();
  };

  return (
    <div
      onClick={handleClick}
      className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer bg-white"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Icon with colored background */}
          <div className={`p-2 rounded-full ${item.searchType === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
            {item.searchType === 'list' ? <FaList size={16} /> : <FaBox size={16} />}
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Main title with highlighting */}
            <h3 className="font-semibold text-gray-800 truncate">
              {highlightSearchTerm(item.displayName, searchTerm)}
            </h3>
            
            {/* Parent info for items */}
            {item.searchType === 'item' && item.parentList && (
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <FaBox className="mr-1 flex-shrink-0" size={12} />
                <span className="truncate">
                  {highlightSearchTerm(item.parentList.name, searchTerm)} kutusunda
                </span>
              </p>
            )}
            
            {/* Type badge */}
            <div className="mt-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                item.searchType === 'list' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {item.searchType === 'list' ? '📋 Kutu' : '📦 Öğe'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Delete button for lists */}
        {item.searchType === 'list' && (
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 ml-3 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 flex-shrink-0"
            title="Kutuyu sil"
          >
            <FaTrash size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(SearchResultItem);
