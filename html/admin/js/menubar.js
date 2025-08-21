
document.addEventListener('DOMContentLoaded', () => {
    let originallyActiveLink = null;

    const setActiveLink = () => {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('#main-nav-list .nav-link');

        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        let activeLinkElement = null;

        if (currentPath.includes('adminSubmenu')) {
            activeLinkElement = document.querySelector('.nav-item[data-menu="menu-manage"] .nav-link');
        } else if (currentPath.includes('adminArticle')) {
            activeLinkElement = document.querySelector('.nav-item[data-menu="article-manage"] .nav-link');
        } else if (currentPath === '/admin' || currentPath === '/admin/') {
            activeLinkElement = document.querySelector('.nav-item a[href="/admin"]');
        }

        if (activeLinkElement) {
            activeLinkElement.classList.add('active');
        }

        originallyActiveLink = activeLinkElement;
    };

    setActiveLink();

    const menuItems = document.querySelectorAll('.has-submenu');
    const submenus = document.querySelectorAll('.submenu');
    let hideTimer;

    const removeAllHighlights = () => {
        menuItems.forEach(item => {
            item.querySelector('.nav-link').classList.remove('highlight');
        });
    };

    const hideAll = () => {
        removeAllHighlights();
        submenus.forEach(submenu => {
            submenu.classList.remove('show');
            submenu.style.paddingTop = '';
        });
    };

    const sidebar = document.getElementById('sidebar');

    menuItems.forEach(item => {
        const navLink = item.querySelector('.nav-link');

        item.addEventListener('mouseenter', () => {
            clearTimeout(hideTimer);
            hideAll();

            if (originallyActiveLink) {
                originallyActiveLink.classList.remove('active');
            }

            navLink.classList.add('highlight');

            const menuId = item.dataset.menu;
            const targetSubmenu = document.querySelector(`.submenu[data-menu="${menuId}"]`);
            if (targetSubmenu) {
                const itemRect = item.getBoundingClientRect();
                targetSubmenu.style.paddingTop = `${itemRect.top}px`;
                requestAnimationFrame(() => {
                    targetSubmenu.classList.add('show');
                });
            }
        });

        item.addEventListener('mouseleave', () => {
            hideTimer = setTimeout(hideAll, 200);
        });
    });

    submenus.forEach(submenu => {
        submenu.addEventListener('mouseenter', () => {
            clearTimeout(hideTimer);
            const menuId = submenu.dataset.menu;
            const correspondingItem = document.querySelector(`.nav-item[data-menu="${menuId}"]`);
            if (correspondingItem) {
                removeAllHighlights();

                const mainLink = correspondingItem.querySelector('.nav-link');
                if (originallyActiveLink) {
                    originallyActiveLink.classList.remove('active');
                }

                mainLink.classList.add('highlight');
            }
        });
        submenu.addEventListener('mouseleave', () => {
            hideTimer = setTimeout(hideAll, 200);
        });
    });

    if (sidebar) {
        sidebar.addEventListener('mouseleave', () => {
            setTimeout(() => {
                removeAllHighlights();

                if (originallyActiveLink) {
                    originallyActiveLink.classList.add('active');
                }
            }, 250);
        });
    }
});
