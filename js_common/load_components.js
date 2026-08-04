// js_common/loadComponents.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Navbar Component
    const navPlaceholder = document.getElementById('navbar-placeholder');
    if (navPlaceholder) {
        const navbarPath = navPlaceholder.getAttribute('data-nav-path') || '../includes/navbar.html';
        fetchComponent(navbarPath, navPlaceholder, highlightActiveLinks);
    }

    // 2. Load Footer Component
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        const footerPath = footerPlaceholder.getAttribute('data-footer-path') || '../includes/footer.html';
        fetchComponent(footerPath, footerPlaceholder);
    }
});

/**
 * Generic fetch utility for loading HTML modules
 */
function fetchComponent(filePath, targetElement, callback = null) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status} when loading ${filePath}`);
            return response.text();
        })
        .then(html => {
            targetElement.innerHTML = html;
            if (callback) callback();
        })
        .catch(error => console.error('Error loading UI component:', error));
}

/**
 * Highlights active page link in the navbar
 */
function highlightActiveLinks() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('#navbar-placeholder .nav-link, #navbar-placeholder .dropdown-item');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.endsWith(href.replace('../', ''))) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');

            // Activate parent dropdown if link is nested
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                const toggle = parentDropdown.querySelector('.dropdown-toggle');
                if (toggle) toggle.classList.add('active');
            }
        }
    });
}