// Export the current settings JSON
export let customNames = JSON.parse(localStorage.getItem("customNamesJSON"));
if (customNames == null) {
  customNames = {};

  // Send a message for the extension to pick up on when the settings change
  window.postMessage({namesChanged: true});

  localStorage.setItem("customNamesJSON", JSON.stringify(customNames));
}

// Custom Names menu data
export const namesMenu = ["PERIOD_0","PERIOD_1","PERIOD_2","PERIOD_3","PERIOD_4","PERIOD_5","PERIOD_6","ADVISORY", "HOMEROOM"];
