


document.addEventListener('DOMContentLoaded', function() {
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
    const filterIcon = searchToggleBtn.querySelector('.filter-icon');


                searchIcon.style.display = 'block';
                filterIcon.style.display = 'none';


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
                filterIcon.style.display = 'block';
            } else {
                // --- Toggle Filter Options ---
                // (Search is already active, so the button is the filter button)
                filterOptionsContainer.classList.toggle('visible');
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
            filterIcon.style.display = 'none';
        }
        // Close Filter Options if clicking outside of them (but inside the search wrapper)
        else if (filterOptionsContainer && filterOptionsContainer.classList.contains('visible') && !filterOptionsContainer.contains(e.target) && e.target !== searchToggleBtn) {
             filterOptionsContainer.classList.remove('visible');
        }
    });

    // Prevent popups from closing when clicking inside them
    if(searchPopupContainer) {
        searchPopupContainer.addEventListener('click', e => e.stopPropagation());
    }
    if(filterOptionsContainer) {
        filterOptionsContainer.addEventListener('click', e => e.stopPropagation());
    }
});


