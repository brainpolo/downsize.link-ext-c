chrome.contextMenus.create({
  id: "link-selector",
  title: "open link routed through pli.sh",
  contexts: ["link"]
});




chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "link-selector") {
    (async () => {
      try {
        let url = await fetchData(info.linkUrl, 1);  // link/mode
        console.log("Routed link: " + url);
        if (!/^https?:\/\//i.test(url)) {
          url = 'https://' + url;
        }
        chrome.tabs.create({ url: url });
      } catch (error) {
        console.error(`Failed to fetch data: ${error}`);
      }
    })();
  }  
});


async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

function getPassphrase() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('passphrase', (data) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(data.passphrase);
    });
  });
}


async function fetchData(tabUrl, mode) {
  const apiEndpoint = 'https://pli.sh/ify';
  let passphrase = await getPassphrase();

  try {
    const requestData = {
        url: tabUrl,
        mode: mode,
        passphrase: passphrase
    };
    console.log("Request data: " + JSON.stringify(requestData))
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

  return true;
});
