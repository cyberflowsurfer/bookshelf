import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, BookOpen } from 'lucide-react';
import useBookStore from '../store/useBookStore';
import RecommendationsWidget from '../components/RecommendationsWidget';
import AuthorFeedWidget from '../components/AuthorFeedWidget';

const Home = () => {
    const navigate = useNavigate();
    const { following, topics, library, authorProfiles } = useBookStore();
    return (
        <div className="space-y-8">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Bookshelf</h1>
                        <p className="text-gray-600 mb-6">
                            Track your reading journey, discover new books, and manage your wishlist.
                        </p>

                        {/* This Year's Reads */}
                        <div className="mt-8">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">This Year's Reads</h2>
                            <div className="flex flex-wrap gap-4">
                                {library.filter(book => {
                                    if (!book.readDate) return false;
                                    const readDate = new Date(book.readDate);
                                    const oneYearAgo = new Date();
                                    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                                    return readDate >= oneYearAgo;
                                }).sort((a, b) => new Date(a.readDate) - new Date(b.readDate))
                                    .map(book => (
                                        <div
                                            key={book.id}
                                            className="w-16 h-24 bg-gray-200 rounded shadow hover:shadow-md transition-all cursor-pointer overflow-hidden transform hover:-translate-y-1"
                                            onClick={() => navigate(`/book/${book.id}`)}
                                            title={`${book.volumeInfo.title} (Read: ${book.readDate})`}
                                        >
                                            {book.volumeInfo.imageLinks?.thumbnail ? (
                                                <img
                                                    src={book.volumeInfo.imageLinks.thumbnail}
                                                    alt={book.volumeInfo.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-200">
                                                    <BookOpen className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                {library.filter(b => b.readDate).length === 0 && (
                                    <p className="text-sm text-gray-400 italic">No books read this year yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <img src="/wile-cyote-genius.png" alt="Wile E. Coyote Genius" className="max-h-64 object-contain" />
                    </div>
                </div>
            </div>

            {/* Dashboard Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="h-full">
                    <RecommendationsWidget authors={following} topics={topics} library={library} />
                </div>
                <div className="h-full">
                    <AuthorFeedWidget authors={following} authorProfiles={authorProfiles} />
                </div>
            </div>
        </div>
    );
};

export default Home;
