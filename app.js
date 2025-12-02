

// JS for Hamburger menu icon
document.addEventListener('DOMContentLoaded', function () {
  // Menu icon
  const btn = document.querySelector('.menu__icon');
  if (btn) {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
    });
  }





  // ============= Search and Filter toggling ==============

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


// ====================== SEARCH AND FILTER FUNCTIONALITY ========================
// remember to add data tags and value to new filter tags
// also add classname article-card to articles which you want to filter & search

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







// =========-------- SHARE ICON ----------===========
// =====------- IMAGE CHANGE --------====
const shareLink = document.querySelector('a:has(.s-icon1)');
const shareIcon = shareLink.querySelector('.s-icon1');

// Define the paths to your images for clarity and easy changing
const unfilledIconPath = "./assets/share icon unfilled.png";
const filledIconPath = "./assets/share icon filled.png";

if (shareLink && shareIcon) {
    shareLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent page jump from href="#"

        // 2. Check the current source to decide which one to swap to
        // We use .includes() because the browser might expand the src to a full absolute URL.
        if (shareIcon.src.includes("unfilled")) {
            // If it's currently unfilled, change it to filled
            shareIcon.src = filledIconPath;
        } else {
            // If it's currently filled, toggle it back to unfilled
            shareIcon.src = unfilledIconPath;
        }
    });
} else {
    console.error("Could not find the share link or icon. Check your HTML classes and image paths.");
}

// ====-------- SHARE ICON FUNCTIONALITY ----------====
// Select the share button (parent <a> tag of the icon)
const shareIcon2 = document.querySelector('.s-icon1').parentElement;

shareIcon2.addEventListener('click', async (e) => {
  e.preventDefault(); // Stop the link from refreshing/jumping the page

  // Get article details (Fallback to page title if ID not found)
  const articleTitle = document.querySelector('#news-headline')?.textContent || document.title;
  const articleUrl = window.location.href;

  // Check if browser supports native sharing
  if (navigator.share) {
    try {
      // Trigger the native share menu (waits for user input)
      await navigator.share({
        title: articleTitle,
        text: `${articleTitle}\n\nRead more here:`, // Combine title + text for better app support
        url: articleUrl
      });
      console.log('Shared successfully');
    } catch (error) {
      // Ignore errors if the user simply closes the share menu
      if (error.name !== 'AbortError') console.error('Error sharing:', error);
    }
  } else {
    // Fallback for desktop/unsupported browsers
    alert('Share not supported');
  }
});