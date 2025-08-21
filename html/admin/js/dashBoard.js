
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('#main-nav-list .nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const linkHref = link.getAttribute('href');
        
        if (currentPath === linkHref || (currentPath + '/') === linkHref || currentPath === (linkHref + '/')) {
            link.classList.add('active');
        }
    });

    if (currentPath === '/admin' || currentPath === '/admin/') {
        const dashboardLink = document.querySelector('#main-nav-list .nav-link[href="/admin"]');
        if (dashboardLink) {
            dashboardLink.classList.add('active');
        }
    }
});
