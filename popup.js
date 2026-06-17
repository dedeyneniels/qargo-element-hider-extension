document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementById("filterContainer");

    const response = await fetch(
        "https://raw.githubusercontent.com/dedeyneniels/qargo-element-hider-extension/main/filters.json",
        { cache: "no-store" }
    );

    const filters = await response.json();

    chrome.storage.sync.get(["blockedList"], (data) => {

        const blockedList = data.blockedList || [];

        filters.forEach(filter => {

            const row = document.createElement("div");
            row.className = "filter-item";

            row.innerHTML = `
                <label>
                    <input
                        type="checkbox"
                        value="${filter}"
                        ${blockedList.includes(filter) ? "checked" : ""}
                    >
                    ${filter}
                </label>
            `;

            container.appendChild(row);
        });

        container.addEventListener("change", () => {

            const selected = [...document.querySelectorAll("input:checked")]
                .map(x => x.value);

            chrome.storage.sync.set({
                blockedList: selected
            });
        });
    });
});