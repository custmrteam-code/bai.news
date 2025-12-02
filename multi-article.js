// --- CONFIGURATION ---
const itemsPerPage = 8; 
let currentPage = 1;
let allArticles = []; 
let totalPages = 0;

// --- MAIN APP LOGIC ---
function init() {
    // 1. Check if the data file loaded correctly
    if (typeof articleDatabase === 'undefined') {
        console.error("Error: articleDatabase not found. Make sure data.js is linked BEFORE app.js in your HTML.");
        return;
    }

    // 2. Load data from the external data.js file
    allArticles = articleDatabase;
    
    // 3. Calculate pages
    totalPages = Math.ceil(allArticles.length / itemsPerPage);
    
    // 4. Render
    renderContent();
}

function renderContent() {
    const articlesContainer = document.getElementById('articles-list');
    const pagesContainer = document.getElementById('pages-container');
    const pageIndicator = document.getElementById('page-indicator');
    
    if (!articlesContainer) return;

    // A. Filter articles for current page
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const visibleArticles = allArticles.slice(start, end);

    // B. Generate HTML
    if (visibleArticles.length === 0) {
        articlesContainer.innerHTML = '<p style="text-align:center; color:#888;">No articles found.</p>';
    } else {
        articlesContainer.innerHTML = visibleArticles.map((article, index) => `
            <a class="article-card" href="index.html" data-tags="${article.tags}">
                <h3 class="article-title">${article.title}</h3>
                <p class="date">${article.date}</p>
                <p class="article-summary">${article.summary}</p>
            </a>
            ${index < visibleArticles.length - 1 ? '<hr>' : ''} 
        `).join('');
    }

    // C. Update UI

    //Updating the Title Number
    // if(pageIndicator) pageIndicator.textContent = currentPage;

    //Updating the Bottom Buttons
    if (pagesContainer && totalPages > 0) {
        renderPaginationButtons(pagesContainer);
    }
}

function renderPaginationButtons(container) {
    container.innerHTML = '';

    const createBtn = (text, type, onClick) => {
        const btn = document.createElement(type === 'placeholder' ? 'div' : 'button');
        btn.className = `page-circle ${type}`;
        if (type !== 'placeholder') {
            btn.textContent = text;
            btn.onclick = onClick;
        }
        container.appendChild(btn);
    };

    // Left Slot
    if (currentPage > 1) {
        createBtn(currentPage - 1, 'inactive', () => setPage(currentPage - 1));
    } else {
        createBtn('', 'placeholder', null);
    }

    // Middle Slot (Active)
    createBtn(currentPage, 'active', null);

    // Right Slot
    if (currentPage < totalPages) {
        createBtn(currentPage + 1, 'inactive', () => setPage(currentPage + 1));
    } else {
        createBtn('', 'placeholder', null);
    }
}

function setPage(num) {
    if (num < 1 || num > totalPages) return;
    currentPage = num;
    renderContent();
    const mainArea = document.querySelector('.ma-main');
    if (mainArea) mainArea.scrollIntoView({ behavior: 'smooth' });
}

function changePage(direction) {
    if (direction === 'prev' && currentPage > 1) {
        setPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
        setPage(currentPage + 1);
    }
}

// Start
init();