// ==========================================
// 0. FIREBASE CONFIGURATION & IMPORTS
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, TwitterAuthProvider, signInWithPopup, onAuthStateChanged, signOut, signInAnonymously, updateProfile} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_Q3p2dyKwUOUv5O-gIMNI8vv6RrD0IZY",
  authDomain: "bai-news-9e4cf.firebaseapp.com",
  projectId: "bai-news-9e4cf",
  storageBucket: "bai-news-9e4cf.firebasestorage.app",
  messagingSenderId: "1056453543830",
  appId: "1:1056453543830:web:c40a8c1e5bb582f2c63fb7"
};

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();

// ==========================================
// AUTH LOGIC (Login & UI Updates)
// ==========================================

// 1. LISTEN FOR CLICKS (Event Delegation)
// We do this because 'google-login-btn' doesn't exist when page loads
document.addEventListener('click', (e) => {
    // Check if user clicked the Google Button
    if (e.target.closest('#google-login-btn')) {
        handleGoogleLogin();
    }
});

// 2. THE LOGIN FUNCTION
function handleGoogleLogin() {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log("Login Success:", user.displayName);
            
            // A. Close the Popup
            const overlay = document.getElementById('popupOverlay');
            if(overlay) overlay.classList.remove('active');

            // B. Update the UI immediately (Turn button black)
            updateUIForUser(user);
            
            // Note: We DO NOT use window.location.href here. 
            // We want to stay on the page and show the user they are subscribed.
        })
        .catch((error) => {
            console.error("Error:", error.message);
            alert("Login Failed: " + error.message);
        });
}

    // for TWITTER
    function handleTwitterLogin() {
        signInWithPopup(auth, twitterProvider)
            .then((result) => {
                const user = result.user;
                console.log("Twitter Login Success:", user.displayName);
                
                // 1. Close Popup
                const overlay = document.getElementById('popupOverlay');
                if(overlay) overlay.classList.remove('active');

                // 2. LocalStorage handles the UI automatically via onAuthStateChanged
                // (But you can force an update here if you want extra speed)
            })
            .catch((error) => {
                console.error("Twitter Login Error:", error);
                alert("Twitter Login Failed: " + error.message);
            });
    }

    document.addEventListener('click', (e) => {
        // Google
        if (e.target.closest('#google-login-btn')) {
            handleGoogleLogin();
        }
        // Twitter / X
        if (e.target.closest('#twitter-login-btn')) {
            handleTwitterLogin();
        }
    });

// 3. CHECK LOGIN STATE (Runs on page load)
onAuthStateChanged(auth, (user) => {
    const subscribeBtn = document.getElementById('openPopupBtn');
    
    if (user) {
        // User is logged in -> Set Black Button
        updateUIForUser(user);
    } else {
        // User is logged out -> Set Red Button
        resetUI();
    }

    // FIX: Now that the correct color is set, REVEAL the button
    if (subscribeBtn) {
        subscribeBtn.classList.add('auth-ready');
    }
});

// 4. FUNCTION TO UPDATE THE BUTTON (Red -> Black)
function updateUIForUser(user) {
    const subscribeBtn = document.getElementById('openPopupBtn');
    if (subscribeBtn) {
        // Change Styles to Black
        subscribeBtn.style.backgroundColor = "#000"; 
        subscribeBtn.style.color = "#fff";
        
        // Change Text
        // We use innerHTML to keep the styling, or just text
        subscribeBtn.innerHTML = '<span class="text">Subscribed</span>';
        
        // Optional: Disable click so popup doesn't open again
        subscribeBtn.style.pointerEvents = "none";
    }
}

function resetUI() {
    const subscribeBtn = document.getElementById('openPopupBtn');
    if (subscribeBtn) {
        subscribeBtn.style.backgroundColor = ""; // Revert to CSS default (Red)
        subscribeBtn.style.color = ""; 
        subscribeBtn.innerHTML = '<span class="text">Subscribe</span> <span class="icon"><svg viewBox="0 0 448 512" class="bell"><path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path></svg></span>';
        subscribeBtn.style.pointerEvents = "auto";
    }
}




// ==========================================
// 1. HAMBURGER MENU LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    const btn = document.querySelector('.menu__icon');
    if (btn) {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
        });
    }
});

