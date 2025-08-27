document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('memeCanvas');
    const ctx = canvas.getContext('2d');
    const topTextInput = document.getElementById('topText');
    const bottomTextInput = document.getElementById('bottomText');
    const downloadBtn = document.getElementById('downloadBtn');
    const backgroundGallery = document.getElementById('backgroundGallery');
    const characterGallery = document.getElementById('characterGallery');
    const accessoriesGrid = document.getElementById('accessoriesGrid');

    let selectedBackgroundId = null;
    let selectedCharacterId = null;
    let activeTraits = new Set();

    const CANVAS_WIDTH = 500;
    const CANVAS_HEIGHT = 500;

    // --- Asset Definitions ---
    const backgrounds = [
        { id: 'penthouse', src: './assets/traits/bg_penthouse.png', name: 'Penthouse' },
        { id: 'mudhouse', src: './assets/traits/bg_mudhouse.png', name: 'Mudhouse' },
        { id: 'church', src: './assets/traits/bg_mac.png', name: 'MacDonalds' },
        { id: 'clubhouse', src: './assets/traits/bg_clubhouse.jpg', name: 'Clubhouse' },
        { id: 'mosque', src: './assets/traits/bg_green.png', name: 'Green Candle' },
        { id: 'battlefield', src: './assets/traits/bg_battlefield.png', name: 'Battlefield' },
    ];

    const characters = [
        { id: 'ape1', src: './assets/traits/base_ape_1.png', name: 'Ape Base 1' },
        { id: 'ape2', src: './assets/traits/base_ape_2.png', name: 'Ape Base 2' },
        { id: 'ape3', src: './assets/traits/base_ape_3.png', name: 'Ape Base 3' },
        ];

    const traits = [
        { id: 'hat', src: './assets/traits/trait_hat.png', name: 'Hat' },
        { id: 'eyeglass', src: './assets/traits/trait_money.png', name: 'Money' },
        { id: 'fire-eyes', src: './assets/traits/pressed.png', name: 'APE' },
    ];

    const imageCache = {};

    // --- Core Meme Generation Logic ---
    async function generateMeme() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 1. Draw Background - Scaled to fill the 500x500 canvas
        if (selectedBackgroundId) {
            const bg = await loadImage(backgrounds.find(b => b.id === selectedBackgroundId).src);
            if (bg) ctx.drawImage(bg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        // 2. Draw Character - Scaled to fill the 500x500 canvas
        if (selectedCharacterId) {
            const char = await loadImage(characters.find(c => c.id === selectedCharacterId).src);
            if (char) ctx.drawImage(char, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        // 3. Draw Active Traits - Scaled to fill the 500x500 canvas
        for (const traitId of activeTraits) {
            const trait = await loadImage(traits.find(t => t.id === traitId).src);
            if (trait) ctx.drawImage(trait, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        // 4. Draw Text
        const topText = topTextInput.value.toUpperCase();
        const bottomText = bottomTextInput.value.toUpperCase();
        const fontSize = CANVAS_WIDTH / 10;
        ctx.font = `${fontSize}px Impact`;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = fontSize / 20;
        ctx.textAlign = 'center';

        ctx.fillText(topText, CANVAS_WIDTH / 2, fontSize * 1.2);
        ctx.strokeText(topText, CANVAS_WIDTH / 2, fontSize * 1.2);
        
        ctx.fillText(bottomText, CANVAS_WIDTH / 2, CANVAS_HEIGHT - (fontSize * 0.4));
        ctx.strokeText(bottomText, CANVAS_WIDTH / 2, CANVAS_HEIGHT - (fontSize * 0.4));
    }

    // --- Utility Functions ---
    function loadImage(src) {
        return new Promise((resolve) => {
            if (imageCache[src]) {
                return resolve(imageCache[src]);
            }
            const img = new Image();
            img.onload = () => {
                imageCache[src] = img;
                resolve(img);
            };
            img.onerror = () => resolve(null);
            img.src = src;
        });
    }

    function populateGallery(galleryElement, items, selectionHandler) {
        galleryElement.innerHTML = '';
        items.forEach(item => {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.name;
            img.dataset.id = item.id;
            img.classList.add('gallery-thumbnail');
            img.addEventListener('click', () => {
                selectionHandler(item.id);
            });
            galleryElement.appendChild(img);
        });
    }

    function handleSelection(galleryElement, id) {
        // Allow deselecting by clicking the same item again
        const currentSelection = galleryElement.querySelector('.selected');
        if (currentSelection && currentSelection.dataset.id === id) {
            currentSelection.classList.remove('selected');
            return null; // Return null to signify deselection
        }

        galleryElement.querySelectorAll('.gallery-thumbnail').forEach(thumb => {
            thumb.classList.remove('selected');
        });
        galleryElement.querySelector(`[data-id="${id}"]`).classList.add('selected');
        return id; // Return the new selected ID
    }
    
    // --- Event Listeners and Initial Population ---
    populateGallery(backgroundGallery, backgrounds, (id) => {
        selectedBackgroundId = handleSelection(backgroundGallery, id);
        generateMeme();
    });

    populateGallery(characterGallery, characters, (id) => {
        selectedCharacterId = handleSelection(characterGallery, id);
        generateMeme();
    });

    accessoriesGrid.innerHTML = '';
    traits.forEach(trait => {
        const label = document.createElement('label');
        label.className = 'accessory-option';
        label.innerHTML = `
            <input type="checkbox" data-id="${trait.id}">
            <img src="${trait.src}" alt="${trait.name}" class="trait-icon">
            <span>${trait.name}</span>
        `;
        label.querySelector('input').addEventListener('change', (e) => {
            if (e.target.checked) activeTraits.add(trait.id);
            else activeTraits.delete(trait.id);
            generateMeme();
        });
        accessoriesGrid.appendChild(label);
    });

    topTextInput.addEventListener('input', generateMeme);
    bottomTextInput.addEventListener('input', generateMeme);

    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'ape-meme.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    generateMeme(); // Initial render
});