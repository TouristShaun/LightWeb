/* Function to load .html file as */
async function fetchHtmlAsText(url) {
  return fetch(url).then((response) => response.text())
}

async function loadMainApp() {
  const mainAppHtml = await fetchHtmlAsText(chrome.runtime.getURL("main.html"))
  const mainApp = document.createElement("div")
  mainApp.innerHTML = mainAppHtml
  return mainApp
}

async function createMainApp() {
  const mainApp = await loadMainApp()
  document.body.appendChild(mainApp)
}

function showMainApp() {
  chrome.storage.sync.get("alwaysShowMainApp", (data) => {
    if (data.alwaysShowMainApp) {
      createMainApp()
    }
  })
}

showMainApp()
