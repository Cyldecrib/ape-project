console.log("Systems online. $Ape protocol initiated.");

// --- PopCat-like APE Button Functionality (Server-Side Counter) ---
document.addEventListener('DOMContentLoaded', function() {
    // Element Selections
    const apeButton = document.getElementById('apeButton');
    const apeImage = document.getElementById('apeImage');
    const clickCountElement = document.getElementById('clickCount');
    const totalApesElement = document.getElementById('totalApes');
    const bananaContainer = document.getElementById('bananaContainer');
    const popupOverlay = document.getElementById('popupOverlay');
    const closePopupButton = document.getElementById('closePopupButton');

    // --- Popup Logic ---
    // Show the popup after a 2-second delay
    setTimeout(() => {
        if (popupOverlay) popupOverlay.style.display = 'flex';
    }, 2000);

    function hidePopup() {
        if (popupOverlay) popupOverlay.style.display = 'none';
    }

    // Event listeners to close the popup
    if (closePopupButton) closePopupButton.addEventListener('click', hidePopup);
    if (popupOverlay) popupOverlay.addEventListener('click', function(e) {
        // Only close if the overlay itself is clicked, not the box
        if (e.target === popupOverlay) {
            hidePopup();
        }
    });


    // --- Server Communication ---
    function loadInitialCount() {
        fetch('/api/count')
            .then(response => response.json())
            .then(data => {
                totalApesElement.textContent = data.totalApes;
            })
            .catch(error => console.error('Error fetching initial count:', error));
    }

    loadInitialCount(); // Load the global count on page start

    // --- Main Click Handler ---
    function handleClick() {
        fetch('/api/increment', {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                totalApesElement.textContent = data.totalApes;
                totalApesElement.classList.add('pop-animation');
            })
            .catch(error => console.error('Error incrementing count:', error));

        // UI feedback
        apeImage.src = 'pressed.svg';
        apeImage.classList.add('pop-animation');
        clickCountElement.textContent = "YOU APED IN!";

        setTimeout(function() {
            apeImage.src = 'pressed.svg';
            apeImage.classList.remove('pop-animation');
            totalApesElement.classList.remove('pop-animation');
        }, 150);
    }

    // --- Banana Logic ---
    function createBanana() { /* ... function remains the same ... */ }
    function collectBanana(banana) { /* ... function remains the same ... */ }
    function startBananaRain() { /* ... function remains the same ... */ }
    
    // --- Event Listeners ---
    apeButton.addEventListener('click', handleClick);

    // **FIXED:** Keyboard press event now ONLY listens for Ctrl+A
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && (event.key === 'a' || event.key === 'A')) {
            event.preventDefault();
            handleClick();
            startBananaRain();
        }
    });

    // **FIXED:** Touch event now prevents a follow-up click
    apeButton.addEventListener('touchstart', function(event) {
        event.preventDefault(); // Prevents the browser from firing a 'click' event
        handleClick();
        startBananaRain();
    });

    // --- (The rest of the unchanged functions and listeners) ---
    // Note: I've omitted the full banana functions for brevity,
    // but you should keep them in your actual file.
    function createBanana() {
        if (!bananaContainer) return;
        const banana = document.createElement('img');
        banana.src = 'banana.svg';
        banana.className = 'banana banana-fall';
        banana.style.left = Math.random() * 100 + '%';
        banana.style.animationDuration = (2 + Math.random() * 2) + 's';
        bananaContainer.appendChild(banana);
        banana.addEventListener('click', function() {
            collectBanana(banana);
        });
        banana.addEventListener('animationend', function() {
            if (bananaContainer && bananaContainer.contains(banana)) {
                bananaContainer.removeChild(banana);
            }
        });
    }

    function collectBanana(banana) {
        banana.classList.remove('banana-fall');
        banana.classList.add('banana-collect');
        fetch('/api/add-bonus', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                totalApesElement.textContent = data.totalApes;
                totalApesElement.classList.add('pop-animation');
            })
            .catch(error => console.error('Error adding bonus:', error));
        setTimeout(function() {
            totalApesElement.classList.remove('pop-animation');
        }, 200);
    }
    
    function startBananaRain() {
        for (let i = 0; i < 20; i++) {
            setTimeout(function() { createBanana(); }, i * 100);
        }
    }
});

// --- Copy to Clipboard Functionality (No changes needed here) ---
const copyButton = document.getElementById('copyButton');
const copyText = document.getElementById('copyText');
const contractAddress = document.getElementById('contractAddress').innerText;

copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(contractAddress).then(() => {
        copyText.innerText = 'COPIED!';
        copyButton.style.backgroundColor = '#FFFF00';
        copyButton.style.color = '#000';
        setTimeout(() => {
            copyText.innerText = 'COPY CONTRACT ADDRESS';
            copyButton.style.backgroundColor = 'transparent';
            copyButton.style.color = '#FFFF00';
        }, 2000);
    }).catch(err => {
        copyText.innerText = 'FAILED TO COPY';
        console.error('Failed to copy text: ', err);
        setTimeout(() => { copyText.innerText = 'COPY CONTRACT ADDRESS'; }, 2000);
    });
});