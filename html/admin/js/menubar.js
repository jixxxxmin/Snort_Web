document.addEventListener('DOMContentLoaded', () => {
    let originallyActiveLink = null;
    let isMouseOverSidebar = false; // 사이드바 위에 마우스가 있는지 추적하는 변수
    let isMouseOverSubmenu = false; // 서브메뉴 위에 마우스가 있는지 추적하는 변수

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
    let hideTimer; // 서브메뉴 숨김 타이머 (메뉴 항목 및 서브메뉴 공용)
    let restoreActiveTimer; // 원래 활성 링크 복원 타이머

    const removeAllHighlights = () => {
        menuItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            if (link.classList.contains('highlight')) {
                link.classList.remove('highlight');
                console.log(`[removeAllHighlights] "${link.textContent.trim()}"에서 'highlight' 클래스 제거됨.`);
            }
        });
    };

    // 마우스가 메뉴 영역을 완전히 벗어났는지 확인 후 메뉴를 숨기는 함수
    const checkAndHideMenu = () => {
        // 마우스가 사이드바 위에도, 서브메뉴 위에도 없을 때만 숨김 처리
        if (!isMouseOverSidebar && !isMouseOverSubmenu) {
            hideAllInternal(); // 실제 숨김 로직 호출
        } else {
            console.log(`[checkAndHideMenu] 마우스가 메뉴 영역 위에 있으므로 숨기지 않음.`);
        }
    };

    // 실제 메뉴 숨김 및 활성 링크 복원 로직
    const hideAllInternal = () => {
        removeAllHighlights();
        submenus.forEach(submenu => {
            if (submenu.classList.contains('show')) {
                submenu.classList.remove('show');
                console.log(`[hideAllInternal] 서브메뉴 "${submenu.dataset.menu}" 숨김.`);
            }
            submenu.style.paddingTop = '';
        });
        // 이 시점에서는 highlight된 요소가 있다면 제거 (originallyActiveLink가 아닌 경우)
        document.querySelectorAll('#main-nav-list .nav-link.highlight').forEach(link => {
             if (link !== originallyActiveLink) {
                link.classList.remove('highlight');
                console.log(`[hideAllInternal - Cleanup] "${link.textContent.trim()}"에서 남은 'highlight' 클래스 제거됨.`);
             }
        });

        // 마우스가 사이드바나 서브메뉴 위에 없을 때만 원래 활성 링크 복원 시도
        if (!isMouseOverSidebar && !isMouseOverSubmenu && originallyActiveLink && !originallyActiveLink.classList.contains('active')) {
             clearTimeout(restoreActiveTimer); // 기존 복원 타이머가 있다면 취소
             restoreActiveTimer = setTimeout(() => {
                // 현재 active 클래스를 가진 링크가 없고, originallyActiveLink가 있다면 복원
                const currentlyActive = document.querySelector('#main-nav-list .nav-link.active');
                if (!currentlyActive) {
                    originallyActiveLink.classList.add('active');
                    console.log(`[hideAllInternal - Restore] "${originallyActiveLink.textContent.trim()}"에 'active' 클래스 다시 추가됨.`);
                }
             }, 50); // 짧은 지연 후 복원 시도
        }
    };

    const sidebar = document.getElementById('sidebar');

    if (sidebar) {
        sidebar.addEventListener('mouseenter', () => {
            isMouseOverSidebar = true;
            clearTimeout(hideTimer); // 숨김 타이머 초기화
            clearTimeout(restoreActiveTimer); // 복원 타이머 초기화
            console.log(`[sidebar] 마우스 사이드바 진입. isMouseOverSidebar: ${isMouseOverSidebar}`);
        });

        sidebar.addEventListener('mouseleave', () => {
            isMouseOverSidebar = false;
            console.log(`[sidebar] 마우스 사이드바 이탈. isMouseOverSidebar: ${isMouseOverSidebar}. ${200}ms 후 메뉴 숨김 확인 시작.`);
            // 사이드바를 떠날 때, 200ms 후 마우스 위치를 다시 확인하여 메뉴 숨김 여부 결정
            hideTimer = setTimeout(checkAndHideMenu, 200);
        });
    }

    menuItems.forEach(item => {
        const navLink = item.querySelector('.nav-link');

        item.addEventListener('mouseenter', () => {
            console.log(`[mouseenter] 메뉴 아이템 "${navLink.textContent.trim()}"에 마우스 진입`);
            clearTimeout(hideTimer); // 메뉴 아이템에 들어오면 숨김 타이머 초기화
            clearTimeout(restoreActiveTimer); // 혹시 모를 활성 링크 복원 타이머도 초기화

            // 모든 하이라이트 및 현재 active 링크(originallyActiveLink 제외) 제거
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

            // originallyActiveLink가 활성 상태이면 잠시 제거
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
            hideTimer = setTimeout(checkAndHideMenu, 200); // 200ms 후 checkAndHideMenu 호출
        });
    });

    submenus.forEach(submenu => {
        submenu.addEventListener('mouseenter', () => {
            console.log(`[mouseenter] 서브메뉴 "${submenu.dataset.menu}"에 마우스 진입`);
            isMouseOverSubmenu = true;
            clearTimeout(hideTimer); // 서브메뉴에 들어오면 숨김 타이머 초기화
            clearTimeout(restoreActiveTimer); // 혹시 모를 활성 링크 복원 타이머도 초기화
            
            // 서브메뉴에 마우스 들어왔을 때, 모든 하이라이트를 제거해야 함
            // 그리고 현재 활성 링크(originallyActiveLink 제외)도 제거
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
            hideTimer = setTimeout(checkAndHideMenu, 200); // 200ms 후 checkAndHideMenu 호출
        });
    });
});
