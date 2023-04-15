async function fetchHtmlAsText(url) {
  return fetch(url).then((response) => response.text())
}

async function loadMainApp() {
  const mainAppHtml = await fetchHtmlAsText(
    chrome.extension.getURL("main.html")
  )
  const mainApp = document.createElement("div")
  mainApp.innerHTML = mainAppHtml
  return mainApp
}
