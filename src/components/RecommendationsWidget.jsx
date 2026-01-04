import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { getRecommendations } from '../services/googleBooks';

const RecommendationsWidget = ({ authors = [], topics = [], library = [] }) => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [daysLimit, setDaysLimit] = useState(365);
    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        const fetchRecs = async () => {
            if (authors.length === 0 && topics.length === 0) {
                setBooks([]);
                return;
            }

            setLoading(true);
            try {
                // Extract titles to exclude
                const excludeTitles = library.map(b => b.volumeInfo?.title || '');
                const results = await getRecommendations({ authors, topics, excludeTitles, daysAgo: daysLimit });
                setBooks(results);
                setPage(0);
            } catch (error) {
                console.error("Failed to load recommendations", error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchRecs, 500); // Debounce input changes
        return () => clearTimeout(debounce);
    }, [authors, topics, library, daysLimit]);

    const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
    const displayedBooks = books.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

    // ... loading and empty states can stay or be adjusted ...
    // Note: If loading caused by input change, we might want to keep the current list visible or show a different loading state.
    // For simplicity, we'll keep the current behavior but maybe show a different loading indicator?
    // Actually, let's keep it simple for now.

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex-grow flex flex-col justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-gray-500 text-sm">Finding new releases...</p>
                </div>
            )
        }

        if (books.length === 0) {
            return (
                <div className="flex-grow flex flex-col justify-center items-center text-center text-gray-500 p-6">
                    <BookOpen className="h-12 w-12 mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Recent Releases</h3>
                    <p className="text-sm">
                        No books found in the last {daysLimit} days <br /> matching your authors or topics.
                    </p>
                    {(authors.length === 0 && topics.length === 0) && (
                        <p className="mt-4 text-xs text-indigo-600">
                            Try following some authors or topics!
                        </p>
                    )}
                </div>
            );
        }

        return (
            <div className="flex-grow overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                                Cover
                            </th>
                            <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Author
                            </th>
                            <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {displayedBooks.map((book) => {
                            const info = book.volumeInfo;
                            const thumbnail = info.imageLinks?.smallThumbnail || info.imageLinks?.thumbnail;

                            return (
                                <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-2 py-2 whitespace-nowrap">
                                        <div
                                            className="h-12 w-8 bg-gray-200 rounded overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                                            onClick={() => { navigate(`/book/${book.id}`); window.scrollTo(0, 0); }}
                                        >
                                            {thumbnail ? (
                                                <img src={thumbnail} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                    <BookOpen className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-2 py-2">
                                        <div
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer truncate max-w-[200px]"
                                            onClick={() => { navigate(`/book/${book.id}`); window.scrollTo(0, 0); }}
                                            title={info.title}
                                        >
                                            {info.title}
                                        </div>
                                    </td>
                                    <td className="px-2 py-2 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 flex items-center">
                                            {info.authors?.[0] || 'Unknown'}
                                        </div>
                                    </td>
                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                                        {info.publishedDate}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        )
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-indigo-600" />
                    New Releases
                </h2>
                <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-2">Last</span>
                    <input
                        type="number"
                        min="1"
                        max="3650"
                        value={daysLimit}
                        onChange={(e) => setDaysLimit(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-center border rounded focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                    />
                    <span className="ml-2">Days</span>
                </div>
            </div>

            {renderContent()}

            {(!loading && books.length > 0 && totalPages > 1) && (
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between mt-auto">
                    <p className="text-sm text-gray-700">
                        Page <span className="font-medium">{page + 1}</span> of <span className="font-medium">{totalPages}</span>
                    </p>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className={`p-1 rounded-md ${page === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={page === totalPages - 1}
                            className={`p-1 rounded-md ${page === totalPages - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecommendationsWidget;
