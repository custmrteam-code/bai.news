


document.addEventListener('DOMContentLoaded', function () {
  // Menu icon
  const btn = document.querySelector('.menu__icon');
  if (btn) {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
    });
  }

  // Search and Filter functionality
  const searchWrapper = document.querySelector('.search-wrapper');
  const searchToggleBtn = document.getElementById('search-toggle-btn');
  const searchPopupContainer = document.getElementById('search-popup-container');
  const filterOptionsContainer = document.getElementById('filter-options-container');
  const searchIcon = searchToggleBtn.querySelector('.search-icon');
  const filterIcon1 = searchToggleBtn.querySelector('.filter-icon1');
  const filterIcon2 = searchToggleBtn.querySelector('.filter-icon2');
  const searchInput = document.getElementById('searchInput');


  searchIcon.style.display = 'block';
  filterIcon1.style.display = 'none';
  filterIcon2.style.display = 'none';

  if (searchToggleBtn) {
    searchToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isSearchActive = searchWrapper.classList.contains('active');

      if (!isSearchActive) {
        // --- Open Search Bar ---
        searchWrapper.classList.add('active');
        searchPopupContainer.classList.add('active');
        // Swap icons
        searchIcon.style.display = 'none';
        filterIcon1.style.display = 'block';
        filterIcon2.style.display = 'none';
      } else {
        // --- Toggle Filter Options ---
        // (Search is already active, so the button is the filter button)
        filterOptionsContainer.classList.toggle('visible');
        searchIcon.style.display = 'none';
        filterIcon1.style.display = 'none';
        filterIcon2.style.display = 'block';

      }
    });
  }

  // --- Global Click Listener to Close Popups ---
  document.addEventListener('click', (e) => {
    // Close Search Bar if clicking outside
    if (searchWrapper && searchWrapper.classList.contains('active') && !searchWrapper.contains(e.target)) {
      searchWrapper.classList.remove('active');
      searchPopupContainer.classList.remove('active');
      filterOptionsContainer.classList.remove('visible'); // Also hide filters
      // Swap icons back
      searchIcon.style.display = 'block';
      filterIcon1.style.display = 'none';
      filterIcon2.style.display = 'none';
    }
    // Close Filter Options if clicking outside of them (but inside the search wrapper)
    else if (filterOptionsContainer && filterOptionsContainer.classList.contains('visible') && !filterOptionsContainer.contains(e.target) && e.target !== searchToggleBtn) {
      filterOptionsContainer.classList.remove('visible');
    }
  });

  // Prevent popups from closing when clicking inside them
  if (searchPopupContainer) {
    searchPopupContainer.addEventListener('click', e => e.stopPropagation());
  }
  if (filterOptionsContainer) {
    filterOptionsContainer.addEventListener('click', e => e.stopPropagation());
  }
});


// ###############################################################

// Function to replace LEFT article content
function replaceLeftArticle(newData) {
  const article = document.querySelector('.Article.LEFT');
  
  if (!article) {
    console.error('Left article not found');
    return;
  }
  
  const img = article.querySelector('.img');
  if (img && newData.image) {
    img.src = newData.image;
    img.alt = newData.imageAlt || 'img';
  }
  
  const heading = article.querySelector('h3');
  if (heading && newData.title) {
    heading.textContent = newData.title;
  }
  
  const date = article.querySelector('.date');
  if (date && newData.date) {
    date.textContent = newData.date;
  }
  
  const description = article.querySelector('.info p:not(.date)');
  if (description && newData.description) {
    description.textContent = newData.description;
  }
}

// Function to replace RIGHT article content
function replaceRightArticle(newData) {
  const article = document.querySelector('.Article.RIGHT');
  
  if (!article) {
    console.error('Right article not found');
    return;
  }
  
  const img = article.querySelector('.img');
  if (img && newData.image) {
    img.src = newData.image;
    img.alt = newData.imageAlt || 'img';
  }
  
  const heading = article.querySelector('h3');
  if (heading && newData.title) {
    heading.textContent = newData.title;
  }
  
  const date = article.querySelector('.date');
  if (date && newData.date) {
    date.textContent = newData.date;
  }
  
  const description = article.querySelector('.info p:not(.date)');
  if (description && newData.description) {
    description.textContent = newData.description;
  }
}

