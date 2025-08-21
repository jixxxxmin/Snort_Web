
document.addEventListener('DOMContentLoaded', () => {
    const setActiveLink = () => {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('#main-nav-list .nav-link');

        navLinks.forEach(link => {
            link.classList.remove('active'); 
        });

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            
            if (!linkHref) {
                const parentItem = link.closest('.has-submenu');
                if (parentItem) {
                    const menuId = parentItem.dataset.menu;
                    if (currentPath.includes('adminSubmenu') && menuId === 'menu-manage') {
                        link.classList.add('active');
                    }
                    if (currentPath.includes('adminArticle') && menuId === 'article-manage') {
                        link.classList.add('active');
                    }
                }
            } else {
                if (currentPath === linkHref || (currentPath.endsWith('/') && linkHref.endsWith('/admin'))) {
                    link.classList.add('active');
                }
            }
        });
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

    menuItems.forEach(item => {
        const navLink = item.querySelector('.nav-link');

        item.addEventListener('mouseenter', () => {
            clearTimeout(hideTimer);
            hideAll();
            
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
                if (!mainLink.classList.contains('active')) {
                    mainLink.classList.add('highlight');
                }
            }
        });
        submenu.addEventListener('mouseleave', () => {
            hideTimer = setTimeout(hideAll, 200);
        });
    });
});
