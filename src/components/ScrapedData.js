import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/ScrapedData.css';

const ScrapedData = () => {
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/scrape');
                setData(response.data.scrapedData);
            } catch (error) {
                console.error('Error fetching scraped data:', error);
            }
        };

        fetchData();
    }, []);

    const shuffledSites = Object.keys(data).sort(() => Math.random() - 0.5);

    return (
        <div className="scraped-data-container chaotic-layout">
            {shuffledSites.map((site, index) => (
                <div
                    key={index}
                    className="scraped-item chaotic-item"
                >
                    <p><strong>Source: {site}</strong></p>
                    {data[site].map((content, subIndex) => (
                        <p key={subIndex}>{content}</p>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ScrapedData;
