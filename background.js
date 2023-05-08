async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

async function fetchData(tabUrl, mode) {
    const apiEndpoint = 'https://pli.sh/ify';

  try {
    const requestData = {
        url: tabUrl,
        mode: mode
    };

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
      
    const data = await response.text();
    let short_url = data.substring(1, data.length - 1); // Remove quotes
    return short_url;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  fetchData(request.tabUrl, request.mode)
    .then((data) => {
      sendResponse({ success: !!data, data });
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      sendResponse({ success: false });
    });

  return true; // Keep the message channel open until sendResponse is called
});
