async function getFilters() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/dedeyneniels/qargo-element-hider-extension/refs/heads/main/filters.json');
        return await response.json();
    } catch (e) {
        return []; // Fallback als fetch mislukt
    }
}

async function verbergElementen() {
    const teksten = await getFilters();
    document.querySelectorAll('.ant-radio-button-wrapper').forEach(label => {
        const spans = label.querySelectorAll(':scope > span');
        if (spans.length > 0) {
            const text = spans[spans.length - 1].innerText.trim();
            label.style.display = teksten.includes(text) ? 'none' : '';
        }
    });
}

const observer = new MutationObserver(verbergElementen);
observer.observe(document.body, { childList: true, subtree: true });
verbergElementen();

chrome.storage.onChanged.addListener(verbergElementen);