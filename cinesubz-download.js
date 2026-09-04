const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

/**
 * Cinesubz Direct Downloader
 * User gives name -> Automatically finds and downloads to WhatsApp
 */

const getCinesubzDirectDownload = async (searchQuery) => {
    try {
        // Step 1: Search on Cinesubz
        const searchUrl = `https://cinesubz.com/?s=${encodeURIComponent(searchQuery)}`;
        const searchResponse = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(searchResponse.data);
        
        // Get first result
        const firstResult = $('article.item').first();
        const contentUrl = firstResult.find('h2.title a').attr('href');
        const title = firstResult.find('h2.title a').text().trim();

        if (!contentUrl) {
            return {
                success: false,
                error: `❌ No results found for "${searchQuery}"`
            };
        }

        // Step 2: Get download links from content page
        const contentResponse = await axios.get(contentUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        const $content = cheerio.load(contentResponse.data);
        
        // Try to extract direct download link
        let downloadUrl = null;
        
        // Method 1: Look for direct download links
        $content('a.link-download, a.download-link, a[href*="mediafire"], a[href*="mega"], a[href*="gdrive"]').each((i, el) => {
            const link = $content(el).attr('href');
            if (link && !downloadUrl) {
                downloadUrl = link;
            }
        });

        // Method 2: Look for streaming iframes and get video source
        if (!downloadUrl) {
            $content('iframe').each((i, el) => {
                const src = $content(el).attr('src');
                if (src) {
                    downloadUrl = src;
                    return false;
                }
            });
        }

        // Method 3: Try to extract from buttons or clickable elements
        if (!downloadUrl) {
            $content('button, a[class*="download"], a[class*="view"]').each((i, el) => {
                const link = $content(el).attr('href') || $content(el).attr('data-url');
                if (link && !downloadUrl) {
                    downloadUrl = link;
                }
            });
        }

        if (!downloadUrl) {
            return {
                success: false,
                error: `⚠️ Download link not found for "${title}". Try a different title.`
            };
        }

        return {
            success: true,
            title: title,
            url: downloadUrl,
            contentPage: contentUrl
        };

    } catch (error) {
        return {
            success: false,
            error: `❌ Error: ${error.message}`
        };
    }
};

const downloadFileToWhatsApp = async (fileUrl, filename) => {
    try {
        // Download file with timeout
        const response = await axios.get(fileUrl, {
            responseType: 'arraybuffer',
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        // Save to temp file
        const tempDir = path.join(process.cwd(), 'downloads');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const filePath = path.join(tempDir, filename);
        fs.writeFileSync(filePath, response.data);

        return {
            success: true,
            path: filePath,
            filename: filename,
            size: response.data.length
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

const cinesubzDirectDownload = async (conn, m, searchQuery) => {
    try {
        // Send searching message
        await m.reply(`🔍 Searching for "${searchQuery}"...`);

        // Get download link
        const searchResult = await getCinesubzDirectDownload(searchQuery);

        if (!searchResult.success) {
            return await m.reply(searchResult.error);
        }

        await m.reply(`⏳ Found: *${searchResult.title}*\n📥 Downloading... Please wait`);

        // Download file
        const filename = `${searchResult.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`;
        const downloadResult = await downloadFileToWhatsApp(searchResult.url, filename);

        if (!downloadResult.success) {
            return await m.reply(`❌ Download failed: ${downloadResult.error}`);
        }

        // Send to WhatsApp
        const fileBuffer = fs.readFileSync(downloadResult.path);
        
        await conn.sendMessage(m.chat, {
            video: fileBuffer,
            caption: `🎬 *${searchResult.title}*\n✅ Downloaded from Cinesubz`
        }, { quoted: m });

        // Clean up temp file
        fs.unlinkSync(downloadResult.path);

        return await m.reply('✅ Download complete!');

    } catch (error) {
        return await m.reply(`❌ Error: ${error.message}`);
    }
};

module.exports = {
    getCinesubzDirectDownload,
    downloadFileToWhatsApp,
    cinesubzDirectDownload
};