// ==========================================
// 2. SEARCH AND FILTER TOGGLE LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Select Elements
    const searchWrapper = document.querySelector('.search-wrapper');
    const searchToggleBtn = document.getElementById('search-toggle-btn');
    const searchPopupContainer = document.getElementById('search-popup-container');
    const filterOptionsContainer = document.getElementById('filter-options-container');

    // Select Icons
    // We use optional chaining (?.) or checks inside the function to prevent crashes
    if (!searchToggleBtn) return; // Stop if button doesn't exist

    const imgSearch = searchToggleBtn.querySelector('.search-icon');
    const imgFilterEmpty = searchToggleBtn.querySelector('.filter-icon1');
    const imgFilterFilled = searchToggleBtn.querySelector('.filter-icon2');

    let clickCount = 0;

    // Helper to swap images safely
    function updateImages(showImage) {
        if (imgSearch) imgSearch.style.display = 'none';
        if (imgFilterEmpty) imgFilterEmpty.style.display = 'none';
        if (imgFilterFilled) imgFilterFilled.style.display = 'none';

        if (showImage === 1 && imgSearch) imgSearch.style.display = 'block';
        if (showImage === 2 && imgFilterEmpty) imgFilterEmpty.style.display = 'block';
        if (showImage === 3 && imgFilterFilled) imgFilterFilled.style.display = 'block';
    }

    // Set initial state
    updateImages(1);

    searchToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        clickCount++;

        // --- CLICK 1 (Start Search) ---
        if (clickCount === 1) {
            searchWrapper.classList.add('active');
            searchPopupContainer.classList.add('active');
            filterOptionsContainer.classList.remove('visible');
            updateImages(2);
        }
        // --- LOOPING CLICKS (2, 3...) ---
        else {
            if (clickCount % 2 === 0) {
                // Even: Open Filter
                filterOptionsContainer.classList.add('visible');
                updateImages(3);
            } else {
                // Odd: Close Filter
                filterOptionsContainer.classList.remove('visible');
                updateImages(2);
            }
        }
    });

    // --- CLICK OUTSIDE LOGIC ---
    document.addEventListener('click', (e) => {
        if (!searchWrapper || !searchWrapper.classList.contains('active')) return;

        // 1. Clicked Completely Outside
        if (!searchWrapper.contains(e.target)) {
            searchWrapper.classList.remove('active');
            searchPopupContainer.classList.remove('active');
            filterOptionsContainer.classList.remove('visible');
            clickCount = 0;
            updateImages(1);
        }
        // 2. Clicked Inside Search but Outside Filter
        else if (!filterOptionsContainer.contains(e.target) && e.target !== searchToggleBtn) {
            if (filterOptionsContainer.classList.contains('visible')) {
                filterOptionsContainer.classList.remove('visible');
                clickCount = 1;
                updateImages(2);
            }
        }
    });

    // Prevent closing when clicking inside
    if (searchPopupContainer) searchPopupContainer.addEventListener('click', e => e.stopPropagation());
    if (filterOptionsContainer) filterOptionsContainer.addEventListener('click', e => e.stopPropagation());
});

// ==========================================
// 3. SEARCH INPUT FILTERING LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const filterCheckboxes = document.querySelectorAll('input[name="filter-tags"]');
    const articles = document.querySelectorAll('.article-card');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            filterContent(searchTerm, getSelectedFilters());
        });
    }

    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
            filterContent(searchTerm, getSelectedFilters());
        });
    });

    function getSelectedFilters() {
        const selected = [];
        filterCheckboxes.forEach(checkbox => {
            if (checkbox.checked) selected.push(checkbox.value);
        });
        return selected;
    }

    function filterContent(searchTerm, selectedFilters) {
        articles.forEach(article => {
            const tags = article.getAttribute('data-tags') || '';
            const text = article.textContent.toLowerCase();
            const matchesSearch = !searchTerm || text.includes(searchTerm);
            const matchesFilter = selectedFilters.length === 0 || selectedFilters.some(filter => tags.includes(filter));

            if (matchesSearch && matchesFilter) {
                article.classList.remove('hidden');
                if (article.nextElementSibling && article.nextElementSibling.tagName === 'HR') {
                    article.nextElementSibling.style.display = '';
                }
            } else {
                article.classList.add('hidden');
                if (article.nextElementSibling && article.nextElementSibling.tagName === 'HR') {
                    article.nextElementSibling.style.display = 'none';
                }
            }
        });
    }
});

