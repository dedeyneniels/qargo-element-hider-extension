document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('filterContainer');
    const url = 'https://raw.githubusercontent.com/dedeyneniels/qargo-element-hider-extension/refs/heads/main/filters.json';
    
    let filters = [];
    try {
        const response = await fetch(url);
        filters = await response.json();
    } catch (e) { filters = ["Error loading filters"]; }

    filters.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'filter-item';
        div.innerHTML = `<input type="checkbox" value="${option}" id="c${index}"><label for="c${index}">${option}</label>`;
        container.appendChild(div);
    });

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    chrome.storage.sync.get(['blockedList'], (data) => {
        const list = data.blockedList || [];
        checkboxes.forEach(cb => { if (list.includes(cb.value)) cb.checked = true; });
    });

    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const checked = Array.from(checkboxes).filter(i => i.checked).map(i => i.value);
            chrome.storage.sync.set({ blockedList: checked });
        });
    });
});