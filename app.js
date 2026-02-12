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

// // New endpoint for surah pages
// app.get('/surah/:surahNumber', (req, res) => {
//     const surahNumber = parseInt(req.params.surahNumber);
    
//     // Read the pagesQuran.json file
//     const pagesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'data', 'pagesQuran.json'), 'utf8'));
    
//     // Filter pages that contain the requested surah
//     const surahPages = pagesData.filter(page => 
//         page.start.surah_number === surahNumber || 
//         page.end.surah_number === surahNumber ||
//         (page.start.surah_number <= surahNumber && page.end.surah_number >= surahNumber)
//     );
    
//     // Sort pages by page number
//     surahPages.sort((a, b) => a.page - b.page);
    
//     // Get the Arabic name from the page where the surah starts
//     const startPage = surahPages.find(page => page.start.surah_number === surahNumber);
//     const arabicName = startPage ? startPage.start.name.ar : `السورة ${surahNumber}`;
//     // console.log("🚀 ~ startPage.start.name:", startPage ? startPage.start.name : 'Not found')
//     // console.log("🚀 ~ startPage:", startPage)
    
//     // Create HTML content with the same styling as index.html
//     let htmlContent = `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>${arabicName}</title>
//         <link rel="stylesheet" href="/css/style.css">
//         <link rel="icon" type="image/x-icon" href="/resources/favicon/quran.png">
//         <style>
//             .theme-title {
//                 display: flex;
//                 align-items: center;
//                 justify-content: center; 
//                 gap: 50px; 
//             }
//             .title-nav {
//                 background-color: var(--page-background);
//                 border: rgb(179, 163, 143) solid 2px;
//                 border-radius: 50%;
//                 width: 50px;
//                 height: 50px;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 cursor: pointer;
//                 font-size: 24px;
//                 color: var(--body-background);
//                 text-decoration: none;
//                 transition: all 0.3s ease;
//                 font-weight: bold;
//             }
//             .title-nav:hover {
//                 background-color: var(--body-background);
//                 color: var(--page-background);
//             }
//             .title-nav.disabled {
//                 opacity: 0.3;
//                 cursor: not-allowed;
//                 pointer-events: none;
//             }
//         </style>
//     </head>
//     <body>
//         <h1 class="theme-title">
//             <a href="/surah/${surahNumber - 1}" class="title-nav ${surahNumber <= 1 ? 'disabled' : ''}">‹</a>
//             <div>${arabicName}</div>
//             <a href="/surah/${surahNumber + 1}" class="title-nav ${surahNumber >= 114 ? 'disabled' : ''}">›</a>
//         </h1>        
//         <div class="theme-icons" id='theme-wrapper'>
//             <button class="themes" data-body-background="rgb(32, 21, 11)" data-page-background="rgb(237, 217, 184)"></button>
//             <button class="themes" data-body-background="rgb(14, 16, 39)" data-page-background="rgb(229, 229, 229)"></button>
//             <button class="themes" data-body-background="rgb(146, 108, 71)" data-page-background="rgb(236, 219, 190)"></button>
//         </div>
        
//         <div class="quran-section">
//     `;
    
//     // Add all images for this surah
//     surahPages.forEach(page => {
//         htmlContent += `        <img class="quran-pages" src="${page.image.url}" alt="Page ${page.page}">\n`;
//     });
    
//     htmlContent += `
//             <h1 class="theme-title">
//                 <a href="/surah/${surahNumber - 1}" class="title-nav ${surahNumber <= 1 ? 'disabled' : ''}">‹</a>
//                 <div>${arabicName}</div>
//                 <a href="/surah/${surahNumber + 1}" class="title-nav ${surahNumber >= 114 ? 'disabled' : ''}">›</a>
//             </h1>
//         </div>
//         <script src="/script/index.js"></script>
//     </body>
//     </html>`;
    
//     res.send(htmlContent);
// });

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
            .theme-title {
                display: flex;
                align-items: center;
                justify-content: center; 
                gap: 50px; 
            }
            .title-nav {
                background-color: var(--page-background);
                border: rgb(179, 163, 143) solid 2px;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 24px;
                color: var(--body-background);
                text-decoration: none;
                transition: all 0.3s ease;
                font-weight: bold;
            }
            .title-nav:hover {
                background-color: var(--body-background);
                color: var(--page-background);
            }
            .title-nav.disabled {
                opacity: 0.3;
                cursor: not-allowed;
                pointer-events: none;
            }
        </style>
    </head>
    <body>
        <h1 class="theme-title">
            <a href="/juz/${juzNumber - 1}" class="title-nav ${juzNumber <= 1 ? 'disabled' : ''}">‹</a>
            <div>${arabicName}</div>
            <a href="/juz/${juzNumber + 1}" class="title-nav ${juzNumber >= 30 ? 'disabled' : ''}">›</a>
        </h1>
        <div class="theme-icons" id='theme-wrapper'>
            <button class="themes" data-body-background="rgb(32, 21, 11)" data-page-background="rgb(237, 217, 184)"></button>
            <button class="themes" data-body-background="rgb(14, 16, 39)" data-page-background="rgb(229, 229, 229)"></button>
            <button class="themes" data-body-background="rgb(146, 108, 71)" data-page-background="rgb(236, 219, 190)"></button>
        </div>
        
        <div class="quran-section">
    `;
    
    // Add all images for this juz
    juzPages.forEach(page => {
        htmlContent += `        <img class="quran-pages" src="${page.image.url}" alt="Page ${page.page}">\n`;
    });
    
    htmlContent += `
            <h1 class="theme-title">
                <a href="/juz/${juzNumber - 1}" class="title-nav ${juzNumber <= 1 ? 'disabled' : ''}">‹</a>
                <div>${arabicName}</div>
                <a href="/juz/${juzNumber + 1}" class="title-nav ${juzNumber >= 30 ? 'disabled' : ''}">›</a>
            </h1>
        </div>
        <script src="/script/index.js"></script>
    </body>
    </html>`;
    
    res.send(htmlContent);
});
   
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })