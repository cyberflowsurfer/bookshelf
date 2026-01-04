import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Parser from 'rss-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'db.json');
const parser = new Parser();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Ensure DB file exists
if (!fs.existsSync(DB_FILE)) {
    const initialData = {
        library: [],
        wishlist: [],
        tags: ['Fiction', 'Non-fiction', 'Sci-Fi', 'Technology', 'Biography']
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

app.get('/api/data', (req, res) => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        console.error('Error reading database:', err);
        res.status(500).json({ error: 'Failed to read database' });
    }
});

app.post('/api/data', (req, res) => {
    try {
        const data = req.body;
        // Basic validation could happen here
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        res.json({ success: true });
    } catch (err) {
        console.error('Error writing database:', err);
        res.status(500).json({ error: 'Failed to save database' });
    }
});

app.get('/api/rss', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    try {
        const feed = await parser.parseURL(url);
        res.json(feed);
    } catch (error) {
        console.error('Error parsing RSS:', error);
        res.status(500).json({ error: 'Failed to parse RSS feed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
