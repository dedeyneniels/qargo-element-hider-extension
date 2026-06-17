function verbergElementen() {
    chrome.storage.sync.get(['blockedList'], (data) => {
        const teksten = data.blockedList || [];
        const radioButtons = document.querySelectorAll('.ant-radio-button-wrapper');

        radioButtons.forEach(label => {
            const spans = label.querySelectorAll(':scope > span');
            if (spans.length > 0) {
                const lastSpan = spans[spans.length - 1];
                const buttonText = lastSpan.innerText.trim();

                // Verberg als het in de lijst staat, toon anders
                label.style.display = teksten.includes(buttonText) ? 'none' : '';
            }
        });
    });
}

// Observer voor dynamische wijzigingen
const observer = new MutationObserver(verbergElementen);
observer.observe(document.body, { childList: true, subtree: true });

// Luister naar wijzigingen vanuit de popup
chrome.storage.onChanged.addListener((changes) => {
    if (changes.blockedList) verbergElementen();
});

// Eerste keer aanroepen
verbergElementen();