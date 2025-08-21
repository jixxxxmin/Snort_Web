
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
            const currentlyActiveInMainMenu = document.querySelector('#main-nav-list .nav-link.active');
            if (originallyActiveLink && !currentlyActiveInMainMenu) {
                originallyActiveLink.classList.add('active');
            }
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
    };

    const sidebar = document.getElementById('sidebar');
    
    if (sidebar) {
        sidebar.addEventListener('mouseenter', () => {
            isMouseOverSidebar = true;
            clearTimeout(hideTimer);
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

            document.querySelectorAll('#main-nav-list .nav-link').forEach(link => {
                if (link.classList.contains('active') && link !== originallyActiveLink && link !== navLink) {
                    link.classList.remove('active');
                }
                if (link.classList.contains('highlight')) {
                    link.classList.remove('highlight');
                }
            });

            if (originallyActiveLink && originallyActiveLink.classList.contains('active') && navLink !== originallyActiveLink) {
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
                    submenus.forEach(sub => {
                        if (sub !== targetSubmenu && sub.classList.contains('show')) {
                            sub.classList.remove('show');
                        }
                    });
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
            
            document.querySelectorAll('#main-nav-list .nav-link').forEach(link => {
                if (link.classList.contains('active') && link !== originallyActiveLink) {
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

                if (originallyActiveLink && originallyActiveLink.classList.contains('active') && mainLink !== originallyActiveLink) {
                    originallyActiveLink.classList.remove('active');
                }

                if (!mainLink.classList.contains('active')) {
                    mainLink.classList.add('highlight');
                }
            }
        });
        submenu.addEventListener('mouseleave', () => {
            isMouseOverSubmenu = false;
            hideTimer = setTimeout(checkAndHideMenu, 200);
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
    } else if (currentPath.includes('adminArticle')) {
        const articleManageItem = document.querySelector('.nav-item[data-menu="article-manage"]');
        const articleManageSubmenu = document.querySelector('.submenu[data-menu="article-manage"]');

        if (articleManageItem && articleManageSubmenu) {
            const itemRect = articleManageItem.getBoundingClientRect();
            articleManageSubmenu.style.paddingTop = `${itemRect.top}px`;
            requestAnimationFrame(() => {
                articleManageSubmenu.classList.add('show');
            });
        }
    }
});
