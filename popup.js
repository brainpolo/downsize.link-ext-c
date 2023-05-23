
document.getElementById('access-passphrase-button').textContent = chrome.i18n.getMessage('accessPassphrase');
document.getElementById('mode1').textContent = chrome.i18n.getMessage('mode1');
document.getElementById('mode2').textContent = chrome.i18n.getMessage('mode2');
document.getElementById('mode3').textContent = chrome.i18n.getMessage('mode3');
document.getElementById('mode4').textContent = chrome.i18n.getMessage('mode4');
document.getElementById('successMessage').textContent = chrome.i18n.getMessage('savedToClipboardAlert');
document.getElementById('successMessage').style.display = 'none';


document.getElementById('home-button').addEventListener('click', function() {
  chrome.tabs.create({ url: 'https://downsize.link' });
});


document.getElementById('options-button').addEventListener('click', function() {
  chrome.runtime.openOptionsPage();
});


document.getElementById('access-passphrase-button').addEventListener('click', function() {
  chrome.runtime.sendMessage({ message: 'getPassphrase' }, function(response) {
    if (response.error) {
      console.error('Failed to get passphrase:', response.error);
    } else {
      let passphrase = response.passphrase;
      console.log('Passphrase:', passphrase);

      const fastApiUrl = 'https://downsize.link/links';

      // Create new FormData instance
      let formData = new FormData();
      formData.append('passkey', passphrase);

      fetch(fastApiUrl, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
        .then(links => {
          if (links.error) {
            alert(links.error);
            return;
          }
        
        console.log('Links:', links);
          let linksList = document.getElementById('links-list');

          while (linksList.firstChild) {
            linksList.removeChild(linksList.firstChild);
          }
          
        links.forEach(link => {
          let a = document.createElement('a');
          a.textContent = "[" + link.host + "/" + link.link_id + "] " + link.url;
          a.href = "https://" + link.host + "/" + link.link_id;
          a.target = '_blank'; // Open the link in a new tab
          
          let li = document.createElement('li');
          li.appendChild(a); // Append the link to the list item
          
          linksList.appendChild(li); // Append the list item to the links list
        });


        // Switch to the links view
        document.getElementById('main-view').style.display = 'none';
        document.getElementById('links-view').style.display = 'block';
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  });
});


document.getElementById('back-button').addEventListener('click', function() {
  // Switch back to the main view
  document.getElementById('links-view').style.display = 'none';
  document.getElementById('main-view').style.display = 'block';
});


function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
    } else {
      console.error('Unable to copy text');
    }
    return successful;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

async function showSuccessMessage() {
  const successMessage = document.getElementById('successMessage');
  successMessage.style.display = 'block';
  setTimeout(() => {
    successMessage.style.display = 'none';
    window.close();
  }, 2800);
}

function sendMessage(tabUrl, mode) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ tabUrl, mode }, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
        return;
      }
      resolve(response);
    });
  });
}

(async () => {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    const tabUrl = tab.url;

   const handleClick = async (event) => {
    const mode = event.target.value;
    try {
      const response = await sendMessage(tabUrl, mode);
      if (response && response.success) {
        const success = await copyToClipboard(response.data);
        if (success) {
          document.getElementById('mode-container').remove();
          showSuccessMessage();
        }
      }
    } catch (error) {
      console.error(error);
    }
};

const modeButtons = document.querySelectorAll('.link-mode-button');
  modeButtons.forEach((button) => {
    button.addEventListener('click', (event) => handleClick(event));
  });

})();
