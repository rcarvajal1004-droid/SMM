document.addEventListener('DOMContentLoaded', () => {
    const toggles = document.querySelectorAll('[data-mobile-menu-toggle]');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const target = document.getElementById(toggle.getAttribute('data-mobile-menu-toggle'));
            if (target) target.classList.toggle('hidden');
        });
    });
});