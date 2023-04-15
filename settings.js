document.addEventListener("DOMContentLoaded", () => {
  const toggleSwitch = document.getElementById("toggleSwitchMainApp")

  // Get the stored state of the toggle
  chrome.storage.sync.get("alwaysShowMainApp", (data) => {
    toggleSwitch.checked = data.alwaysShowMainApp
  })

  // Save the new state of the toggle when changed
  toggleSwitch.addEventListener("change", () => {
    chrome.storage.sync.set({ alwaysShowMainApp: toggleSwitch.checked })
  })
})
