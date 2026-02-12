const express = require('express');
const path = require('path')
const fs = require('fs')
require('dotenv').config()
const app = express();
const root = path.join(__dirname);
const port = process.env.PORT||4150 

// middleware
const visitCountMiddleware = require('./middleware/visitCountMiddleware');

// !important 
app.use(express.static('data'));
app.use(express.static('public/data'));
app.use(express.static('public'));

// built in middleware to handle urlencoded from data
app.use(express.urlencoded({ extended: true }))

// built in middleware for json
app.use(express.json());

app.use(visitCountMiddleware);
app.get('/', (req, res) => {
    res.sendFile(path.join('public', 'views', 'index.html'), { root: root })
  })

// New endpoint for surah pages
app.get('/surah/:surahNumber', (req, res) => {
    const surahNumber = parseInt(req.params.surahNumber);
    
    // Read the pagesQuran.json file
    const pagesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'data', 'pagesQuran.json'), 'utf8'));
    
    // Filter pages that contain the requested surah
    const surahPages = pagesData.filter(page => 
        page.start.surah_number === surahNumber || 
        page.end.surah_number === surahNumber ||
        (page.start.surah_number <= surahNumber && page.end.surah_number >= surahNumber)
    );
    
    // Sort pages by page number
    surahPages.sort((a, b) => a.page - b.page);
    
    // Get the Arabic name from the page where the surah starts
    const startPage = surahPages.find(page => page.start.surah_number === surahNumber);
    const arabicName = startPage ? startPage.start.name.ar : `Surah ${surahNumber}`;
    // console.log("🚀 ~ startPage.start.name:", startPage ? startPage.start.name : 'Not found')
    // console.log("🚀 ~ startPage:", startPage)
    
    // Create HTML content with the same styling as index.html
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${arabicName}</title>
        <link rel="stylesheet" href="/css/style.css">
        <link rel="icon" type="image/x-icon" href="/resources/favicon/quran.png">
        <style>
            .navigation {
                position: fixed;
                top: 50%;
                transform: translateY(-50%);
                background-color: var(--page-background);
                border: rgb(179, 163, 143) solid 2px;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 20px;
                color: var(--body-background);
                text-decoration: none;
                transition: all 0.3s ease;
                z-index: 1000;
            }
            .navigation:hover {
                background-color: var(--body-background);
                color: var(--page-background);
            }
            .nav-prev {
                left: 20px;
            }
            .nav-next {
                right: 20px;
            }
            .navigation.disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }
            .navigation.disabled:hover {
                background-color: var(--page-background);
                color: var(--body-background);
            }
        </style>
    </head>
    <body>
        <h1 class="theme-title">${arabicName}</h1>
        <div class="theme-icons" id='theme-wrapper'>
            <button class="themes" data-body-background="rgb(32, 21, 11)" data-page-background="rgb(237, 217, 184)"></button>
            <button class="themes" data-body-background="rgb(14, 16, 39)" data-page-background="rgb(229, 229, 229)"></button>
            <button class="themes" data-body-background="rgb(146, 108, 71)" data-page-background="rgb(236, 219, 190)"></button>
        </div>
        
        <!-- Navigation arrows -->
        <a href="/surah/${surahNumber - 1}" class="navigation nav-prev ${surahNumber <= 1 ? 'disabled' : ''}" ${surahNumber <= 1 ? 'onclick="return false;"' : ''}>‹</a>
        <a href="/surah/${surahNumber + 1}" class="navigation nav-next ${surahNumber >= 114 ? 'disabled' : ''}" ${surahNumber >= 114 ? 'onclick="return false;"' : ''}>›</a>
        
        <div class="quran-section">
    `;
    
    // Add all images for this surah
    surahPages.forEach(page => {
        htmlContent += `        <img class="quran-pages" src="${page.image.url}" alt="Page ${page.page}">\n`;
    });
    
    htmlContent += `
        </div>
        <script src="/script/index.js"></script>
    </body>
    </html>`;
    
    res.send(htmlContent);
});

// New endpoint for juz pages
app.get('/juz/:juzNumber', (req, res) => {
    const juzNumber = parseInt(req.params.juzNumber);
    
    // Read the pagesQuran.json file
    const pagesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'data', 'pagesQuran.json'), 'utf8'));
    
    // Filter pages that contain the requested juz
    const juzPages = pagesData.filter(page => page.juz === juzNumber);
    
    // Sort pages by page number
    juzPages.sort((a, b) => a.page - b.page);
    
    // Get the Arabic name from the first page
    const arabicName = juzPages.length > 0 ? `الجزء ${juzNumber}` : `Juz ${juzNumber}`;
    
    // Create HTML content with the same styling as index.html
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${arabicName}</title>
        <link rel="stylesheet" href="/css/style.css">
        <link rel="icon" type="image/x-icon" href="/resources/favicon/quran.png">
        <style>
            .navigation {
                position: fixed;
                top: 50%;
                transform: translateY(-50%);
                background-color: var(--page-background);
                border: rgb(179, 163, 143) solid 2px;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 20px;
                color: var(--body-background);
                text-decoration: none;
                transition: all 0.3s ease;
                z-index: 1000;
            }
            .navigation:hover {
                background-color: var(--body-background);
                color: var(--page-background);
            }
            .nav-prev {
                left: 20px;
            }
            .nav-next {
                right: 20px;
            }
            .navigation.disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }
            .navigation.disabled:hover {
                background-color: var(--page-background);
                color: var(--body-background);
            }
        </style>
    </head>
    <body>
        <h1 class="theme-title">${arabicName}</h1>
        <div class="theme-icons" id='theme-wrapper'>
            <button class="themes" data-body-background="rgb(32, 21, 11)" data-page-background="rgb(237, 217, 184)"></button>
            <button class="themes" data-body-background="rgb(14, 16, 39)" data-page-background="rgb(229, 229, 229)"></button>
            <button class="themes" data-body-background="rgb(146, 108, 71)" data-page-background="rgb(236, 219, 190)"></button>
        </div>
        
        <!-- Navigation arrows -->
        <a href="/juz/${juzNumber - 1}" class="navigation nav-prev ${juzNumber <= 1 ? 'disabled' : ''}" ${juzNumber <= 1 ? 'onclick="return false;"' : ''}>‹</a>
        <a href="/juz/${juzNumber + 1}" class="navigation nav-next ${juzNumber >= 30 ? 'disabled' : ''}" ${juzNumber >= 30 ? 'onclick="return false;"' : ''}>›</a>
        
        <div class="quran-section">
    `;
    
    // Add all images for this juz
    juzPages.forEach(page => {
        htmlContent += `        <img class="quran-pages" src="${page.image.url}" alt="Page ${page.page}">\n`;
    });
    
    htmlContent += `
        </div>
        <script src="/script/index.js"></script>
    </body>
    </html>`;
    
    res.send(htmlContent);
});
   
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })