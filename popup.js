document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('filterContainer');
    const url = 'https://raw.githubusercontent.com/dedeyneniels/qargo-element-hider-extension/refs/heads/main/filters.json';
    
    // Ophalen van data
    const response = await fetch(url, { cache: "no-store" });
    const masterList = await response.json();

    chrome.storage.sync.get(['blockedList'], (data) => {
        const savedList = data.blockedList || [];
        
        masterList.forEach((option) => {
            const div = document.createElement('div');
            div.className = 'filter-item';
            const checked = savedList.includes(option) ? 'checked' : '';
            div.innerHTML = `<input type="checkbox" value="${option}" ${checked}> <label>${option}</label>`;
            container.appendChild(div);
        });

        // Event listener op de container (Event Delegation)
        container.addEventListener('change', (e) => {
            if (e.target.tagName === 'INPUT') {
                const allChecked = Array.from(document.querySelectorAll('input:checked')).map(i => i.value);
                chrome.storage.sync.set({ blockedList: allChecked }, () => {
                    console.log('Opgeslagen:', allChecked);
                });
            }
        });
    });
});