// script.js

document.addEventListener('DOMContentLoaded', () => {
    const toggleCheckbox = document.getElementById('toggle-checkbox');
    const themeText = document.getElementById('theme-text');
    const currentTheme = localStorage.getItem('theme');
  
    // Initialize theme based on saved preference or system preference
    if (currentTheme === 'dark') {
      document.body.classList.add('dark-mode');
      toggleCheckbox.checked = true;
      themeText.textContent = 'Dark Mode';
    } else if (currentTheme === 'light') {
      document.body.classList.remove('dark-mode');
      toggleCheckbox.checked = false;
      themeText.textContent = 'Light Mode';
    } else {
      // If no preference, use system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
        toggleCheckbox.checked = true;
        themeText.textContent = 'Dark Mode';
      } else {
        document.body.classList.remove('dark-mode');
        toggleCheckbox.checked = false;
        themeText.textContent = 'Light Mode';
      }
    }
  
    // Toggle theme on checkbox change
    toggleCheckbox.addEventListener('change', () => {
      if (toggleCheckbox.checked) {
        document.body.classList.add('dark-mode');
        themeText.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        themeText.textContent = 'Light Mode';
        localStorage.setItem('theme', 'light');
      }
    });
  });
  