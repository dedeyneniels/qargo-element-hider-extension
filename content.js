async function getBlockedList() {
    // 1. Haal centrale lijst op
    const response = await fetch('dedeyneniels/qargo-element-hider-extension/filters.json');
    const remoteList = await response.json();
    // 2. Haal lokale lijst op
    return new Promise((resolve) => {
        chrome.storage.sync.get(['blockedList'], (data) => {
            const localList = data.blockedList || [];
            resolve([...new Set([...remoteList, ...localList])]); // Combineer en verwijder dubbelen
        });
    });
}

async function verbergElementen() {
    const teksten = await getBlockedList();
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