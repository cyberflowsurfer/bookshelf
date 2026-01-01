import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AddToLibraryModal = ({ isOpen, onClose, book, onConfirm, initialTags = [] }) => {
    if (!isOpen || !book) return null;

    const [readDate, setReadDate] = useState(new Date().toISOString().split('T')[0]);
    const [tags, setTags] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (isOpen && book) {
            const tagsToUse = initialTags && initialTags.length > 0 ? initialTags : (book.volumeInfo.categories || []);
            setTags(tagsToUse.join(', '));
            setNotes('');
            setReadDate(new Date().toISOString().split('T')[0]);
        }
    }, [isOpen, book?.id]); // Only reset when opening or changing books

    const handleSubmit = (e) => {
        e.preventDefault();
        const tagList = tags.split(',').map(t => t.trim()).filter(t => t);
        onConfirm({
            id: book.id,
            volumeInfo: book.volumeInfo,
            readDate,
            tags: tagList,
            notes
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                        <button
                            type="button"
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={onClose}
                        >
                            <span className="sr-only">Close</span>
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                Add to Library: {book.volumeInfo.title}
                            </h3>
                            <div className="mt-2">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="readDate" className="block text-sm font-medium text-gray-700">Date Read</label>
                                        <input
                                            type="date"
                                            name="readDate"
                                            id="readDate"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={readDate}
                                            onChange={(e) => setReadDate(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                                        <input
                                            type="text"
                                            name="tags"
                                            id="tags"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                            placeholder="Fiction, Startups, History"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            rows={3}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="What did you think about this book?"
                                        />
                                    </div>
                                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                        <button
                                            type="submit"
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                            Add to Library
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddToLibraryModal;
