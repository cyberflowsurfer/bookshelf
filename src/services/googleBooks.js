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

/**
 * Get recommendations based on followed authors and topics.
 * Returns books released in the last N days.
 * @param {object} params - { authors: string[], topics: string[], excludeTitles: string[], daysAgo: number }
 * @returns {Promise<object[]>} Sorted list of recommended books.
 */
export const getRecommendations = async ({ authors = [], topics = [], excludeTitles = [], daysAgo = 365 }) => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - daysAgo);
    const dateThreshold = pastDate.toISOString().split('T')[0];

    // Normalize excluded titles for case-insensitive comparison
    const normalizedExcluded = new Set(excludeTitles.map(t => t.toLowerCase().trim()));

    // Helper to fetch and extract items
    const fetchItems = async (query, filter) => {
        try {
            const data = await searchBooks(query, filter, 0, 'newest');
            return data.items || [];
        } catch (e) {
            console.warn(`Failed to fetch recommendations for ${query}:`, e);
            return [];
        }
    };

    const promises = [];

    // Fetch for authors
    authors.forEach(author => {
        promises.push(fetchItems(author, 'inauthor'));
    });

    // Fetch for topics
    topics.forEach(topic => {
        promises.push(fetchItems(topic, 'intitle')); // Or use general query if preferred
    });

    const results = await Promise.all(promises);
    const allBooks = results.flat();

    // Deduplicate by ID
    const uniqueBooks = Array.from(new Map(allBooks.map(item => [item.id, item])).values());

    // Filter by date (last N days) AND exclude titles
    const recentBooks = uniqueBooks.filter(book => {
        const pubDate = book.volumeInfo?.publishedDate;
        if (!pubDate) return false;

        // Check date
        if (pubDate < dateThreshold) return false;

        // Check title exclusion
        const title = book.volumeInfo?.title?.toLowerCase()?.trim();
        if (title && normalizedExcluded.has(title)) return false;

        return true;
    });

    // Sort by date descending
    return recentBooks.sort((a, b) => {
        const dateA = a.volumeInfo.publishedDate || '';
        const dateB = b.volumeInfo.publishedDate || '';
        return dateB.localeCompare(dateA);
    });
};
