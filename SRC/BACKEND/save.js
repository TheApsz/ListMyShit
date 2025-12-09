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
