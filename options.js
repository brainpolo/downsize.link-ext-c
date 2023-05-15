
document.getElementById('optionsTitle').textContent = chrome.i18n.getMessage('optionsTitle');
document.getElementById('passphraseLabel').textContent = chrome.i18n.getMessage('passphraseLabel');
document.getElementById('passphraseNote').textContent = chrome.i18n.getMessage('passphraseNote');
document.getElementById('keyboardLayoutLabel').textContent = chrome.i18n.getMessage('keyboardLayoutLabel');
document.getElementById('saveButton').textContent = chrome.i18n.getMessage('save');
document.getElementById('optionsSavedAlert').textContent = chrome.i18n.getMessage('optionsSavedAlert');


function restoreOptions() {
  chrome.storage.local.get('passphrase', (data) => {
    document.querySelector('#passphrase').value = data.passphrase || '';
  });
  chrome.storage.local.get('keyboardLayout', (data) => {
    document.querySelector('#keyboardLayout').value = data.keyboardLayout || 'qwerty';
  });
}
document.addEventListener('DOMContentLoaded', restoreOptions);

function saveOptions(e) {
  e.preventDefault();
  chrome.storage.local.set({
    passphrase: document.querySelector('#passphrase').value
  }, () => {
    showBanner();
  });
  chrome.storage.local.set({
    keyboardLayout: document.querySelector('#keyboardLayout').value
  }, () => {
    showBanner();
  });
}

function showBanner() {
  const banner = document.querySelector('#success-banner');
  banner.style.display = 'block';
  setTimeout(() => {
    banner.style.display = 'none';
  }, 5000);
}

document.querySelector('#options-form').addEventListener('submit', saveOptions);
