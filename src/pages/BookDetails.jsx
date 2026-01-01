import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calendar, Save, Trash2, Tag, BookHeart, Edit2, X, Plus, Check } from 'lucide-react';
import useBookStore from '../store/useBookStore';
import { getBookDetails, getAuthorBooks } from '../services/googleBooks';
import { useNotification } from '../context/NotificationContext';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { library, wishlist, updateBook, addToLibrary, addToWishlist, removeFromLibrary, removeFromWishlist, addTag, tags: globalTags } = useBookStore();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authorBooks, setAuthorBooks] = useState([]);
    const [notes, setNotes] = useState('');
    const [readDate, setReadDate] = useState('');
    const [isDirty, setIsDirty] = useState(false);
    const [isEditingTags, setIsEditingTags] = useState(false);
    const [newTag, setNewTag] = useState('');

    const inLibrary = library.find(b => b.id === id);
    const inWishlist = wishlist.find(b => b.id === id);

    useEffect(() => {
        const loadBook = async () => {
            setLoading(true);
            let foundBook = inLibrary || inWishlist;

            if (!foundBook) {
                try {
                    // Try to fetch from API if not in local store (e.g. deep link)
                    foundBook = await getBookDetails(id);
                } catch (e) {
                    console.error("Failed to load book", e);
                }
            }

            if (foundBook) {
                setBook(foundBook);
                setNotes(foundBook.notes || '');
                setReadDate(foundBook.readDate || '');

                // Fetch author books
                const author = foundBook.volumeInfo?.authors?.[0];
                if (author) {
                    getAuthorBooks(author).then(data => {
                        // Filter out current book
                        const others = (data.items || []).filter(b => b.id !== id);
                        setAuthorBooks(others);
                    }).catch(console.error);
                }
            }
            setLoading(false);
        };

        loadBook();
    }, [id, inLibrary, inWishlist]);

    const { showNotification } = useNotification();

    const handleSave = () => {
        if (inLibrary) {
            updateBook(id, { notes, readDate });
            setIsDirty(false);
            showNotification('Changes saved successfully!', 'success');
        } else {
            // If in wishlist or external, prompt to add to library
            if (window.confirm("Add to library to save notes?")) {
                addToLibrary({ ...book, notes, readDate });
                if (inWishlist) removeFromWishlist(id);
                setIsDirty(false);
                showNotification('Book added to library and notes saved!', 'success');
            }
        }
    };

    const handleAddTag = () => {
        if (!newTag.trim()) return;
        const tag = newTag.trim();
        const currentTags = book.tags || [];
        if (!currentTags.includes(tag)) {
            const updatedTags = [...currentTags, tag];
            updateBook(id, { tags: updatedTags });
            addTag(tag); // Add to global pool
            if (!inLibrary) {
                // For non-library books, we might just update local state or prompt?
                // Current requirement implies editing tags "on the book page". If not in library, changes aren't persisted comfortably.
                // Assuming "inLibrary" context for editing.
                // If not in library, update local 'book' state only?
                setBook(prev => ({ ...prev, tags: updatedTags }));
            }
        }
        setNewTag('');
    };

    const handleRemoveTag = (tagToRemove) => {
        const currentTags = book.tags || [];
        const updatedTags = currentTags.filter(t => t !== tagToRemove);
        updateBook(id, { tags: updatedTags });
        if (!inLibrary) {
            setBook(prev => ({ ...prev, tags: updatedTags }));
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!book) return <div className="p-8 text-center">Book not found.</div>;

    const info = book.volumeInfo || {};
    const largeImage = info.imageLinks?.medium || info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail;

    return (
        <div className="space-y-8 animate-fade-in">
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </button>

            {/* Hero Section */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:flex-shrink-0 bg-gray-50 p-8 flex justify-center items-start">
                        <img
                            className="h-64 w-auto object-cover shadow-lg rounded"
                            src={largeImage}
                            alt={info.title}
                        />
                    </div>
                    <div className="p-8 md:flex-grow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 font-serif">{info.title}</h1>
                                {info.subtitle && <p className="text-xl text-gray-500 mt-1">{info.subtitle}</p>}
                                <p className="text-lg text-gray-600 italic mt-2">{info.authors?.join(', ')}</p>
                            </div>
                            {inLibrary && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    In Library
                                </span>
                            )}
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-500">
                            <div>
                                <span className="block font-medium text-gray-700">Publisher</span>
                                {info.publisher}, {info.publishedDate}
                            </div>
                            <div>
                                <span className="block font-medium text-gray-700">Length</span>
                                {info.pageCount} pages
                            </div>
                            <div>
                                <span className="block font-medium text-gray-700">ISBN</span>
                                {info.industryIdentifiers?.[0]?.identifier || 'N/A'}
                            </div>
                            <div>
                                <span className="block font-medium text-gray-700">Categories</span>
                                {info.categories?.join(', ')}
                            </div>
                            <div>
                                <div className="flex justify-between items-center">
                                    <span className="block font-medium text-gray-700">Tags</span>
                                    {inLibrary && (
                                        <button
                                            onClick={() => setIsEditingTags(!isEditingTags)}
                                            className="text-gray-400 hover:text-indigo-600 focus:outline-none"
                                            title="Edit Tags"
                                        >
                                            {isEditingTags ? <Check className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                                        </button>
                                    )}
                                </div>

                                {isEditingTags ? (
                                    <div className="mt-2 space-y-2">
                                        <div className="flex flex-wrap gap-2">
                                            {(book.tags || []).map((tag, idx) => (
                                                <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                                    {tag}
                                                    <button
                                                        onClick={() => handleRemoveTag(tag)}
                                                        className="ml-1.5 inline-flex text-indigo-500 hover:text-indigo-900 focus:outline-none"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                                placeholder="Add tag..."
                                                list="global-tags"
                                                className="flex-1 min-w-0 block w-full px-3 py-1.5 rounded-md border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500 border"
                                            />
                                            <datalist id="global-tags">
                                                {globalTags.map(t => <option key={t} value={t} />)}
                                            </datalist>
                                            <button
                                                onClick={handleAddTag}
                                                className="inline-flex items-center px-2 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {(book.tags && book.tags.length > 0) ? book.tags.map((tag, idx) => (
                                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                                {tag}
                                            </span>
                                        )) : (
                                            <span className="text-xs text-gray-400 italic">No tags</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {inLibrary && (
                            <div className="mt-8 flex items-center space-x-4">
                                <div>
                                    <label htmlFor="readDate" className="block text-sm font-medium text-gray-700">Read Date</label>
                                    <input
                                        type="date"
                                        id="readDate"
                                        value={readDate}
                                        onChange={(e) => { setReadDate(e.target.value); setIsDirty(true); }}
                                        className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                    />
                                </div>
                            </div>
                        )}

                        {!inLibrary && (
                            <div className="mt-8 flex items-center space-x-4">
                                <button
                                    onClick={() => {
                                        addToLibrary({ ...book, readDate: new Date().toISOString().split('T')[0] });
                                        if (inWishlist) removeFromWishlist(id);
                                    }}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <BookOpen className="h-5 w-5 mr-2" />
                                    Add to Library
                                </button>
                                {!inWishlist && (
                                    <button
                                        onClick={() => {
                                            addToWishlist({ ...book, volumeInfo: info });
                                            showNotification('Added to wishlist!', 'success');
                                        }}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <BookHeart className="h-5 w-5 mr-2" />
                                        Add to Wishlist
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Description & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                    <div
                        className="prose prose-blue text-gray-600"
                        dangerouslySetInnerHTML={{ __html: info.description || 'No description available.' }}
                    />
                </div>

                <div className="bg-white shadow rounded-lg p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Notes</h2>
                        {isDirty && (
                            <button
                                onClick={handleSave}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                <Save className="h-4 w-4 mr-1" />
                                Save Changes
                            </button>
                        )}
                    </div>
                    <textarea
                        className="flex-grow w-full border border-gray-300 rounded-md shadow-sm p-4 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                        placeholder="Write your notes here..." // Supports basic formatting like markdown conceptually
                        value={notes}
                        onChange={(e) => { setNotes(e.target.value); setIsDirty(true); }}
                    />
                    <p className="mt-2 text-xs text-gray-400">
                        Supports basic text. Changes are saved when you click Save.
                    </p>
                </div>
            </div>

            {/* Author's Other Books */}
            {authorBooks.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">More by {info.authors?.[0]}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {authorBooks.slice(0, 6).map(b => {
                            const isBookInLibrary = library.some(libBook => libBook.id === b.id);
                            const isBookInWishlist = wishlist.some(wishBook => wishBook.id === b.id);

                            return (
                                <div key={b.id} className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                                    <div className="aspect-w-2 aspect-h-3 bg-gray-200 relative">
                                        <img
                                            src={b.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192'}
                                            alt={b.volumeInfo.title}
                                            className="object-cover w-full h-full"
                                        />
                                        {/* Overlay Actions */}
                                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                                            {!isBookInLibrary && !isBookInWishlist && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addToWishlist({
                                                            id: b.id,
                                                            volumeInfo: b.volumeInfo
                                                        });
                                                        showNotification('Added to wishlist!', 'success');
                                                    }}
                                                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 shadow-sm"
                                                    title="Add to Wishlist"
                                                >
                                                    + Wishlist
                                                </button>
                                            )}
                                            {isBookInWishlist && (
                                                <span className="text-xs text-white font-medium bg-green-600 px-2 py-0.5 rounded-full">In Wishlist</span>
                                            )}
                                            {isBookInLibrary && (
                                                <span className="text-xs text-white font-medium bg-blue-600 px-2 py-0.5 rounded-full">In Library</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Navigation Link Overlay */}
                                    <button
                                        onClick={() => { navigate(`/book/${b.id}`); window.scrollTo(0, 0); }}
                                        className="absolute inset-0 focus:outline-none z-0"
                                    >
                                        <span className="sr-only">View details for {b.volumeInfo.title}</span>
                                    </button>

                                    <div className="p-2">
                                        <p className="block text-sm font-medium text-gray-900 truncate">{b.volumeInfo.title}</p>
                                        <p className="text-xs text-gray-500 truncate">{b.volumeInfo.publishedDate?.substring(0, 4)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookDetails;
