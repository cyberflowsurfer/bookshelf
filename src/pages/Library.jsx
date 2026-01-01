import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Tag, Calendar, BookOpen, Trash2, Edit } from 'lucide-react';
import useBookStore from '../store/useBookStore';
import TagControl from '../components/TagControl';

const Library = () => {
    const { library, removeFromLibrary, updateBook } = useBookStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'readDate', direction: 'desc' });
    const [expandedRows, setExpandedRows] = useState(new Set());

    const uniqueTags = useMemo(() => {
        const allTags = new Set(library.flatMap(book => book.tags || []));
        return Array.from(allTags).sort();
    }, [library]);

    const filteredBooks = useMemo(() => {
        let books = [...library];

        if (selectedTag) {
            books = books.filter(book => book.tags && book.tags.includes(selectedTag));
        }

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            books = books.filter(book => {
                const title = book.volumeInfo.title?.toLowerCase() || '';
                const authors = book.volumeInfo.authors?.join(' ').toLowerCase() || '';
                const desc = book.volumeInfo.description?.toLowerCase() || '';
                const notes = book.notes?.toLowerCase() || '';
                return title.includes(lowerQuery) || authors.includes(lowerQuery) || desc.includes(lowerQuery) || notes.includes(lowerQuery);
            });
        }

        books.sort((a, b) => {
            let aValue = '';
            let bValue = '';

            switch (sortConfig.key) {
                case 'title':
                    aValue = a.volumeInfo.title || '';
                    bValue = b.volumeInfo.title || '';
                    break;
                case 'author':
                    aValue = a.volumeInfo.authors?.[0] || '';
                    bValue = b.volumeInfo.authors?.[0] || '';
                    break;
                case 'publishedDate':
                    aValue = a.volumeInfo.publishedDate || '';
                    bValue = b.volumeInfo.publishedDate || '';
                    break;
                case 'readDate':
                    aValue = a.readDate || '';
                    bValue = b.readDate || '';
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return books;
    }, [library, searchQuery, selectedTag, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const toggleDescription = (id) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">My Library ({library.length})</h1>
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                            placeholder="Search library..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tag Cloud */}
                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedTag(null)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${!selectedTag ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                        All
                    </button>
                    {uniqueTags.map(tag => (
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

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                                    Cover
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('title')}
                                >
                                    Title
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('author')}
                                >
                                    Author
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-32"
                                    onClick={() => handleSort('publishedDate')}
                                >
                                    Published
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-32"
                                    onClick={() => handleSort('readDate')}
                                >
                                    Read Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                                    Tags
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBooks.map((book) => {
                                const info = book.volumeInfo;
                                const isExpanded = expandedRows.has(book.id);
                                return (
                                    <tr key={book.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap align-top">
                                            <img
                                                className="h-16 w-12 object-cover rounded shadow-sm"
                                                src={info.imageLinks?.smallThumbnail || 'https://via.placeholder.com/128x192'}
                                                alt=""
                                            />
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <Link to={`/book/${book.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-900 block max-w-xs truncate">
                                                {info.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 block max-w-xs truncate align-top">
                                            {info.authors?.join(', ')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top">
                                            {info.publishedDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top">
                                            {book.readDate || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 relative align-top">
                                            <div className={`${isExpanded ? '' : 'line-clamp-2'} max-w-sm`}>
                                                {info.description || 'No description.'}
                                            </div>
                                            {info.description && (
                                                <button
                                                    onClick={() => toggleDescription(book.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 text-xs mt-1"
                                                >
                                                    {isExpanded ? 'Show less' : 'Show more'}
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 align-top">
                                            <TagControl
                                                tags={book.tags || []}
                                                onTagsChange={(newTags) => updateBook(book.id, { tags: newTags })}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                                            <button
                                                onClick={() => { if (window.confirm(`Delete "${info.title}"?`)) removeFromLibrary(book.id) }}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredBooks.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No books found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Library;
