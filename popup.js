document.addEventListener('DOMContentLoaded', async () => {
    const app = document.getElementById('app');
    const baseUrl = 'https://raw.githubusercontent.com/dedeyneniels/qargo-element-hider-extension/refs/heads/main/';

    // Haal HTML en JSON op
    const [htmlRes, filtersRes] = await Promise.all([
        fetch(baseUrl + 'popup_content.html', { cache: "no-cache" }),
        fetch(baseUrl + 'filters.json', { cache: "no-cache" })
    ]);

    app.innerHTML = await htmlRes.text();
    const masterList = await filtersRes.json();
    const container = document.getElementById('filterContainer');

    chrome.storage.sync.get(['blockedList'], (data) => {
        const savedList = data.blockedList || [];
        masterList.forEach((option, index) => {
            const checked = savedList.includes(option) ? 'checked' : '';
            container.innerHTML += `
                <div class="filter-item">
                    <input type="checkbox" value="${option}" id="c${index}" ${checked}>
                    <label for="c${index}">${option}</label>
                </div>`;
        });
        
        document.querySelectorAll('input').forEach(cb => {
            cb.addEventListener('change', () => {
                const checked = Array.from(document.querySelectorAll('input:checked')).map(i => i.value);
                chrome.storage.sync.set({ blockedList: checked });
            });
        });
    });
});