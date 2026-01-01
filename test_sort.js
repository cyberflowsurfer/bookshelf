const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

const testSort = async () => {
    const query = 'react';
    const orderBy = 'newest';
    const url = `${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=20&orderBy=${orderBy}`;

    console.log(`Fetching: ${url}`);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items) {
            console.log(`Found ${data.items.length} items.`);
            data.items.forEach((item, index) => {
                const date = item.volumeInfo.publishedDate || 'N/A';
                console.log(`${index + 1}. ${date} - ${item.volumeInfo.title}`);
            });
        } else {
            console.log('No items found.');
        }
    } catch (err) {
        console.error('Error:', err);
    }
};

testSort();
