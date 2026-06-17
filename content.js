async function getConfig() {
    const response = await fetch(
        "https://raw.githubusercontent.com/dedeyneniels/qargo-element-hider-extension/main/config.json",
        { cache: "no-store" }
    );

    return await response.json();
}

async function applyFilters() {

    const config = await getConfig();

    chrome.storage.sync.get(["blockedList"], (data) => {

        const blockedList = data.blockedList || [];

        document
            .querySelectorAll(config.selector)
            .forEach(tab => {

                const label = tab.textContent.trim();

                tab.style.display =
                    blockedList.includes(label)
                        ? "none"
                        : "";
            });
    });
}

applyFilters();

const observer = new MutationObserver(() => {
    applyFilters();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});