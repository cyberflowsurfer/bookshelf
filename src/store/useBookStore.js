import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useBookStore = create(
    persist(
        (set, get) => ({
            library: [],
            wishlist: [],
            tags: ['Fiction', 'Non-fiction', 'Sci-Fi', 'Technology', 'Biography'],
            following: [],
            topics: [],

            addToLibrary: (book) =>
                set((state) => {
                    if (state.library.find((b) => b.id === book.id)) return state;
                    return { library: [book, ...state.library] };
                }),

            removeFromLibrary: (id) =>
                set((state) => ({
                    library: state.library.filter((b) => b.id !== id),
                })),

            updateBook: (id, updates) =>
                set((state) => ({
                    library: state.library.map((b) =>
                        b.id === id ? { ...b, ...updates } : b
                    ),
                })),

            addToWishlist: (book) =>
                set((state) => {
                    if (state.wishlist.find((b) => b.id === book.id)) return state;
                    if (state.library.find((b) => b.id === book.id)) return state; // Already in library
                    return { wishlist: [book, ...state.wishlist] };
                }),

            removeFromWishlist: (id) =>
                set((state) => ({
                    wishlist: state.wishlist.filter((b) => b.id !== id),
                })),

            moveToLibrary: (id, libraryData) =>
                set((state) => {
                    const bookToMove = state.wishlist.find((b) => b.id === id);
                    if (!bookToMove) return state;

                    const newBook = { ...bookToMove, ...libraryData };
                    return {
                        library: [newBook, ...state.library],
                        wishlist: state.wishlist.filter((b) => b.id !== id),
                    };
                }),

            addTag: (tag) =>
                set((state) => {
                    if (state.tags.includes(tag)) return state;
                    return { tags: [...state.tags, tag] };
                }),

            removeTag: (tag) =>
                set((state) => ({
                    tags: state.tags.filter(t => t !== tag)
                })),

            followAuthor: (author) =>
                set((state) => {
                    if (state.following.includes(author)) return state;
                    return { following: [...state.following, author] };
                }),

            unfollowAuthor: (author) =>
                set((state) => ({
                    following: state.following.filter(a => a !== author)
                })),

            addTopic: (topic) =>
                set((state) => {
                    if (state.topics.includes(topic)) return state;
                    return { topics: [...state.topics, topic] };
                }),

            removeTopic: (topic) =>
                set((state) => ({
                    topics: state.topics.filter(t => t !== topic)
                })),

            importData: (data) => {
                // Basic validation could go here
                set({
                    library: data.library || [],
                    wishlist: data.wishlist || [],
                    tags: data.tags || ['Fiction', 'Non-fiction', 'Sci-Fi', 'Technology', 'Biography'],
                    following: data.following || [],
                    topics: data.topics || []
                });
            },

            reset: () => set({ library: [], wishlist: [], tags: ['Fiction', 'Non-fiction', 'Sci-Fi', 'Technology', 'Biography'], following: [], topics: [] })
        }),
        {
            name: 'bookshelf-storage',
            storage: createJSONStorage(() => ({
                getItem: async (name) => {
                    try {
                        const response = await fetch('/api/data');
                        if (!response.ok) return null;
                        const data = await response.json();
                        // Wrap state for Zustand persist
                        return JSON.stringify({ state: data, version: 0 });
                    } catch (e) {
                        console.error('Failed to fetch from server:', e);
                        return null;
                    }
                },
                setItem: async (name, value) => {
                    try {
                        const parsed = JSON.parse(value);
                        await fetch('/api/data', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(parsed.state)
                        });
                    } catch (e) {
                        console.error('Failed to save to server:', e);
                    }
                },
                removeItem: () => { }
            })),
        }
    )
);

export default useBookStore;
