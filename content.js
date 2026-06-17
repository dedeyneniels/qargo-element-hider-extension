function applyFilters() {
    chrome.storage.sync.get(['blockedList'], (data) => {
        const blocked = data.blockedList || [];
        const labels = document.querySelectorAll('.ant-radio-button-wrapper');
        
        labels.forEach(label => {
            const text = label.innerText.trim();
            // Als de tekst in de blockedList staat, verberg hem
            label.style.display = blocked.includes(text) ? 'none' : '';
        });
    });
}

// Observer voor dynamische pagina's
const observer = new MutationObserver(applyFilters);
observer.observe(document.body, { childList: true, subtree: true });

// Luister naar wijzigingen in de storage
chrome.storage.onChanged.addListener((changes) => {
    if (changes.blockedList) applyFilters();
});

applyFilters();