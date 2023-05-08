const modeButtons = {
  'light-theme': document.getElementById('color_mode1'),
  'dark-theme': document.getElementById('color_mode2'),
  'automatic-theme': document.getElementById('color_mode3')
};

const setActiveMode = (mode) => {
  Object.keys(modeButtons).forEach((key) => {
    const button = modeButtons[key];
    if (key === mode) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
};

const setTheme = (theme, save = true) => {
  const body = document.body;
  body.classList.remove('light-theme', 'dark-theme');
  body.classList.add(theme);

  if (save) {
    localStorage.setItem('theme', theme);
  }
};

const applyPreferredTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const preferredTheme = prefersDarkScheme.matches ? 'dark-theme' : 'light-theme';

  if (savedTheme) {
    setTheme(savedTheme, false);
    setActiveMode(savedTheme);
  } else {
    setTheme(preferredTheme, false);
    setActiveMode('automatic-theme');
  }

  // Add listener for prefers-color-scheme changes
  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark-theme' : 'light-theme', false);
      setActiveMode('automatic-theme');
    }
  });
};

const applyAutomaticTheme = () => {
  localStorage.removeItem('theme');
  applyPreferredTheme();
};

applyPreferredTheme();
document.getElementById('color_mode1').addEventListener('click', () => {
  setTheme('light-theme', true);
  setActiveMode('light-theme');
});
document.getElementById('color_mode2').addEventListener('click', () => {
  setTheme('dark-theme', true);
  setActiveMode('dark-theme');
});
document.getElementById('color_mode3').addEventListener('click', applyAutomaticTheme);
