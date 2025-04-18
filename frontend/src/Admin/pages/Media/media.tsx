import React, { useState, useCallback, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  ChevronDown, 
  Upload, 
  Edit3,
  Download,
  Star,
  Trash2
} from 'lucide-react';
import Sidebar from '../../Components/Sidebar/Sidebar';
import AdminNavbar from '../../Components/AdminNavbar/AdminNavbar';
// import './Media.css';

interface MediaItem {
  id: number;
  title: string;
  type: 'image' | 'video';
  dateAdded: Date;
  size: string;
  favorite: boolean;
  thumbnail: string;
}

interface FilterOptions {
  type: string;
  date: string;
  sort: 'newest' | 'oldest' | 'name';
}

const Media: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => 
    Array.from({ length: 28269 }, (_, i) => ({
      id: i + 1,
      title: `Media ${i + 1}`,
      type: i % 2 === 0 ? 'image' : 'video',
      dateAdded: new Date(Date.now() - Math.random() * 10000000000),
      size: `${Math.floor(Math.random() * 10)}MB`,
      favorite: false,
      thumbnail: `/api/placeholder/400/320?text=Media ${i + 1}`
    }))
  );

  const [visibleMedia, setVisibleMedia] = useState<number>(16);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    type: 'all',
    date: 'all',
    sort: 'newest'
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const filterMenu = document.querySelector('.media-filter-menu');
      if (filterMenu && !filterMenu.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLoadMore = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setVisibleMedia(prev => Math.min(prev + 16, mediaItems.length));
      setLoading(false);
    }, 800);
  }, [mediaItems.length]);

  const toggleFavorite = useCallback((id: number) => {
    setMediaItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilter = useCallback((filterType: keyof FilterOptions, value: string) => {
    setFilterOptions(prev => ({ ...prev, [filterType]: value }));
  }, []);

  const filteredMedia = React.useMemo(() => {
    return mediaItems
      .filter(item => {
        if (searchQuery) {
          return item.title.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
      })
      .filter(item => {
        if (filterOptions.type !== 'all') {
          return item.type === filterOptions.type;
        }
        return true;
      })
      .sort((a, b) => {
        switch (filterOptions.sort) {
          case 'oldest':
            return a.dateAdded.getTime() - b.dateAdded.getTime();
          case 'name':
            return a.title.localeCompare(b.title);
          default:
            return b.dateAdded.getTime() - a.dateAdded.getTime();
        }
      });
  }, [mediaItems, searchQuery, filterOptions]);

  return (
    <div className="m-0 font-['Inter'] bg-[#f3f4f6] text-[#333] ml-[195px] mt-[100px] justify-start">
    <div className="flex min-h-screen bg-[#f8fafc] text-[#1e293b] relative mt-[-40px] ml-[-200px]">
  <Sidebar />
  <main className="flex-1 ml-[12rem] min-h-screen bg-[#f8fafc] relative z-10 mt-[-70px]">
    <div className="absolute top-0 right-0 left-[12rem] h-[70px] z-[1000] bg-white border-b border-[#e2e8f0] shadow-md">
      <AdminNavbar />
    </div>

    <div className="p-8 pt-[calc(70px+2rem)] max-w-screen-xl mx-auto relative">
      <div className="flex justify-between items-center mb-8 py-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-[#1e293b] leading-tight">Media Library</h1>
          <span className="text-sm text-[#64748b]">{filteredMedia.length} items total</span>
        </div>
        <div className="flex gap-4 items-center">
          <button className="flex items-center gap-2 py-3 px-6 bg-[#3b82f6] text-white rounded-lg font-medium shadow-sm transition-transform transform hover:bg-[#2563eb] hover:shadow-lg">
            <Upload size={20} />
            Upload New
          </button>
        </div>
      </div>

      <div className="sticky top-[70px] z-10 bg-[#f8fafc] -mt-8 mb-8 py-8">
        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search media files..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 py-3 border border-[#e2e8f0] rounded-lg bg-[#f8fafc] text-base focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6] transition-all"
            />
          </div>

          <div className="flex gap-4 items-center">
            <button
              className="flex items-center gap-2 py-3 px-5 border border-[#e2e8f0] rounded-lg font-medium text-[#475569] cursor-pointer hover:bg-[#f8fafc] transition-all"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              aria-expanded={isFilterOpen}
            >
              <Filter size={18} />
              Filters
              <ChevronDown size={16} />
            </button>

            {isFilterOpen && (
              <div className="absolute top-[calc(100%+0.5rem)] right-0 w-[280px] bg-white rounded-xl shadow-lg p-4 border border-[#e2e8f0] z-[100]">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-[#475569] mb-2">Media Type</h3>
                    <select
                      onChange={(e) => handleFilter('type', e.target.value)}
                      value={filterOptions.type}
                      className="w-full p-3 border border-[#e2e8f0] rounded-md text-sm text-[#475569] focus:outline-none focus:border-[#3b82f6]"
                    >
                      <option value="all">All Types</option>
                      <option value="image">Images</option>
                      <option value="video">Videos</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#475569] mb-2">Date Added</h3>
                    <select
                      onChange={(e) => handleFilter('date', e.target.value)}
                      value={filterOptions.date}
                      className="w-full p-3 border border-[#e2e8f0] rounded-md text-sm text-[#475569] focus:outline-none focus:border-[#3b82f6]"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#475569] mb-2">Sort By</h3>
                    <select
                      onChange={(e) => handleFilter('sort', e.target.value as 'newest' | 'oldest' | 'name')}
                      value={filterOptions.sort}
                      className="w-full p-3 border border-[#e2e8f0] rounded-md text-sm text-[#475569] focus:outline-none focus:border-[#3b82f6]"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="name">Name</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 py-2 px-4 bg-[#f1f5f9] rounded-lg">
            <button
              className={`p-3 border-none bg-transparent rounded-lg text-[#64748b] hover:bg-white ${viewMode === 'grid' ? 'bg-white text-[#3b82f6]' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              className={`p-3 border-none bg-transparent rounded-lg text-[#64748b] hover:bg-white ${viewMode === 'list' ? 'bg-white text-[#3b82f6]' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className={`grid gap-6 mt-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
        {filteredMedia.slice(0, visibleMedia).map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-md hover:transform hover:translate-y-1 transition-all relative">
            <div className="relative pt-[56.25%] bg-[#f1f5f9]">
              <img src={item.thumbnail} alt={item.title} className="absolute top-0 left-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center gap-4 opacity-0 hover:opacity-100 transition-opacity">
                <button onClick={() => toggleFavorite(item.id)} aria-label={item.favorite ? 'Remove from favorites' : 'Add to favorites'}>
                  <Star size={20} className={item.favorite ? 'text-yellow-400' : 'text-white'} />
                </button>
                <button aria-label="Edit">
                  <Edit3 size={20} className="text-white" />
                </button>
                <button aria-label="Download">
                  <Download size={20} className="text-white" />
                </button>
                <button className="text-white" aria-label="Delete">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-[#1e293b] mb-1">{item.title}</h3>
              <span className="text-sm text-[#64748b]">{item.type} • {item.size} • {new Date(item.dateAdded).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {visibleMedia < filteredMedia.length && (
        <div className="flex justify-center py-8 mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className={`py-3 px-8 border border-[#e2e8f0] rounded-lg font-medium text-[#475569] ${loading ? 'bg-[#f8fafc] cursor-wait' : 'bg-white hover:bg-[#f8fafc]'}`}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  </main>
</div>

  </div>
  );
};

export default Media;
