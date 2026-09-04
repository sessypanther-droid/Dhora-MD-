const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Cinesubz Downloader Command
 * Downloads anime and films from Cinesubz.com
 */

const cinesubzDownload = async (searchQuery) => {
    try {
        // Search for the content on Cinesubz
        const searchUrl = `https://cinesubz.com/?s=${encodeURIComponent(searchQuery)}`;
        const searchResponse = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(searchResponse.data);
        const results = [];

        // Extract search results
        $('article.item').each((index, element) => {
            if (results.length >= 5) return; // Limit to 5 results

            const title = $(element).find('h2.title a').text().trim();
            const url = $(element).find('h2.title a').attr('href');
            const image = $(element).find('img').attr('src');
            const year = $(element).find('span.year').text().trim();

            if (title && url) {
                results.push({
                    id: results.length + 1,
                    title,
                    url,
                    image,
                    year
                });
            }
        });

        return {
            success: true,
            results: results,
            count: results.length
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

const getDownloadLinks = async (contentUrl) => {
    try {
        const response = await axios.get(contentUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const downloadLinks = [];

        // Extract download links
        $('a.link-download, a.download-link').each((index, element) => {
            const link = $(element).attr('href');
            const quality = $(element).text().trim();

            if (link) {
                downloadLinks.push({
                    quality: quality || 'Default Quality',
                    url: link
                });
            }
        });

        // Alternative method: check for iframes and embedded players
        $('iframe').each((index, element) => {
            const src = $(element).attr('src');
            if (src && (src.includes('doodstream') || src.includes('mixdrop') || src.includes('voe'))) {
                downloadLinks.push({
                    quality: 'Streaming Link',
                    url: src
                });
            }
        });

        return {
            success: true,
            links: downloadLinks,
            count: downloadLinks.length
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

const formatSearchResults = (results) => {
    if (!results.success || results.count === 0) {
        return '❌ No results found. Try a different search term.';
    }

    let message = `🎬 *Cinesubz Search Results* (${results.count} found)\n\n`;
    
    results.results.forEach((item) => {
        message += `*${item.id}. ${item.title}*\n`;
        if (item.year) message += `📅 Year: ${item.year}\n`;
        message += `🔗 Link: ${item.url}\n\n`;
    });

    message += '📝 Reply with the number to get download links';
    return message;
};

const formatDownloadLinks = (links) => {
    if (!links.success || links.count === 0) {
        return '❌ No download links found. The content might be region-restricted or unavailable.';
    }

    let message = `✅ *Download Links Found* (${links.count})\n\n`;
    
    links.links.forEach((link, index) => {
        message += `${index + 1}. *${link.quality}*\n`;
        message += `${link.url}\n\n`;
    });

    message += '⚠️ *Note:* Use a torrent client or compatible download manager to download';
    return message;
};

module.exports = {
    cinesubzDownload,
    getDownloadLinks,
    formatSearchResults,
    formatDownloadLinks
};
