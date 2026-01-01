import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useBookStore = create(
    persist(
        (set, get) => ({
            library: [],
            wishlist: [],
            tags: ['Fiction', 'Non-fiction', 'Sci-Fi', 'Technology', 'Biography'],

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

            importData: (data) => {
                // Basic validation could go here
                set({
                    library: data.library || [],
                    wishlist: data.wishlist || [],
                    tags: data.tags || ['Fiction', 'Non-fiction', 'Sci-Fi', 'Technology', 'Biography']
                });
            },

            reset: () => set({ library: [], wishlist: [], tags: ['Fiction', 'Non-fiction', 'Sci-Fi', 'Technology', 'Biography'] })
        }),
        {
            name: 'bookshelf-storage',
        }
    )
);

export default useBookStore;
