/* Function to load .html file as */
async function fetchHtmlAsText(url) {
  return fetch(url).then((response) => response.text())
}

async function loadMainApp() {
  const mainAppHtml = await fetchHtmlAsText(chrome.runtime.getURL("app.html"))
  const mainApp = document.createElement("div")
  mainApp.innerHTML = mainAppHtml
  return mainApp
}

async function createMainApp() {
  const mainApp = await loadMainApp()

  const input = mainApp.querySelector("#myInput")
  const inputTextDisplay = mainApp.querySelector("#inputTextDisplay")

  // Load the saved value from storage and display it
  chrome.storage.sync.get("inputValue", (data) => {
    input.value = data.inputValue || ""
    inputTextDisplay.textContent = data.inputValue || ""
  })

  // Save the input value and update the display when the input changes
  input.addEventListener("input", (event) => {
    const inputValue = event.target.value
    chrome.storage.sync.set({ inputValue: inputValue }, () => {
      console.log("Input value saved to storage:", inputValue)
    })
    inputTextDisplay.textContent = inputValue
  })

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
