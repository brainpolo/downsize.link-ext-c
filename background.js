chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "link-selector",
    title: chrome.i18n.getMessage("contextMenuLinkSelectTitle"),
    contexts: ["link"]
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "link-selector") {
    (async () => {
      try {
        let url = await fetchData(info.linkUrl, -1);  // negative mode
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

function getKeyboardLayout() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('keyboardLayout', (data) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(data.keyboardLayout);
    });
  });
}



async function fetchData(tabUrl, mode) {
  const apiEndpoint = 'https://downsize.link/ify';
  let passphrase = await getPassphrase();
  let keyboard = await getKeyboardLayout();

  try {
    const requestData = {
        url: tabUrl,
        mode: mode,
        keyboard: keyboard,
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

chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'copy_clipboard') {
    // Get the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const response = await fetchData(tabs[0].url, 1);  // tab/mode
      // Inject a content script into the active tab and send the response to it
      if (response) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: copyToClipboard,
          args: [response]
        });
      }
    });
  }
});

function copyToClipboard(data) {
  navigator.clipboard.writeText(data).then(() => {
    console.log('Copied to clipboard: ' + data);
  }, (err) => {
    console.error('Failed to copy text: ', err);
  });
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'getPassphrase') {
    getPassphrase()
      .then(passphrase => {
        sendResponse({ passphrase: passphrase });
      })
      .catch(error => {
        sendResponse({ error: error });
      });

    // Indicate that response is async
    return true;
  }
});

