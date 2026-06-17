const CONFIG_URL =
"https://raw.githubusercontent.com/dedeyneniels/qargo-element-hider-extension/main/config.json";

const STYLES_URL =
"https://raw.githubusercontent.com/dedeyneniels/qargo-element-hider-extension/main/styles.json";

let configCache = null;
let stylesCache = null;

async function loadConfig() {

    try {

        const response =
            await fetch(CONFIG_URL,{
                cache:"no-store"
            });

        configCache =
            await response.json();

    } catch(e){

        console.error(
            "config.json fout",
            e
        );
    }
}

async function loadStyles() {

    try {

        const response =
            await fetch(STYLES_URL,{
                cache:"no-store"
            });

        stylesCache =
            await response.json();

    } catch(e){

        console.error(
            "styles.json fout",
            e
        );
    }
}

function applyCustomStyles() {

    if(!stylesCache) return;

    stylesCache.forEach(rule=>{

        document
            .querySelectorAll(rule.selector)
            .forEach(element=>{

                Object.assign(
                    element.style,
                    rule.style
                );
            });
    });
}

function applyFilters() {

    if(!configCache) return;

    chrome.storage.sync.get(
        ["blockedList"],
        (data)=>{

            const blockedList =
                data.blockedList || [];

            document
                .querySelectorAll(
                    configCache.tabSelector
                )
                .forEach(tab=>{

                    const text =
                        tab.textContent.trim();

                    if(
                        blockedList.includes(text)
                    ){
                        tab.style.display =
                            "none";
                    }else{
                        tab.style.display =
                            "";
                    }
                });
        }
    );
}

async function refresh() {

    await loadConfig();

    await loadStyles();

    applyFilters();

    applyCustomStyles();
}

refresh();

setInterval(refresh,2000);