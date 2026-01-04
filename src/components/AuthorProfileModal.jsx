import React, { useState, useEffect } from 'react';
import { X, Globe, Mic, Linkedin, FileText, Twitter, Search, Rss } from 'lucide-react';

const AuthorProfileModal = ({ isOpen, onClose, authorName, initialData, onSave }) => {
    const [formData, setFormData] = useState({
        rss: '',
        blog: '',
        podcast: '',
        linkedin: '',
        substack: '',
        x: '' // X/Twitter
    });

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                rss: initialData.rss || '',
                blog: initialData.blog || '',
                podcast: initialData.podcast || '',
                linkedin: initialData.linkedin || '',
                substack: initialData.substack || '',
                x: initialData.x || ''
            });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(authorName, formData);
        onClose();
    };

    const searchLink = (type) => {
        const query = `${authorName} ${type}`;
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Edit Profile: {authorName}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-4">
                        {/* RSS Feed */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Rss className="h-4 w-4 text-orange-600" /> RSS Feed
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                    placeholder="https://.../feed"
                                    value={formData.rss}
                                    onChange={(e) => setFormData({ ...formData, rss: e.target.value })}
                                />
                                <button type="button" onClick={() => searchLink('RSS Feed')} className="p-2 text-gray-400 hover:text-indigo-600" title="Search Google">
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Blog */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Globe className="h-4 w-4 text-blue-500" /> Blog / Website
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                    placeholder="https://..."
                                    value={formData.blog}
                                    onChange={(e) => setFormData({ ...formData, blog: e.target.value })}
                                />
                                <button type="button" onClick={() => searchLink('Blog')} className="p-2 text-gray-400 hover:text-indigo-600" title="Search Google">
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Podcast */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Mic className="h-4 w-4 text-purple-500" /> Podcast
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                    placeholder="https://..."
                                    value={formData.podcast}
                                    onChange={(e) => setFormData({ ...formData, podcast: e.target.value })}
                                />
                                <button type="button" onClick={() => searchLink('Podcast')} className="p-2 text-gray-400 hover:text-indigo-600" title="Search Google">
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* LinkedIn */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Linkedin className="h-4 w-4 text-blue-700" /> LinkedIn
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                    placeholder="https://linkedin.com/in/..."
                                    value={formData.linkedin}
                                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                />
                                <button type="button" onClick={() => searchLink('LinkedIn')} className="p-2 text-gray-400 hover:text-indigo-600" title="Search Google">
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Substack */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-orange-500" /> Substack
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                    placeholder="https://...substack.com"
                                    value={formData.substack}
                                    onChange={(e) => setFormData({ ...formData, substack: e.target.value })}
                                />
                                <button type="button" onClick={() => searchLink('Substack')} className="p-2 text-gray-400 hover:text-indigo-600" title="Search Google">
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* X / Twitter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Twitter className="h-4 w-4 text-black" /> X (Twitter)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                    placeholder="https://x.com/..."
                                    value={formData.x}
                                    onChange={(e) => setFormData({ ...formData, x: e.target.value })}
                                />
                                <button type="button" onClick={() => searchLink('Twitter X')} className="p-2 text-gray-400 hover:text-indigo-600" title="Search Google">
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Save Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthorProfileModal;
