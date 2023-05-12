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
