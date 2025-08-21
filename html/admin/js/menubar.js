
document.addEventListener('DOMContentLoaded', () => {
    let originallyActiveLink = null;
    let isMouseOverSidebar = false;
    let isMouseOverSubmenu = false;

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
    let restoreActiveTimer;

    const removeAllHighlights = () => {
        menuItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            if (link.classList.contains('highlight')) {
                link.classList.remove('highlight');
            }
        });
    };

    const checkAndHideMenu = () => {
        if (!isMouseOverSidebar && !isMouseOverSubmenu) {
            hideAllInternal();
        }
    };

    const hideAllInternal = () => {
        removeAllHighlights();
        submenus.forEach(submenu => {
            if (submenu.classList.contains('show')) {
                submenu.classList.remove('show');
            }
            submenu.style.paddingTop = '';
        });
        document.querySelectorAll('#main-nav-list .nav-link.highlight').forEach(link => {
             if (link !== originallyActiveLink) {
                link.classList.remove('highlight');
             }
        });

        if (!isMouseOverSidebar && !isMouseOverSubmenu && originallyActiveLink && !originallyActiveLink.classList.contains('active')) {
             clearTimeout(restoreActiveTimer);
             restoreActiveTimer = setTimeout(() => {
                const currentlyActive = document.querySelector('#main-nav-list .nav-link.active');
                if (!currentlyActive) {
                    originallyActiveLink.classList.add('active');
                }
             }, 50);
        }
    };

    const sidebar = document.getElementById('sidebar');

    if (sidebar) {
        sidebar.addEventListener('mouseenter', () => {
            isMouseOverSidebar = true;
            clearTimeout(hideTimer);
            clearTimeout(restoreActiveTimer);
        });

        sidebar.addEventListener('mouseleave', () => {
            isMouseOverSidebar = false;
            hideTimer = setTimeout(checkAndHideMenu, 200);
        });
    }

    menuItems.forEach(item => {
        const navLink = item.querySelector('.nav-link');

        item.addEventListener('mouseenter', () => {
            clearTimeout(hideTimer);
            clearTimeout(restoreActiveTimer);

            document.querySelectorAll('#main-nav-list .nav-link').forEach(link => {
                if (link !== originallyActiveLink && link.classList.contains('active')) {
                    link.classList.remove('active');
                }
                if (link.classList.contains('highlight')) {
                    link.classList.remove('highlight');
                }
            });

            if (originallyActiveLink && originallyActiveLink.classList.contains('active')) {
                originallyActiveLink.classList.remove('active');
            }

            if (navLink !== originallyActiveLink) {
                navLink.classList.add('highlight');
            } else {
                navLink.classList.add('active');
            }

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
            hideTimer = setTimeout(checkAndHideMenu, 200);
        });
    });

    submenus.forEach(submenu => {
        submenu.addEventListener('mouseenter', () => {
            isMouseOverSubmenu = true;
            clearTimeout(hideTimer);
            clearTimeout(restoreActiveTimer);
            
            document.querySelectorAll('#main-nav-list .nav-link').forEach(link => {
                if (link !== originallyActiveLink && link.classList.contains('active')) {
                    link.classList.remove('active');
                }
                if (link.classList.contains('highlight')) {
                    link.classList.remove('highlight');
                }
            });

            const menuId = submenu.dataset.menu;
            const correspondingItem = document.querySelector(`.nav-item[data-menu="${menuId}"]`);
            if (correspondingItem) {
                const mainLink = correspondingItem.querySelector('.nav-link');

                if (originallyActiveLink && originallyActiveLink.classList.contains('active')) {
                    originallyActiveLink.classList.remove('active');
                }

                if (mainLink !== originallyActiveLink) {
                    mainLink.classList.add('highlight');
                } else {
                    mainLink.classList.add('active');
                }
            }
        });
        submenu.addEventListener('mouseleave', () => {
            isMouseOverSubmenu = false;
            hideTimer = setTimeout(checkAndHideMenu, 200);
        });
    });
});