// Function to parse CSV - handles the exact format from your file
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const data = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Split only first 3 commas for image,date,title then rest is description
    const parts = [];
    let currentPart = '';
    let commaCount = 0;
    
    for (let j = 0; j < line.length; j++) {
      if (line[j] === ',' && commaCount < 3) {
        parts.push(currentPart.trim());
        currentPart = '';
        commaCount++;
      } else {
        currentPart += line[j];
      }
    }
    // Add the last part (description)
    parts.push(currentPart.trim());
    
    if (parts.length >= 4) {
      const row = {
        image: parts[0],
        date: parts[1],
        title: parts[2],
        description: parts[3]
      };
      data.push(row);
    }
  }
  
  return data;
}

// Main function to load CSV and update articles
async function updateArticlesFromCSV() {
  try {
    const response = await fetch('Article/feature.csv');
    const csvText = await response.text();
    const data = parseCSV(csvText);
    
    if (data.length < 2) {
      console.error('CSV must contain at least 2 data rows');
      return;
    }
    
    // Get last two rows
    const lastRow = data[data.length - 1];
    const secondLastRow = data[data.length - 2];
    
    // Update LEFT article with last row
    replaceLeftArticle({
      image: lastRow.image,
      title: lastRow.title.toUpperCase(),
      date: lastRow.date,
      description: lastRow.description
    });
    
    // Update RIGHT article with second last row
    replaceRightArticle({
      image: secondLastRow.image,
      title: secondLastRow.title.toUpperCase(),
      date: secondLastRow.date,
      description: secondLastRow.description
    });
    
    console.log('Articles updated successfully!');
  } catch (error) {
    console.error('Error loading CSV:', error);
  }
}

// Call the function when page loads
document.addEventListener('DOMContentLoaded', updateArticlesFromCSV);









// ==============================================

document.addEventListener('DOMContentLoaded', () => {
    
    const searchInput = document.getElementById('searchInput');
    const filterCheckboxes = document.querySelectorAll('input[name="filter-tags"]');
    // We select the article cards specifically
    const articles = document.querySelectorAll('.article-card');

    // ========== SEARCH LISTENER ==========
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            filterContent(searchTerm, getSelectedFilters());
        });
    }

    // ========== FILTER LISTENER ==========
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
            filterContent(searchTerm, getSelectedFilters());
        });
    });

    // ========== HELPER: GET CHECKED BOXES ==========
    function getSelectedFilters() {
        const selected = [];
        filterCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selected.push(checkbox.value);
            }
        });
        return selected;
    }

    // ========== CORE LOGIC ==========
    function filterContent(searchTerm, selectedFilters) {
        articles.forEach(article => {
            // Get tags from the new data-tags attribute
            const tags = article.getAttribute('data-tags') || '';
            // Get text from title and summary
            const text = article.textContent.toLowerCase();
            
            // Logic: Does it match the search text?
            const matchesSearch = !searchTerm || text.includes(searchTerm);
            
            // Logic: Does it match the selected checkboxes?
            // If no filters selected, show all. Otherwise, check if tags match.
            const matchesFilter = selectedFilters.length === 0 || 
                                selectedFilters.some(filter => tags.includes(filter));
            
            // Toggle visibility
            if (matchesSearch && matchesFilter) {
                article.classList.remove('hidden');
                // Handle the HR line if it immediately follows the article
                if(article.nextElementSibling && article.nextElementSibling.tagName === 'HR') {
                    article.nextElementSibling.style.display = ''; 
                }
            } else {
                article.classList.add('hidden');
                // Hide the HR line as well so we don't get double lines
                if(article.nextElementSibling && article.nextElementSibling.tagName === 'HR') {
                    article.nextElementSibling.style.display = 'none';
                }
            }
        });
    }

});