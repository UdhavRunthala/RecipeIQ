import { Search, Bell, SlidersHorizontal } from "lucide-react";
import useDebouncedSearch from "../../hooks/useDebouncedSearch";

export default function Topbar({ searchPlaceholder = "Search pantry, recipes or ingredients...", onSearch }) {
  // onSearch is expected to be an async function provided by the parent
  // page (e.g. filtering pantry items, or eventually calling a real
  // search endpoint) — this component doesn't care how it's implemented,
  // only that it returns a Promise.
  const [searchValue, setSearchValue] = useDebouncedSearch(onSearch || (() => {}));

  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-gray-200 bg-white">
      <div className="relative w-96">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-gray-600">
          <Bell size={18} />
        </button>
        <button className="text-gray-400 hover:text-gray-600">
          <SlidersHorizontal size={18} />
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-200" />
      </div>
    </header>
  );
}