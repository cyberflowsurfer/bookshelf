import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, EyeOff, Search, Book, ExternalLink, Hash, X, Plus, Pencil, Globe, Mic, Linkedin, FileText, Twitter } from 'lucide-react';
import useBookStore from '../store/useBookStore';
import { useNotification } from '../context/NotificationContext';
import AuthorProfileModal from '../components/AuthorProfileModal';

const Following = () => {
    const { following, unfollowAuthor, followAuthor, topics, addTopic, removeTopic, authorProfiles, updateAuthorProfile } = useBookStore();
    const { showNotification } = useNotification();
    const [newTopic, setNewTopic] = useState('');
    const [newAuthor, setNewAuthor] = useState('');
    const [editingAuthor, setEditingAuthor] = useState(null);

    const handleUnfollow = (author) => {
        if (window.confirm(`Unfollow ${author}?`)) {
            unfollowAuthor(author);
            showNotification(`Unfollowed ${author}`, 'info');
        }
    };

    const handleFollow = (e) => {
        e.preventDefault();
        const trimmed = newAuthor.trim();
        if (trimmed) {
            if (following.includes(trimmed)) {
                showNotification('Already following this author!', 'error');
                return;
            }
            followAuthor(trimmed);
            setNewAuthor('');
            showNotification(`Following: ${trimmed}`, 'success');
        }
    };

    const handleSaveProfile = (author, data) => {
        updateAuthorProfile(author, data);
        showNotification('Profile updated', 'success');
    };

    const handleAddTopic = (e) => {
        e.preventDefault();
        const trimmed = newTopic.trim();
        if (trimmed) {
            if (topics.includes(trimmed)) {
                showNotification('Topic already exists!', 'error');
                return;
            }
            addTopic(trimmed);
            setNewTopic('');
            showNotification(`Added topic: ${trimmed}`, 'success');
        }
    };

    const handleRemoveTopic = (topic) => {
        if (window.confirm(`Remove topic "${topic}"?`)) {
            removeTopic(topic);
            showNotification(`Removed topic: ${topic}`, 'info');
        }
    };

    // Sort topics alphabetically
    const sortedTopics = [...topics].sort((a, b) => a.localeCompare(b));

    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900">Following</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Authors Section */}
                <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-full">
                    <div className="p-6 border-b border-gray-200 flex items-center gap-3 bg-gray-50">
                        <Users className="h-6 w-6 text-indigo-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Authors ({following.length})</h2>
                    </div>

                    <div className="p-6 bg-gray-50 border-b border-gray-200">
                        <form onSubmit={handleFollow} className="flex gap-2">
                            <input
                                type="text"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 p-2 border"
                                placeholder="Add new author"
                                value={newAuthor}
                                onChange={(e) => setNewAuthor(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!newAuthor.trim()}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="h-5 w-5" />
                            </button>
                        </form>
                    </div>
                    {following.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No authors followed yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Wikipedia</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Socials</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Books</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {following.map((author) => {
                                        const profile = authorProfiles[author] || {};
                                        return (
                                            <tr key={author} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{author}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <a
                                                        href={`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(author)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-gray-400 hover:text-blue-600 transition-colors"
                                                        title="View on Wikipedia"
                                                    >
                                                        <ExternalLink className="h-5 w-5" />
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                                                    {profile.blog && <a href={profile.blog} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500" title="Blog"><Globe className="h-4 w-4" /></a>}
                                                    {profile.podcast && <a href={profile.podcast} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-500" title="Podcast"><Mic className="h-4 w-4" /></a>}
                                                    {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700" title="LinkedIn"><Linkedin className="h-4 w-4" /></a>}
                                                    {profile.substack && <a href={profile.substack} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500" title="Substack"><FileText className="h-4 w-4" /></a>}
                                                    {profile.x && <a href={profile.x} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black" title="X (Twitter)"><Twitter className="h-4 w-4" /></a>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <Link
                                                        to={`/find?query=${encodeURIComponent(author)}&filter=inauthor`}
                                                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                                                        title={`Find books by ${author}`}
                                                    >
                                                        <Book className="h-5 w-5" />
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => setEditingAuthor(author)}
                                                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                                                            title="Edit Profile"
                                                        >
                                                            <Pencil className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUnfollow(author)}
                                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                                            title="Unfollow"
                                                        >
                                                            <EyeOff className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Topics Section */}
                <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-full">
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                        <div className="flex items-center gap-3">
                            <Hash className="h-6 w-6 text-indigo-600" />
                            <h2 className="text-xl font-semibold text-gray-900">Topics ({topics.length})</h2>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 border-b border-gray-200">
                        <form onSubmit={handleAddTopic} className="flex gap-2">
                            <input
                                type="text"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 p-2 border"
                                placeholder="Add new topic (e.g. Space, History)"
                                value={newTopic}
                                onChange={(e) => setNewTopic(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!newTopic.trim()}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="h-5 w-5" />
                            </button>
                        </form>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        {sortedTopics.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No topics added yet.
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {sortedTopics.map((topic) => (
                                    <li key={topic} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                                        <span className="text-base text-gray-700 font-medium px-2">{topic}</span>
                                        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <Link
                                                to={`/find?query=${encodeURIComponent(topic)}`}
                                                className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50"
                                                title={`Find books about ${topic}`}
                                            >
                                                <Book className="h-5 w-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleRemoveTopic(topic)}
                                                className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                                                title="Delete Topic"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {editingAuthor && (
                <AuthorProfileModal
                    isOpen={!!editingAuthor}
                    onClose={() => setEditingAuthor(null)}
                    authorName={editingAuthor}
                    initialData={authorProfiles[editingAuthor]}
                    onSave={handleSaveProfile}
                />
            )}
        </div>
    );
};

export default Following;
