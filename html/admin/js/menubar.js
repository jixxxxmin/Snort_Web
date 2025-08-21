
document.addEventListener('DOMContentLoaded', () => {
   
    let originallyActiveLink = null;

    const setActiveLink = () => {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('#main-nav-list .nav-link');

        navLinks.forEach(link => {
            link.classList.remove('active'); 
        });

        let activeLinkFound = false;

        if (currentPath.includes('adminSubmenu')) {
            const menuManageLink = document.querySelector('.nav-item[data-menu="menu-manage"] .nav-link');
            if (menuManageLink) {
                menuManageLink.classList.add('active');
                activeLinkFound = true;
            }
        } else if (currentPath.includes('adminArticle')) {
            const articleManageLink = document.querySelector('.nav-item[data-menu="article-manage"] .nav-link');
            if (articleManageLink) {
                articleManageLink.classList.add('active');
                activeLinkFound = true;
            }
        } 
        
        if (!activeLinkFound) {
            const dashboardLink = document.querySelector('.nav-item a[href="/admin"]');
            if (dashboardLink && (currentPath === '/admin' || currentPath === '/admin/')) {
                dashboardLink.classList.add('active');
            }
        }

        originallyActiveLink = document.querySelector('#main-nav-list .nav-link.active');
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

            if (originallyActiveLink && originallyActiveLink !== navLink) {
                originallyActiveLink.classList.remove('active');
            }

            if (!navLink.classList.contains('active')) {
                navLink.classList.add('highlight');
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
                if (originallyActiveLink && originallyActiveLink !== mainLink) {
                    originallyActiveLink.classList.remove('active');
                }

                if (!mainLink.classList.contains('active')) {
                    mainLink.classList.add('highlight');
                }
            }
        });
        submenu.addEventListener('mouseleave', () => {
            hideTimer = setTimeout(hideAll, 200);
        });
    });

    if (sidebar) {
        sidebar.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (originallyActiveLink && !originallyActiveLink.classList.contains('active')) {
                    originallyActiveLink.classList.add('active');
                }
            }, 250);
        });
    }
});
