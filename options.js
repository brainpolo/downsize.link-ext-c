document.addEventListener('DOMContentLoaded', restoreOptions);

document.querySelector('#options-form').addEventListener('submit', saveOptions);

function saveOptions(e) {
  e.preventDefault();
  chrome.storage.local.set({
    passphrase: document.querySelector('#passphrase').value
  });
}

function restoreOptions() {
  chrome.storage.local.get('passphrase', (data) => {
    document.querySelector('#passphrase').value = data.passphrase || '';
  });
}
