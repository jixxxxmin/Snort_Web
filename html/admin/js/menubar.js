
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
            console.log(`[setActiveLink] "${activeLinkElement.textContent.trim()}"에 'active' 클래스 추가됨.`);
        }

        originallyActiveLink = activeLinkElement;
        console.log(`[setActiveLink] originallyActiveLink 설정됨:`, originallyActiveLink ? originallyActiveLink.textContent.trim() : '없음');
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
                console.log(`[removeAllHighlights] "${link.textContent.trim()}"에서 'highlight' 클래스 제거됨.`);
            }
        });
    };

    const checkAndHideMenu = () => {
        if (!isMouseOverSidebar && !isMouseOverSubmenu) {
            hideAllInternal();
        } else {
            console.log(`[checkAndHideMenu] 마우스가 메뉴 영역 위에 있으므로 숨기지 않음.`);
        }
    };

    const hideAllInternal = () => {
        removeAllHighlights();
        submenus.forEach(submenu => {
            if (submenu.classList.contains('show')) {
                submenu.classList.remove('show');
                console.log(`[hideAllInternal] 서브메뉴 "${submenu.dataset.menu}" 숨김.`);
            }
            submenu.style.paddingTop = '';
        });
        document.querySelectorAll('#main-nav-list .nav-link.highlight').forEach(link => {
             if (link !== originallyActiveLink) {
                link.classList.remove('highlight');
                console.log(`[hideAllInternal - Cleanup] "${link.textContent.trim()}"에서 남은 'highlight' 클래스 제거됨.`);
             }
        });

        if (!isMouseOverSidebar && !isMouseOverSubmenu && originallyActiveLink && !originallyActiveLink.classList.contains('active')) {
             clearTimeout(restoreActiveTimer);
             restoreActiveTimer = setTimeout(() => {
                const currentlyActive = document.querySelector('#main-nav-list .nav-link.active');
                if (!currentlyActive) {
                    originallyActiveLink.classList.add('active');
                    console.log(`[hideAllInternal - Restore] "${originallyActiveLink.textContent.trim()}"에 'active' 클래스 다시 추가됨.`);
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
            console.log(`[sidebar] 마우스 사이드바 진입. isMouseOverSidebar: ${isMouseOverSidebar}`);
        });

        sidebar.addEventListener('mouseleave', () => {
            isMouseOverSidebar = false;
            console.log(`[sidebar] 마우스 사이드바 이탈. isMouseOverSidebar: ${isMouseOverSidebar}. ${200}ms 후 메뉴 숨김 확인 시작.`);
            hideTimer = setTimeout(checkAndHideMenu, 200);
        });
    }

    menuItems.forEach(item => {
        const navLink = item.querySelector('.nav-link');

        item.addEventListener('mouseenter', () => {
            console.log(`[mouseenter] 메뉴 아이템 "${navLink.textContent.trim()}"에 마우스 진입`);
            clearTimeout(hideTimer);
            clearTimeout(restoreActiveTimer);

            document.querySelectorAll('#main-nav-list .nav-link').forEach(link => {
                if (link !== originallyActiveLink && link.classList.contains('active')) {
                    link.classList.remove('active');
                    console.log(`[mouseenter] "${link.textContent.trim()}"에서 불필요한 'active' 제거됨.`);
                }
                if (link.classList.contains('highlight')) {
                    link.classList.remove('highlight');
                    console.log(`[mouseenter] "${link.textContent.trim()}"에서 'highlight' 제거됨.`);
                }
            });

            if (originallyActiveLink && originallyActiveLink.classList.contains('active')) {
                originallyActiveLink.classList.remove('active');
                console.log(`[mouseenter] 원래 활성 링크 "${originallyActiveLink.textContent.trim()}"에서 'active' 클래스 제거됨.`);
            }

            if (navLink !== originallyActiveLink) {
                navLink.classList.add('highlight');
                console.log(`[mouseenter] "${navLink.textContent.trim()}"에 'highlight' 클래스 추가됨.`);
            } else {
                navLink.classList.add('active');
                console.log(`[mouseenter] "${navLink.textContent.trim()}"에 'active' 클래스 유지/다시 추가됨.`);
            }

            const menuId = item.dataset.menu;
            const targetSubmenu = document.querySelector(`.submenu[data-menu="${menuId}"]`);
            if (targetSubmenu) {
                const itemRect = item.getBoundingClientRect();
                targetSubmenu.style.paddingTop = `${itemRect.top}px`;
                requestAnimationFrame(() => {
                    targetSubmenu.classList.add('show');
                    console.log(`[mouseenter] 서브메뉴 "${menuId}" 표시됨.`);
                });
            }
        });

        item.addEventListener('mouseleave', () => {
            console.log(`[mouseleave] 메뉴 아이템 "${navLink.textContent.trim()}"에서 마우스 이탈. ${200}ms 후 숨김 시작.`);
            hideTimer = setTimeout(checkAndHideMenu, 200);
        });
    });

    submenus.forEach(submenu => {
        submenu.addEventListener('mouseenter', () => {
            console.log(`[mouseenter] 서브메뉴 "${submenu.dataset.menu}"에 마우스 진입`);
            isMouseOverSubmenu = true;
            clearTimeout(hideTimer);
            clearTimeout(restoreActiveTimer);
            
            document.querySelectorAll('#main-nav-list .nav-link').forEach(link => {
                if (link !== originallyActiveLink && link.classList.contains('active')) {
                    link.classList.remove('active');
                    console.log(`[mouseenter - Submenu] "${link.textContent.trim()}"에서 불필요한 'active' 제거됨.`);
                }
                if (link.classList.contains('highlight')) {
                    link.classList.remove('highlight');
                    console.log(`[mouseenter - Submenu] "${link.textContent.trim()}"에서 'highlight' 제거됨.`);
                }
            });

            const menuId = submenu.dataset.menu;
            const correspondingItem = document.querySelector(`.nav-item[data-menu="${menuId}"]`);
            if (correspondingItem) {
                const mainLink = correspondingItem.querySelector('.nav-link');

                if (originallyActiveLink && originallyActiveLink.classList.contains('active')) {
                    originallyActiveLink.classList.remove('active');
                    console.log(`[mouseenter - Submenu] 원래 활성 링크 "${originallyActiveLink.textContent.trim()}"에서 'active' 클래스 제거됨.`);
                }

                if (mainLink !== originallyActiveLink) {
                    mainLink.classList.add('highlight');
                    console.log(`[mouseenter - Submenu] "${mainLink.textContent.trim()}"에 'highlight' 클래스 추가됨.`);
                } else {
                    mainLink.classList.add('active');
                    console.log(`[mouseenter - Submenu] "${mainLink.textContent.trim()}"에 'active' 클래스 유지/다시 추가됨.`);
                }
            }
        });
        submenu.addEventListener('mouseleave', () => {
            console.log(`[mouseleave] 서브메뉴 "${submenu.dataset.menu}"에서 마우스 이탈. ${200}ms 후 숨김 시작.`);
            isMouseOverSubmenu = false;
            hideTimer = setTimeout(checkAndHideMenu, 200);
        });
    });
});
