import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Trash2, ExternalLink, Plus } from 'lucide-react';
import useBookStore from '../store/useBookStore';
import AddToLibraryModal from '../components/AddToLibraryModal';

const Wishlist = () => {
    const { wishlist, tags, removeFromWishlist, moveToLibrary } = useBookStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);

    const filteredBooks = useMemo(() => {
        let books = [...wishlist];

        if (selectedTag) {
            books = books.filter(book => book.tags && book.tags.includes(selectedTag));
        }

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            books = books.filter(book => {
                const title = book.volumeInfo.title?.toLowerCase() || '';
                const authors = book.volumeInfo.authors?.join(' ').toLowerCase() || '';
                const desc = book.volumeInfo.description?.toLowerCase() || '';
                return title.includes(lowerQuery) || authors.includes(lowerQuery) || desc.includes(lowerQuery);
            });
        }
        return books;
    }, [wishlist, searchQuery, selectedTag]);

    const openAmazon = (book) => {
        const query = `${book.volumeInfo.title} ${book.volumeInfo.authors?.[0] || ''}`;
        window.open(`https://www.amazon.com/s?k=${encodeURIComponent(query)}`, '_blank');
    };

    const handleMoveToLibrary = (bookData) => {
        // bookData comes from modal with { readDate, tags, notes, ... }
        // We need to merge this with the original book and call store's moveToLibrary
        moveToLibrary(bookData.id, {
            readDate: bookData.readDate,
            tags: bookData.tags,
            notes: bookData.notes
        });
        setSelectedBook(null);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">My Wishlist ({wishlist.length})</h1>
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                            placeholder="Search wishlist..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                {/* Tag Cloud - reused style */}
                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedTag(null)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${!selectedTag ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                        All
                    </button>
                    {tags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${tag === selectedTag ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book) => {
                    const info = book.volumeInfo;
                    return (
                        <div key={book.id} className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
                            <div
                                className="h-48 bg-gray-200 flex items-center justify-center cursor-pointer relative group"
                                onClick={() => openAmazon(book)}
                            >
                                {info.imageLinks?.thumbnail ? (
                                    <img src={info.imageLinks.thumbnail} alt={info.title} className="h-full object-contain p-4" />
                                ) : (
                                    <span className="text-gray-400">No Image</span>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                                    <ExternalLink className="text-white opacity-0 group-hover:opacity-100 w-8 h-8 drop-shadow-md" />
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <h3
                                    className="text-lg font-medium text-gray-900 mb-1 cursor-pointer hover:text-indigo-600 line-clamp-2"
                                    onClick={() => openAmazon(book)}
                                >
                                    {info.title}
                                </h3>
                                <p className="text-sm text-gray-500 italic mb-2 line-clamp-1">{info.authors?.join(', ')}</p>
                                <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
                                    {info.description || 'No description available.'}
                                </p>

                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => setSelectedBook(book)}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                                    >
                                        <BookOpen className="h-4 w-4 mr-1" />
                                        Move to Library
                                    </button>
                                    <button
                                        onClick={() => { if (window.confirm('Remove from wishlist?')) removeFromWishlist(book.id) }}
                                        className="text-gray-400 hover:text-red-600"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filteredBooks.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-lg shadow dashed border-2 border-gray-200 border-dashed">
                        No books in your wishlist matching the criteria. Go find some books!
                    </div>
                )}
            </div>

            <AddToLibraryModal
                isOpen={!!selectedBook}
                onClose={() => setSelectedBook(null)}
                book={selectedBook}
                onConfirm={handleMoveToLibrary}
                initialTags={selectedBook?.tags} // Pass existing tags if any (e.g. from categorization)
            />
        </div>
    );
};

export default Wishlist;
