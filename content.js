function applyFilters() {
    if (!window.location.hostname.includes("qargo.io")) return;

    chrome.storage.sync.get(['blockedList'], (data) => {
        const blocked = data.blockedList || [];
        document.querySelectorAll('.ant-radio-button-wrapper').forEach(label => {
            const spans = label.querySelectorAll(':scope > span');
            if (spans.length > 0) {
                const text = spans[spans.length - 1].innerText.trim();
                label.style.display = blocked.includes(text) ? 'none' : '';
            }
        });
    });
}

new MutationObserver(applyFilters).observe(document.body, { childList: true, subtree: true });
chrome.storage.onChanged.addListener(applyFilters);
applyFilters();