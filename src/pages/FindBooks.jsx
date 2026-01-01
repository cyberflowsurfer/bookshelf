import React, { useState } from 'react';
import { Search, Plus, BookOpen, Loader } from 'lucide-react';
import { searchBooks } from '../services/googleBooks';
import useBookStore from '../store/useBookStore';
import AddToLibraryModal from '../components/AddToLibraryModal';

const FindBooks = () => {
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('');
    const [orderBy, setOrderBy] = useState('newest');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedBook, setSelectedBook] = useState(null);

    const { addToWishlist, addToLibrary, wishlist, library } = useBookStore();

    const handleSearch = async (startIndex = 0) => {
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        try {
            const data = await searchBooks(query, filter || null, startIndex, orderBy);
            setResults(data.items || []);
            setTotalItems(data.totalItems || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openLibraryModal = (book) => {
        setSelectedBook(book);
    };

    const closeLibraryModal = () => {
        setSelectedBook(null);
    };

    const handleAddToLibrary = (bookData) => {
        addToLibrary(bookData);
        closeLibraryModal();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setPage(0);
            handleSearch(0);
        }
    };

    const handleNextPage = () => {
        const nextIndex = (page + 1) * 20;
        if (nextIndex < totalItems) {
            setPage(page + 1);
            handleSearch(nextIndex);
            window.scrollTo(0, 0);
        }
    };

    const handlePrevPage = () => {
        if (page > 0) {
            const prevIndex = (page - 1) * 20;
            setPage(page - 1);
            handleSearch(prevIndex);
            window.scrollTo(0, 0);
        }
    };

    const getThumbnail = (book) => {
        return book.volumeInfo.imageLinks?.thumbnail || book.volumeInfo.imageLinks?.smallThumbnail || 'https://via.placeholder.com/128x192.png?text=No+Image';
    };

    const isBookActionable = (bookId) => {
        const inLib = library.find(b => b.id === bookId);
        const inWish = wishlist.find(b => b.id === bookId);
        return { inLib, inWish };
    };

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Find New Books</h1>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-grow relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                            placeholder="Search by title, author, keyword..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <select
                        className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="">All Fields</option>
                        <option value="intitle">Title</option>
                        <option value="inauthor">Author</option>
                        <option value="inpublisher">Publisher</option>
                        <option value="subject">Category</option>
                    </select>
                    <select
                        className="block w-full sm:w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                        value={orderBy}
                        onChange={(e) => setOrderBy(e.target.value)}
                    >
                        <option value="newest">Newest</option>
                        <option value="relevance">Relevance</option>
                    </select>
                    <button
                        onClick={() => { setPage(0); handleSearch(0); }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Search
                    </button>
                </div>
            </div>

            {loading && (
                <div className="flex justify-center py-12">
                    <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
                </div>
            )}

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {!loading && results.length > 0 && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {results
                            .slice()
                            .sort((a, b) => {
                                if (orderBy !== 'newest') return 0;
                                const dateA = a.volumeInfo.publishedDate || '0000';
                                const dateB = b.volumeInfo.publishedDate || '0000';
                                return dateB.localeCompare(dateA);
                            })
                            .map((book) => {
                                const { inLib, inWish } = isBookActionable(book.id);
                                const info = book.volumeInfo;
                                return (
                                    <li key={book.id} className="p-4 hover:bg-gray-50 transition duration-150 ease-in-out">
                                        <div className="flex gap-4 items-start">
                                            <div className="flex-shrink-0">
                                                <img
                                                    className="h-32 w-24 object-cover shadow-sm rounded-md"
                                                    src={getThumbnail(book)}
                                                    alt={info.title}
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="text-lg font-medium text-gray-900">{info.title}</h3>
                                                <p className="text-sm text-gray-500 italic mb-1">{info.authors?.join(', ') || 'Unknown Author'}</p>
                                                <p className="text-xs text-gray-400 mb-2">
                                                    {info.publishedDate} • {info.pageCount ? `${info.pageCount} pages` : 'N/A'}
                                                </p>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                                    {info.description || 'No description available.'}
                                                </p>
                                                <div className="flex gap-2">
                                                    {!inWish && !inLib && (
                                                        <button
                                                            onClick={() => addToWishlist({ id: book.id, volumeInfo: info })}
                                                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        >
                                                            <Plus className="h-4 w-4 mr-1" />
                                                            Add to Wishlist
                                                        </button>
                                                    )}
                                                    {inWish && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            In Wishlist
                                                        </span>
                                                    )}
                                                    {!inLib && (
                                                        <button
                                                            onClick={() => openLibraryModal(book)}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        >
                                                            <BookOpen className="h-4 w-4 mr-1" />
                                                            Add to Library
                                                        </button>
                                                    )}
                                                    {inLib && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            In Library
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                    </ul>
                    {/* Pagination */}
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={handlePrevPage}
                                disabled={page === 0}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${page === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNextPage}
                                disabled={(page + 1) * 20 >= totalItems}
                                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${(page + 1) * 20 >= totalItems ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{page * 20 + 1}</span> to <span className="font-medium">{Math.min((page + 1) * 20, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={page === 0}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={(page + 1) * 20 >= totalItems}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${(page + 1) * 20 >= totalItems ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <AddToLibraryModal
                isOpen={!!selectedBook}
                onClose={closeLibraryModal}
                book={selectedBook}
                onConfirm={handleAddToLibrary}
            />
        </div>
    );
};

export default FindBooks;
