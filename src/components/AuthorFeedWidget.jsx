import React, { useEffect, useState } from 'react';
import { Rss, ExternalLink, RefreshCw, MessageCircle } from 'lucide-react';
import axios from 'axios';

const AuthorFeedWidget = ({ authors = [], authorProfiles = {} }) => {
    const [feedItems, setFeedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const followedAuthorsWithRss = React.useMemo(() => {
        return authors.filter(author => authorProfiles[author]?.rss);
    }, [authors, authorProfiles]);

    useEffect(() => {
        const fetchFeeds = async () => {
            if (followedAuthorsWithRss.length === 0) {
                setLoading(false);
                setFeedItems([]);
                return;
            }

            setLoading(true);
            const allItems = [];

            try {
                const promises = followedAuthorsWithRss.map(async (author) => {
                    const rssUrl = authorProfiles[author].rss;
                    try {
                        // Use our backend proxy
                        const response = await axios.get(`http://localhost:3001/api/rss?url=${encodeURIComponent(rssUrl)}`);
                        if (response.data && response.data.items) {
                            return response.data.items.slice(0, 3).map(item => ({
                                ...item,
                                authorName: author, // Tag with local author name
                                platform: 'rss',
                                isoDate: item.isoDate || item.pubDate ? new Date(item.isoDate || item.pubDate) : new Date()
                            }));
                        }
                    } catch (e) {
                        console.warn(`Failed to fetch RSS for ${author}`, e);
                        return [];
                    }
                    return [];
                });

                const results = await Promise.all(promises);
                results.flat().forEach(item => allItems.push(item));

                // Sort by date descending
                allItems.sort((a, b) => b.isoDate - a.isoDate);
                setFeedItems(allItems);

            } catch (error) {
                console.error("Error fetching feeds", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeeds();
    }, [followedAuthorsWithRss, authorProfiles]);

    const fallbackCards = () => {
        // If we have no RSS items (or no authors with RSS), show some "Check in" cards for random followed authors
        if (authors.length === 0) return null;

        // Pick up to 3 random authors to show "Check updates" for
        const randomAuthors = [...authors].sort(() => 0.5 - Math.random()).slice(0, 3);

        return randomAuthors.map(author => (
            <div key={author} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                        {author.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">{author}</p>
                        <p className="text-xs text-gray-500">Check for latest updates</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    {authorProfiles[author]?.x && (
                        <a href={authorProfiles[author].x} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-black">
                            {/* Simple generic icon if lucide Twitter/X not perfect */}
                            <span className="text-xs font-bold">X</span>
                        </a>
                    )}
                    {authorProfiles[author]?.blog && (
                        <a href={authorProfiles[author].blog} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-blue-600">
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    )}
                </div>
            </div>
        ));
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2 text-indigo-600" />
                    What Authors Are Saying
                </h2>
                <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border">
                    Latest Updates
                </span>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4 max-h-[400px]">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : feedItems.length > 0 ? (
                    feedItems.map((item, index) => (
                        <div key={index} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {item.authorName}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {item.isoDate.toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1">
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 hover:underline">
                                    {item.title}
                                </a>
                            </h3>
                            <p className="text-xs text-gray-600 line-clamp-2">
                                {item.contentSnippet || item.content}
                            </p>
                            <div className="mt-2 flex items-center text-xs text-gray-400">
                                <Rss className="h-3 w-3 mr-1" />
                                {new URL(item.link || 'http://example.com').hostname}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="space-y-4">
                        <div className="text-center py-4 text-gray-500 text-sm">
                            <p>No RSS feeds configured for your followed authors.</p>
                            <p className="text-xs mt-1">Add RSS links in the "Following" tab to see updates here.</p>
                        </div>
                        <div className="border-t border-gray-100 pt-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Check</p>
                            <div className="space-y-3">
                                {fallbackCards()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthorFeedWidget;
