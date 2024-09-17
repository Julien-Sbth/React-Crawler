const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());
app.use(express.json());

function formatScrapedData(data) {
    const groupedData = {};

    data.forEach(item => {
        if (!groupedData[item.source]) {
            groupedData[item.source] = [];
        }
        groupedData[item.source].push(item.text);
    });

    return groupedData;
}

async function scrapeWebsite(url) {
    try {
        console.log(`Scraping ${url}...`);
        const { data, headers } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
            }
        });

        let scrapedData = [];

        if (headers['content-type'].includes('application/json')) {
            const jsonString = JSON.stringify(data, null, 2);
            scrapedData.push({ text: jsonString, source: url });
        } else {
            const $ = cheerio.load(data);

            $('p').each((i, elem) => {
                const text = $(elem).text().trim();
                if (text) {
                    scrapedData.push({ text, source: url });
                }
            });
        }

        console.log(`Data scraped from ${url}:`, scrapedData);
        return scrapedData;
    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        return [];
    }
}

app.get('/api/scrape', async (req, res) => {
    const urls = [
        'https://example.org',
        'https://example.net',
        'https://lipsum.com',
        'https://httpbin.org',
        'https://run.mocky.io/v3/2a9f5d6e-c78e-4b0f-b317-cd281567c1c0',
        'https://pokeapi.co/api/v2/pokemon/ditto',
        'https://jsonplaceholder.typicode.com/posts',
        'https://api.github.com/users/github',
    ];

    try {
        const results = await Promise.all(urls.map(url => scrapeWebsite(url)));
        const formattedData = formatScrapedData(results.flat());
        res.json({ scrapedData: formattedData });
    } catch (error) {
        console.error('Error during scraping:', error);
        res.status(500).json({ error: 'Error during scraping' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
