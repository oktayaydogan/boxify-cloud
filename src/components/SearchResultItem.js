import { useRouter } from "next/navigation";
import { FaBox, FaList } from "react-icons/fa";

export default function SearchResultItem({ item, handleDeleteList }) {
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
      className="p-4 border rounded-lg hover:shadow-lg transition duration-300 cursor-pointer bg-white"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="text-blue-500">
            {item.searchType === 'list' ? <FaList size={20} /> : <FaBox size={20} />}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{item.displayName}</h3>
            {item.searchType === 'item' && item.parentList && (
              <p className="text-sm text-gray-500">
                <FaBox className="inline mr-1" size={12} />
                {item.parentList.name} kutusunda
              </p>
            )}
            <p className="text-xs text-gray-400">
              {item.searchType === 'list' ? 'Kutu' : 'Öğe'}
            </p>
          </div>
        </div>
        {item.searchType === 'list' && (
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition duration-300 ml-2"
          >
            Sil
          </button>
        )}
      </div>
    </div>
  );
}
