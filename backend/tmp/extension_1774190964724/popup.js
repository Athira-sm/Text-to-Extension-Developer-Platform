document.getElementById('changeColorBtn').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs[0] && tabs[0].id) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        files: ['content.js']
      }).then(() => {
        console.log('Background changed to red!');
      }).catch(err => console.error('Failed to execute script:', err));
    }
  });
});