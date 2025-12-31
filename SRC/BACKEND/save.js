// Card saving/loading logic
const CARD_STORAGE_KEY = 'listmyshit-cards';

export function getAllCardData() {
    const cards = document.querySelectorAll('.card');
    const data = {};
    cards.forEach(card => {
        let id = card.dataset.identifier;
        if (!id || id.length !== 7) {
            id = randomIdentifier();
            card.dataset.identifier = id;
            card.setAttribute('data-identifier', id);
        }

        let parent = 'safe';
        let order = 0;
        if (card.parentElement && card.parentElement.classList.contains('cat')) {
            const cats = Array.from(document.querySelectorAll('.cat'));
            const idx = cats.indexOf(card.parentElement);
            if (idx !== -1) parent = `cat-${idx}`;
            order = Array.from(card.parentElement.children).filter(c => c.classList.contains('card')).indexOf(card);
        } else if (card.parentElement && card.parentElement.id === 'safe') {
            order = Array.from(card.parentElement.children).filter(c => c.classList.contains('card')).indexOf(card);
        }
        data[id] = {
            title: card.dataset.title || '',
            description: card.dataset.description || '',
            posX: card.getAttribute('data-pos-x') || '',
            posY: card.getAttribute('data-pos-y') || '',
            parent: parent,
            order: order
        };
    });
    return data;
}

export function saveAllCards() {
    const data = getAllCardData();
    localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(data));
}

export function loadAllCards() {
    const raw = localStorage.getItem(CARD_STORAGE_KEY);
    if (!raw) return {};
    let data = {};
    try { data = JSON.parse(raw); } catch (e) { return {}; }
    return data;
}

export function restoreCardsToDOM() {
    document.querySelectorAll('.card[data-identifier]').forEach(card => card.remove());

    const data = loadAllCards();
    Object.entries(data).forEach(([id, cardData]) => {
        // Create card element
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-identifier', id);
        card.setAttribute('data-title', cardData.title);
        card.setAttribute('data-description', cardData.description);
        if (cardData.posX) card.setAttribute('data-pos-x', cardData.posX);
        if (cardData.posY) card.setAttribute('data-pos-y', cardData.posY);
        if (cardData.posX) card.style.setProperty('--card-pos-x', cardData.posX + 'px');
        if (cardData.posY) card.style.setProperty('--card-pos-y', cardData.posY + 'px');
        card.innerHTML = `
            <div class="cardEdit button">
                <span class="material-symbols-rounded">edit</span>
            </div>
            <h3></h3>
            <h2></h2>
            <div class="cardLabel">
                <div class="cardLabelLabel"></div>
            </div>
        `;

        let parentElem;
        if (cardData.parent && cardData.parent.startsWith('cat-')) {
            const idx = parseInt(cardData.parent.replace('cat-', ''));
            const cats = document.querySelectorAll('.cat');
            if (cats[idx]) {
                parentElem = cats[idx];
            } else {
                parentElem = document.getElementById('safe');
                card.classList.add('cardFree');
            }
        } else {
            parentElem = document.getElementById('safe');
            card.classList.add('cardFree');
        }
        // Insert at correct order
        const cardsInParent = Array.from(parentElem.children).filter(c => c.classList.contains('card'));
        if (cardData.order !== undefined && cardData.order >= 0 && cardData.order < cardsInParent.length) {
            parentElem.insertBefore(card, cardsInParent[cardData.order]);
        } else {
            parentElem.appendChild(card);
        }
    });
}

export function updateCardElementsFromData() {
    document.querySelectorAll('.card').forEach(card => {
        let id = card.dataset.identifier;
        if (!id || id.length !== 7) {
            id = randomIdentifier();
            card.dataset.identifier = id;
            card.setAttribute('data-identifier', id);
        }
        const title = card.dataset.title || '';
        const desc = card.dataset.description || '';
        const h3 = card.querySelector('h3');
        const h2 = card.querySelector('h2');
        if (h3) h3.textContent = title;
        if (h2) h2.textContent = desc;
    });
}
// Generate a random 7-digit identifier (string)
export function randomIdentifier() {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
}


// save.js
// Handles saving and loading app state (like preferences) to localStorage in a JSON-like format
// This is ai generated and will be researched to learn how to do local storage properly


// Key for localStorage
const STORAGE_KEY = 'listmyshit-data';

// Save the current border radius and primary color values to localStorage
function savePreferences() {
    // Get the border radius value from the CSS variable
    const br = getComputedStyle(document.documentElement)
        .getPropertyValue('--br')
        .replace('px', '')
        .trim();
    // Get the primary color value from the CSS variable
    const pri = getComputedStyle(document.documentElement)
        .getPropertyValue('--pri')
        .trim();

    // Try to load existing data, or start with an empty object
    let data = {};
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try {
            data = JSON.parse(raw);
        } catch (e) {
            data = {};
        }
    }

    // Update the border radius and primary color values
    data.br = br;
    data.pri = pri;

    // Save back to localStorage as a JSON string
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Save all .item elements (todo items) to localStorage
function saveItems() {
    const items = document.querySelectorAll('.item');
    const itemData = [];
    items.forEach(el => {
        itemData.push({
            position: el.dataset.position,
            title: el.dataset.title,
            description: el.dataset.description,
            deadline: el.dataset.deadline,
            color: el.dataset.color
        });
    });
    let data = {};
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try { data = JSON.parse(raw); } catch (e) { data = {}; }
    }
    data.items = itemData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Load the border radius and primary color values from localStorage and apply them
function loadPreferences() {
    // Try to load existing data, or start with an empty object
    let data = {};
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try {
            data = JSON.parse(raw);
        } catch (e) {
            data = {};
        }
    }

    // If a border radius value exists, apply it
    if (data.br !== undefined) {
        document.documentElement.style.setProperty('--br', data.borderRadius + 'px');
        const slider = document.getElementById('preference-br');
        if (slider) slider.value = data.br;
        const value = document.getElementById('preference-br-value');
        if (value) value.innerHTML = data.br + '<span>px</span>';
    }
    // If a primary color value exists, apply it
    if (data.primaryColor !== undefined) {
        document.documentElement.style.setProperty('--pri', data.primaryColor);
    }
}

// Load items from localStorage and render them (example, you must implement rendering logic)
function loadItems() {
    let data = {};
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try { data = JSON.parse(raw); } catch (e) { data = {}; }
    }
    if (Array.isArray(data.items)) {
        // Example: clear and render items
        // const container = document.getElementById('items-container');
        // if (container) container.innerHTML = '';
        // data.items.forEach(item => {
        //     const el = document.createElement('div');
        //     el.className = 'item';
        //     el.dataset.position = item.position;
        //     el.dataset.title = item.title;
        //     el.dataset.description = item.description;
        //     el.dataset.deadline = item.deadline;
        //     el.dataset.color = item.color;
        //     // Add your own rendering logic here
        //     if (container) container.appendChild(el);
        // });
    }
}

// On page load, load preferences and set up saving on slider change
// (You can expand this for more settings later)
document.addEventListener('DOMContentLoaded', function() {
    loadPreferences();
    loadItems();

    const slider = document.getElementById('preference-br');
    if (slider) {
        slider.addEventListener('input', savePreferences);
        slider.addEventListener('change', savePreferences);
    }
    // Call saveItems() whenever you add, edit, or remove an .item
    // Example: document.getElementById('add-item-btn').addEventListener('click', saveItems);
});

// To expand: Use HTML data-* attributes (e.g., data-title, data-description, data-category)
// and collect them into arrays/objects for saving. This keeps the structure flexible and extensible.
