
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

  // Validate options
  MIN_PASSPHRASE_LENGTH = 20;
  MAX_PASSPHRASE_LENGTH = 200;

  if (document.querySelector('#passphrase').value.length < MIN_PASSPHRASE_LENGTH) {
    alert(chrome.i18n.getMessage('passphraseTooShortAlert'));
    return;
  }
  if (document.querySelector('#passphrase').value.length > MAX_PASSPHRASE_LENGTH) {
    alert(chrome.i18n.getMessage('passphraseTooLongAlert'));
    return;
  }

// Save options
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
