const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

/**
 * Search/Find books.
 * @param {string} query - The search query.
 * @param {string} filter - Optional filter type (e.g., 'intitle', 'inauthor').
 * @param {number} startIndex - Pagination start index.
 * @returns {Promise<object>} The search results.
 */
export const searchBooks = async (query, filter = null, startIndex = 0, orderBy = 'relevance') => {
    if (!query) return { items: [], totalItems: 0 };

    let q = query;
    if (filter) {
        if (filter === 'inauthor') {
            q = `${filter}:"${query}"`;
        } else {
            q = `${filter}:${query}`;
        }
    }

    // Google Books API maxResults defaults to 10, max is 40.
    const maxResults = 20;

    try {
        const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(q)}&startIndex=${startIndex}&maxResults=${maxResults}&orderBy=${orderBy}`);
        if (!response.ok) {
            throw new Error(`Google Books API error: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error searching books:', error);
        throw error;
    }
};

/**
 * Get book details by ID.
 * @param {string} id - The volume ID.
 * @returns {Promise<object>} The volume details.
 */
export const getBookDetails = async (id) => {
    if (!id) throw new Error('Book ID is required');

    try {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Google Books API error: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching book details:', error);
        throw error;
    }
};

/**
 * Get author's other books.
 * @param {string} author - The author name.
 * @returns {Promise<object>} The search results.
 */
export const getAuthorBooks = async (author) => {
    return searchBooks(author, 'inauthor');
};
