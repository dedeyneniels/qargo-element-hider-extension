async function getFilters() {
    // Haal de blokkeerlijst op uit de lokale opslag (wat je in popup.js hebt opgeslagen)
    return new Promise((resolve) => {
        chrome.storage.sync.get(['blockedList'], (data) => {
            resolve(data.blockedList || []);
        });
    });
}

async function verbergElementen() {
    const blockedList = await getFilters();
    
    // Zoek alle relevante elementen
    const elements = document.querySelectorAll('.ant-radio-button-wrapper');

    elements.forEach(label => {
        const spans = label.querySelectorAll(':scope > span');
        if (spans.length > 0) {
            const text = spans[spans.length - 1].innerText.trim();

            // Logica:
            // Als het in de blockedList staat -> verberg (display: none)
            // Als het NIET in de blockedList staat -> toon (display: '')
            if (blockedList.includes(text)) {
                label.style.display = 'none';
            } else {
                label.style.display = ''; // Dit forceert het tonen
            }
        }
    });
}

// Observer om wijzigingen op de pagina op te vangen
const observer = new MutationObserver(verbergElementen);
observer.observe(document.body, { childList: true, subtree: true });

// Luister naar wijzigingen in de storage vanuit de popup
chrome.storage.onChanged.addListener((changes) => {
    if (changes.blockedList) {
        verbergElementen();
    }
});

// Eerste keer uitvoeren
verbergElementen();