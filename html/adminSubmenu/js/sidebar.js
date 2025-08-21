
document.addEventListener('DOMContentLoaded', () => {
    const setActiveLink = () => {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('#main-nav-list .nav-link');

        navLinks.forEach(link => {
            link.classList.remove('active'); 
        });

        if (currentPath.includes('adminSubmenu')) {
            const menuManageLink = document.querySelector('.nav-item[data-menu="menu-manage"] .nav-link');
            if (menuManageLink) {
                menuManageLink.classList.add('active');
            }
        } else if (currentPath.includes('adminArticle')) {
            const articleManageLink = document.querySelector('.nav-item[data-menu="article-manage"] .nav-link');
            if (articleManageLink) {
                articleManageLink.classList.add('active');
            }
        } else if (currentPath === '/admin' || currentPath === '/admin/') {
            const dashboardLink = document.querySelector('.nav-item a[href="/admin"]');
            if (dashboardLink) {
                dashboardLink.classList.add('active');
            }
        }
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

    const hideAllSubmenus = () => {
        removeAllHighlights();
        submenus.forEach(submenu => {
            submenu.classList.remove('show');
            submenu.style.paddingTop = '';
        });
    };

    menuItems.forEach(item => {
        const navLink = item.querySelector('.nav-link');

        item.addEventListener('mouseenter', () => {
            clearTimeout(hideTimer);
            hideAllSubmenus();
            
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
            hideTimer = setTimeout(hideAllSubmenus, 200);
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
                if (!mainLink.classList.contains('active')) {
                    mainLink.classList.add('highlight');
                }
            }
        });
        submenu.addEventListener('mouseleave', () => {
            hideTimer = setTimeout(hideAllSubmenus, 200);
        });
    });

    const navContainer = document.querySelector('.content-nav');
    
    if (navContainer) {
        const tabLinks = navContainer.querySelectorAll('.tab-link');
        let currentlyActiveTab = navContainer.querySelector('.tab-link.active');

        tabLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                if (currentlyActiveTab) {
                    currentlyActiveTab.classList.remove('active');
                }
                
                this.classList.add('active');
                currentlyActiveTab = this;
            });
        });

        navContainer.addEventListener('mouseover', function(e) {
            if (e.target.matches('.tab-link')) {
                if (currentlyActiveTab && currentlyActiveTab !== e.target) {
                    currentlyActiveTab.classList.remove('active');
                }
            }
        });

        navContainer.addEventListener('mouseleave', function() {
            if (currentlyActiveTab && !currentlyActiveTab.classList.contains('active')) {
                currentlyActiveTab.classList.add('active');
            }
        });
    }

    const currentPath = window.location.pathname;
    if (currentPath.includes('adminSubmenu')) {
        const menuManageItem = document.querySelector('.nav-item[data-menu="menu-manage"]');
        const menuManageSubmenu = document.querySelector('.submenu[data-menu="menu-manage"]');

        if (menuManageItem && menuManageSubmenu) {
            const itemRect = menuManageItem.getBoundingClientRect();
            menuManageSubmenu.style.paddingTop = `${itemRect.top}px`;
            requestAnimationFrame(() => {
                menuManageSubmenu.classList.add('show');
            });
        }
    }
});
