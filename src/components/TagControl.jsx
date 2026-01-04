import React, { useState } from 'react';
import { Edit2, X, Plus, Check } from 'lucide-react';
import useBookStore from '../store/useBookStore';

const TagControl = ({ tags = [], onTagsChange, canEdit = true }) => {
    const { tags: globalTags, addTag } = useBookStore();
    const [isEditing, setIsEditing] = useState(false);
    const [newTag, setNewTag] = useState('');

    const handleAddTag = () => {
        if (!newTag.trim()) return;
        const tag = newTag.trim();
        if (!tags.includes(tag)) {
            const updatedTags = [...tags, tag];
            onTagsChange(updatedTags);
            addTag(tag); // Add to global pool
        }
        setNewTag('');
    };

    const handleRemoveTag = (tagToRemove) => {
        const updatedTags = tags.filter(t => t !== tagToRemove);
        onTagsChange(updatedTags);
    };

    return (
        <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="block font-medium text-gray-700 text-sm">Tags</span>
                {canEdit && (
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-gray-400 hover:text-indigo-600 focus:outline-none"
                        title="Edit Tags"
                    >
                        {isEditing ? <Check className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-2 relative z-10 bg-white p-2 rounded shadow-sm border border-gray-100">
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, idx) => (
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
                            placeholder="Add..."
                            list="global-tags-control"
                            className="flex-1 min-w-0 block w-full px-2 py-1 rounded text-xs border-gray-300 border focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <datalist id="global-tags-control">
                            {globalTags.map(t => <option key={t} value={t} />)}
                        </datalist>
                        <button
                            onClick={handleAddTag}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap gap-1">
                    {tags.length > 0 ? tags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {tag}
                        </span>
                    )) : (
                        <span className="text-xs text-gray-400 italic">No tags</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default TagControl;
