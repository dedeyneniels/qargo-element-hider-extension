document.addEventListener('DOMContentLoaded', () => {
    const filterOptions = [
        "Blocked", 
        "To plan", 
        "Planned", 
        "In transit", 
        "Delivered", 
        "Cancelled", 
        "Collect/announce",
        "Deliver/announce",
        "EXP followup",
        "IMP followup",
        "Incidents",
        "Last created by",
        "Quay Rent",
        "To Book Delivery",
        "To book Collection",
        "WASTE/ DGD/ARC"
    ];
    const container = document.getElementById('filterContainer');

    if (!container) {
        console.error("Fout: 'filterContainer' niet gevonden in de HTML.");
        return;
    }

    // 1. Genereer de HTML voor alle opties
    filterOptions.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'filter-item';
        
        // Uniek ID voor elke checkbox
        const id = `c${index}`;
        
        div.innerHTML = `
            <input type="checkbox" value="${option}" id="${id}">
            <label for="${id}">${option}</label>
        `;
        container.appendChild(div);
    });

    // 2. Selecteer alle zojuist gemaakte checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // 3. Laad de opgeslagen status vanuit chrome.storage
    chrome.storage.sync.get(['blockedList'], (data) => {
        const list = data.blockedList || [];
        checkboxes.forEach(cb => {
            if (list.includes(cb.value)) {
                cb.checked = true;
            }
        });
    });

    // 4. Sla wijzigingen direct op bij interactie
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