// ==========================================
// 4. SHARE ICON LOGIC (Safeguarded)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // We verify the element exists BEFORE trying to use it
    const shareLink = document.querySelector('a:has(.s-icon1)');
    const shareIcon = shareLink ? shareLink.querySelector('.s-icon1') : null;

    if (shareLink && shareIcon) {
        const unfilledIconPath = "../assets/share icon unfilled.png";
        const filledIconPath = "../assets/share icon filled.png";

        shareLink.addEventListener('click', function (event) {
            event.preventDefault();
            if (shareIcon.src.includes("unfilled")) {
                shareIcon.src = filledIconPath;
            } else {
                shareIcon.src = unfilledIconPath;
            }
        });

        document.addEventListener('click', function (event) {
            if (!shareLink.contains(event.target)) {
                if (shareIcon.src.includes("filled")) {
                    shareIcon.src = unfilledIconPath;
                }
            }
        });
    }
});

// ==========================================
// 5. SHARE FUNCTIONALITY (Safeguarded)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const shareIconEl = document.querySelector('.s-icon1');
    
    // SAFETY CHECK: Only run if icon exists
    if (shareIconEl) {
        const shareBtnParent = shareIconEl.parentElement;
        
        shareBtnParent.addEventListener('click', async (e) => {
            e.preventDefault();
            const articleTitle = document.querySelector('#news-headline')?.textContent || document.title;
            const articleUrl = window.location.href;

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: articleTitle,
                        text: `${articleTitle}\n\nRead more here:`,
                        url: articleUrl
                    });
                } catch (error) {
                    if (error.name !== 'AbortError') console.error('Error sharing:', error);
                }
            } else {
                alert('Share not supported');
            }
        });
    }
});












// ==========================================
// 1. MASTER LAYOUT LOADER (Executes First)
// ==========================================
async function loadLayout() {
    try {
        // Fetch the common layout file
        const response = await fetch('../layout/layout.html');
        if (!response.ok) throw new Error('Could not load layout.html');
        
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // A. Inject Header (Top of page)
        const headerContent = doc.getElementById('source-header').innerHTML;
        document.getElementById('global-header').innerHTML = headerContent;

        // B. Inject Footer (Bottom of page)
        const footerContent = doc.getElementById('source-footer').innerHTML;
        document.getElementById('global-footer').innerHTML = footerContent;

        // C. Inject Popup (Append to bottom of body)
        const popupContent = doc.getElementById('source-popup').innerHTML;
        document.body.insertAdjacentHTML('beforeend', popupContent);

        // D. START LOGIC (Now that elements exist)
        initGlobalLogic();

    } catch (error) {
        console.error('Error loading layout:', error);
    }
}

// ==========================================
// 2. GLOBAL INIT (The Coordinator)
// ==========================================
function initGlobalLogic() {
    // 1. Initialize the Popup Logic
    initPopupLogic();

    // 2. Highlight the active page link in Sidebar
    const currentPage = window.location.pathname.split("/").pop() || 'index.html';
    const menuLinks = document.querySelectorAll('.menu-item');
    menuLinks.forEach(link => {
        if (link.getAttribute('href').split('/').pop() === currentPage) {
            link.classList.add('active-page');
        }
    });
}

