// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');
const html = document.documentElement;
const body = document.body;

function setTheme(isDark) {
    if (isDark) {
        html.classList.add('dark');
        html.classList.remove('light');
    } else {
        html.classList.remove('dark');
        html.classList.add('light');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Update animation colors if the instance exists
    if (window.dataAnimation) {
        window.dataAnimation.updateColors(isDark);
    }
}

// Check saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme === 'dark');

themeToggle.addEventListener('click', () => {
    const isDark = !html.classList.contains('dark');
    setTheme(isDark);
});

// Scroll Header Logic
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (window.scrollY > 50) {
        if (isDark) {
            header.classList.add('bg-dark-bg/80', 'backdrop-blur-md', 'border-[#1e293b]');
            header.classList.remove('bg-light-bg/80', 'border-gray-200', 'border-transparent');
        } else {
            header.classList.add('bg-light-bg/80', 'backdrop-blur-md', 'border-gray-200');
            header.classList.remove('bg-dark-bg/80', 'border-[#1e293b]', 'border-transparent');
        }
    } else {
        header.classList.remove('bg-dark-bg/80', 'backdrop-blur-md', 'border-[#1e293b]', 'bg-light-bg/80', 'border-gray-200');
        header.classList.add('border-transparent');
    }
});

// Initialize Lucide Icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}
