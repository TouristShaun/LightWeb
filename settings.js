document.addEventListener("DOMContentLoaded", () => {
  const toggleSwitch = document.getElementById("toggleSwitch")

  // Get the stored state of the toggle
  chrome.storage.sync.get("alwaysPopupEnabled", (data) => {
    toggleSwitch.checked = data.alwaysPopupEnabled
  })

  // Save the new state of the toggle when changed
  toggleSwitch.addEventListener("change", () => {
    chrome.storage.sync.set({ alwaysPopupEnabled: toggleSwitch.checked })
  })
})