// ==========================================
// 3. DETAILED POPUP LOGIC
// ==========================================
function initPopupLogic() {

    // --- A. VARIABLES & ELEMENTS ---
    const closeBtn = document.getElementById('closePopupBtn');
    const overlay = document.getElementById('popupOverlay');

    const viewOptions = document.getElementById('view-options');
    const viewEmail = document.getElementById('view-email');
    const viewOtp = document.getElementById('view-otp');

    const btnToEmail = document.getElementById('btn-to-email');
    const btnBack = document.getElementById('btn-back'); 
    const formEmail = document.getElementById('form-email');
    const inputEmail = document.getElementById('email-input');
    const displayEmail = document.getElementById('display-email');
    
    const otpInputs = document.querySelectorAll('.otp-digit');
    const otpToast = document.getElementById('otp-toast');
    const resendWrapper = document.querySelector('.resend-wrapper');
    const resendTimerDisplay = document.getElementById('resend-timer');
    const resendText = document.getElementById('resend-text');

    let timerInterval = null;

    // --- B. HELPER: RESET STATE ---
    function resetPopupState() {
        if (!overlay) return;
        
        overlay.classList.remove('active');
        
        // Reset Views
        if(viewOptions) viewOptions.classList.remove('hidden');
        if(viewEmail) viewEmail.classList.add('hidden');
        if(viewOtp) viewOtp.classList.add('hidden');

        // Clear Inputs
        if(inputEmail) inputEmail.value = "";
        otpInputs.forEach(input => input.value = "");

        // Reset Timer
        if (timerInterval) clearInterval(timerInterval);
    }

    // --- C. OPEN POPUP (Event Delegation) ---
    // This makes sure the button works even though it was injected via JS
    document.addEventListener('click', (e) => {
        // Check if the clicked element is (or is inside) the Open Button
        if (e.target.closest('#openPopupBtn')) {
            resetPopupState(); // Clean slate
            if (overlay) overlay.classList.add('active');
            if (viewOptions) viewOptions.classList.remove('hidden');
        }
    });

    // --- D. CLOSE HANDLERS ---
    if (closeBtn) closeBtn.addEventListener('click', resetPopupState);
    
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) resetPopupState();
        });
    }

    // --- E. NAVIGATION HANDLERS ---
    if (btnToEmail) {
        btnToEmail.addEventListener('click', () => {
            viewOptions.classList.add('hidden');
            viewEmail.classList.remove('hidden');
            if(inputEmail) inputEmail.focus();
        });
    }

    if (btnBack) {
        btnBack.addEventListener('click', () => {
            viewEmail.classList.add('hidden');
            viewOptions.classList.remove('hidden');
        });
    }

    // --- F. TIMER FUNCTION ---
    function startOtpTimer() {
        let timeLeft = 30;
        
        // Reset Timer UI
        if(resendWrapper) resendWrapper.classList.remove('resend-active');
        if(resendText) resendText.textContent = "resend ";
        if(resendTimerDisplay) {
            resendTimerDisplay.style.display = "inline";
            resendTimerDisplay.textContent = "00 : 30";
        }
        
        if (timerInterval) clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            timeLeft--;
            const seconds = timeLeft < 10 ? `0${timeLeft}` : timeLeft;
            if(resendTimerDisplay) resendTimerDisplay.textContent = `00 : ${seconds}`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                if(resendTimerDisplay) resendTimerDisplay.style.display = "none";
                if(resendText) resendText.textContent = "resend";
                if(resendWrapper) resendWrapper.classList.add('resend-active');
            }
        }, 1000);
    }

    // --- G. SUBMIT EMAIL -> SHOW OTP ---
    if (formEmail) {
        formEmail.addEventListener('submit', (e) => {
            e.preventDefault();
            if (inputEmail && inputEmail.value.trim() !== "") {
                // Update Display Email
                if(displayEmail) displayEmail.textContent = inputEmail.value;
                
                // Switch Views
                viewEmail.classList.add('hidden');
                viewOtp.classList.remove('hidden');
                
                // Focus & Start Timer
                if(otpInputs[0]) otpInputs[0].focus();
                startOtpTimer();
            }
        });
    }

    // --- H. RESEND CLICK ---
    if (resendWrapper) {
        resendWrapper.addEventListener('click', () => {
            if (resendWrapper.classList.contains('resend-active')) {
                // Show Toast
                if(otpToast) {
                    otpToast.classList.add('show');
                    setTimeout(() => otpToast.classList.remove('show'), 2000);
                }
                // Restart Timer
                startOtpTimer();
            }
        });
    }

    // --- I. OTP INPUT LOGIC ---
    otpInputs.forEach((input, index) => {
        // Typing
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Numbers only
            if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        // Backspace
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });

    // --- J. EDIT EMAIL (Back to View 2) ---
    if (displayEmail) {
        displayEmail.addEventListener('click', () => {
            viewOtp.classList.add('hidden');
            viewEmail.classList.remove('hidden');
            
            // Clear timer and inputs
            if (timerInterval) clearInterval(timerInterval);
            otpInputs.forEach(input => input.value = "");
            if(inputEmail) inputEmail.focus();
        });
    }

    // ==========================================
    // GOOGLE APPS SCRIPT AUTH LOGIC
    // ==========================================

    // 1. CONFIGURATION
    // PASTE YOUR GOOGLE SCRIPT URL HERE
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwZ5TN8yWPNlKnqWIwZY1EETxkp8X_MtHKanSD9m5KtexX23zTFlH-Hs9M_RUz03Oq0-w/exec"; 

    let generatedOTP = null; // To store the code we sent

    // 2. SEND OTP FUNCTION
    function sendOTP(email) {
        // A. Generate a random 6-digit number
        generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("Dev Check (Code):", generatedOTP); // For testing

        // B. Show user we are working
        const toast = document.getElementById('otp-toast'); // Ensure you have this HTML element
        if(toast) { 
            toast.textContent = "Sending Code..."; 
            toast.classList.add('show'); 
        }

        // C. Send to Google
        fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            // We send it as text/plain to avoid CORS "preflight" issues with Google
            body: JSON.stringify({ email: email, otp: generatedOTP }),
        })
        .then(response => response.text()) // Read response as text
        .then(result => {
            console.log("Google Response:", result);
            
            // Update UI
            if(toast) { 
                toast.textContent = "Code Sent!"; 
                setTimeout(() => toast.classList.remove('show'), 3000);
            }
        })
        .catch(error => {
            console.error("Error sending email:", error);
            alert("Could not send email. Check console.");
        });
    }

    // 3. VERIFY OTP FUNCTION
    function verifyOTP() {
        // 1. Get the numbers from boxes
        let enteredCode = "";
        const inputs = document.querySelectorAll('.otp-digit');
        inputs.forEach(input => enteredCode += input.value);

        console.log("Checking:", enteredCode, "vs", generatedOTP); 

        // 2. Check Match
        if (enteredCode === generatedOTP) {
            
            // 3. Authenticate (MODULAR SYNTAX FIX)
            signInAnonymously(auth)
                .then((result) => {
                    // A. Get Email for Name
                    const userEmail = document.getElementById('email-input').value;
                    const derivedName = userEmail.split('@')[0];

                    // B. Update Profile (MODULAR SYNTAX FIX)
                    updateProfile(result.user, { 
                        displayName: derivedName 
                    }).then(() => {
                        
                        // C. UPDATE UI
                        // (Ensure this function is available globally)
                        if (typeof updateUIForUser === "function") {
                            updateUIForUser(result.user);
                        }
                        
                        // D. CLOSE POPUP
                        // Use resetPopupState since closePopup isn't defined in your code
                        resetPopupState(); 
                        
                        alert("Account Created Successfully!"); 
                    });
                })
                .catch((error) => {
                    console.error("Firebase Auth Error:", error);
                    alert("Login failed: " + error.message);
                });

        } else {
            alert("Incorrect Code. Please try again.");
            // Optional: Clear inputs on fail
            inputs.forEach(input => input.value = "");
        }
    }

    // ==========================================
    // Connect the Buttons
    // ==========================================


    // A. When user submits the Email Form

    if (formEmail) {
        formEmail.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = inputEmail.value.trim();
            
            if (email) {
                // 1. Switch View (Hide Email Form, Show OTP Form)
                document.getElementById('view-email').classList.add('hidden');
                document.getElementById('view-otp').classList.remove('hidden');
                
                // 2. Send the Code!
                sendOTP(email);
                
                // 3. Start Timer (Optional)
                startOtpTimer(); 
            }
        });
    }

    // B. When user types in OTP boxes (Auto-Verify)
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            // Auto-focus next box
            if (input.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
            
            // Check if all filled -> Verify automatically
            // We delay slightly to let the last number appear
            if (index === 5 && input.value !== "") {
                setTimeout(verifyOTP, 100); 
            }
        });
    });

    // ==========================================
    // FIX: LISTEN FOR CLICKS ON THE "CREATE" BUTTON
    // ==========================================
    document.addEventListener('click', (e) => {
        // Check if the thing clicked is the verify button (or inside it)
        if (e.target.closest('#btn-verify-otp')) {
            e.preventDefault(); // Stop page reload
            
            console.log("Create Button Clicked! (Via Delegation)");
            
            // Run the verification function
            verifyOTP();
        }
    });
}

// ==========================================
// 4. EXECUTE ON PAGE LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', loadLayout);