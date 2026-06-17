document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('filterContainer');
    // Jouw specifieke URL naar de JSON
    const url = 'https://raw.githubusercontent.com/dedeyneniels/qargo-element-hider-extension/refs/heads/main/filters.json';
    
    // 1. Maak de container leeg om duplicaten te voorkomen
    container.innerHTML = ''; 

    // 2. Haal de lijst op van GitHub
    let filters = [];
    try {
        const response = await fetch(url, { cache: "no-store" }); // "no-store" dwingt de browser om verse data te halen
        filters = await response.json();
    } catch (e) {
        console.error("Kon filters niet ophalen, gebruik fallback:", e);
        filters = ["To plan", "Planned"]; // Fallback als GitHub niet bereikbaar is
    }

    // 3. Genereer de HTML voor alle opties uit de JSON
    filters.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'filter-item';
        
        const id = `c${index}`;
        div.innerHTML = `
            <input type="checkbox" value="${option}" id="${id}">
            <label for="${id}">${option}</label>
        `;
        container.appendChild(div);
    });

    // 4. Laad de opgeslagen status uit de lokale Chrome opslag
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    chrome.storage.sync.get(['blockedList'], (data) => {
        const list = data.blockedList || [];
        checkboxes.forEach(cb => {
            if (list.includes(cb.value)) {
                cb.checked = true;
            }
        });
    });

    // 5. Sla wijzigingen direct op wanneer de gebruiker klikt
    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const checked = Array.from(checkboxes)
                                 .filter(i => i.checked)
                                 .map(i => i.value);
            
            chrome.storage.sync.set({ blockedList: checked }, () => {
                console.log('Filters opgeslagen:', checked);
            });
        });
    });
});