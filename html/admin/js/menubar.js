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
            console.log(`[setActiveLink] "${activeLinkElement.textContent.trim()}"에 'active' 클래스 추가됨.`);
        }

        originallyActiveLink = activeLinkElement;
        console.log(`[setActiveLink] originallyActiveLink 설정됨:`, originallyActiveLink ? originallyActiveLink.textContent.trim() : '없음');
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
                console.log(`[removeAllHighlights] "${link.textContent.trim()}"에서 'highlight' 클래스 제거됨.`);
            }
        });
    };

    const hideAll = () => {
        removeAllHighlights();
        submenus.forEach(submenu => {
            if (submenu.classList.contains('show')) {
                submenu.classList.remove('show');
                console.log(`[hideAll] 서브메뉴 "${submenu.dataset.menu}" 숨김.`);
            }
            submenu.style.paddingTop = '';
        });
        // 사이드바 leave 시 active 복원 로직이 끝난 후, highlight된 요소가 있다면 다시 제거
        // 원래 active였던 요소가 아닌데 highlight가 남아있다면 제거
        document.querySelectorAll('#main-nav-list .nav-link.highlight').forEach(link => {
             if (link !== originallyActiveLink) { // originallyActiveLink가 아닌데 highlight가 있다면 제거
                link.classList.remove('highlight');
                console.log(`[hideAll - Cleanup] "${link.textContent.trim()}"에서 남은 'highlight' 클래스 제거됨.`);
             }
        });
    };

    const sidebar = document.getElementById('sidebar');

    menuItems.forEach(item => {
        const navLink = item.querySelector('.nav-link');

        item.addEventListener('mouseenter', () => {
            console.log(`[mouseenter] 메뉴 아이템 "${navLink.textContent.trim()}"에 마우스 진입`);
            clearTimeout(hideTimer);
            hideAll();

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
            hideTimer = setTimeout(hideAll, 200);
        });
    });

    submenus.forEach(submenu => {
        submenu.addEventListener('mouseenter', () => {
            console.log(`[mouseenter] 서브메뉴 "${submenu.dataset.menu}"에 마우스 진입`);
            clearTimeout(hideTimer);
            
            // 서브메뉴에 마우스 들어왔을 때, 모든 하이라이트를 제거해야 함
            removeAllHighlights();

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
            hideTimer = setTimeout(hideAll, 200);
        });
    });

    if (sidebar) {
        sidebar.addEventListener('mouseleave', () => {
            console.log(`[mouseleave] 사이드바 전체에서 마우스 이탈. ${250}ms 후 원래 활성 링크 복원 시도.`);
            setTimeout(() => {
                if (originallyActiveLink) {
                    document.querySelectorAll('#main-nav-list .nav-link').forEach(link => {
                        if (link.classList.contains('active')) {
                            link.classList.remove('active');
                            console.log(`[sidebar mouseleave - Cleanup] "${link.textContent.trim()}"에서 'active' 클래스 제거됨.`);
                        }
                        if (link.classList.contains('highlight')) { // 혹시 모를 highlight 잔상 제거
                             link.classList.remove('highlight');
                             console.log(`[sidebar mouseleave - Cleanup] "${link.textContent.trim()}"에서 'highlight' 클래스 제거됨.`);
                        }
                    });
                    originallyActiveLink.classList.add('active');
                    console.log(`[sidebar mouseleave - Restore] "${originallyActiveLink.textContent.trim()}"에 'active' 클래스 다시 추가됨.`);
                }
            }, 250);
        });
    }
});
