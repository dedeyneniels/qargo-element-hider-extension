document.addEventListener('DOMContentLoaded', async () => {
    const app = document.getElementById('app');
    const baseUrl = 'https://raw.githubusercontent.com/dedeyneniels/qargo-element-hider-extension/refs/heads/main/';

    // 1. Haal de HTML layout en de filterlijst op
    const [htmlRes, filtersRes] = await Promise.all([
        fetch(baseUrl + 'popup_content.html', { cache: "no-store" }),
        fetch(baseUrl + 'filters.json', { cache: "no-store" })
    ]);

    app.innerHTML = await htmlRes.text();
    const masterList = await filtersRes.json();
    const container = document.getElementById('filterContainer');

    // 2. Haal de opgeslagen status op en bouw de lijst
    chrome.storage.sync.get(['blockedList'], (data) => {
        const savedList = data.blockedList || [];
        
        masterList.forEach((option, index) => {
            const isChecked = savedList.includes(option) ? 'checked' : '';
            const div = document.createElement('div');
            div.className = 'filter-item';
            div.innerHTML = `
                <input type="checkbox" value="${option}" id="c${index}" ${isChecked}>
                <label for="c${index}">${option}</label>
            `;
            container.appendChild(div);
        });

        // 3. Koppel de event listeners direct aan de container
        container.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                const checked = Array.from(checkboxes)
                                     .filter(i => i.checked)
                                     .map(i => i.value);
                
                chrome.storage.sync.set({ blockedList: checked }, () => {
                    console.log('Filters opgeslagen:', checked);
                });
            }
        });
    });
});