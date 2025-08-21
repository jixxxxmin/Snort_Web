
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

    const hideAll = () => {
        removeAllHighlights();
        submenus.forEach(submenu => {
            if (submenu.classList.contains('show')) {
                submenu.classList.remove('show');
                console.log(`[hideAll] 서브메뉴 "${submenu.dataset.menu}" 숨김.`);
            }
            submenu.style.paddingTop = '';
        });
        // 이 시점에서는 highlight된 요소가 있다면 제거 (originallyActiveLink가 아닌 경우)
        document.querySelectorAll('#main-nav-list .nav-link.highlight').forEach(link => {
             if (link !== originallyActiveLink) {
                link.classList.remove('highlight');
                console.log(`[hideAll - Cleanup] "${link.textContent.trim()}"에서 남은 'highlight' 클래스 제거됨.`);
             }
        });

        // hideAll이 완료되면 원래 활성 링크 복원 타이머 시작
        // 마우스가 사이드바를 완전히 벗어났을 때만 복원 로직 실행
        if (!isMouseOverSidebar && originallyActiveLink && !originallyActiveLink.classList.contains('active')) {
             clearTimeout(restoreActiveTimer); // 기존 복원 타이머가 있다면 취소
             restoreActiveTimer = setTimeout(() => {
                // 현재 active 클래스를 가진 링크가 없고, originallyActiveLink가 있다면 복원
                const currentlyActive = document.querySelector('#main-nav-list .nav-link.active');
                if (!currentlyActive) {
                    originallyActiveLink.classList.add('active');
                    console.log(`[hideAll - Restore] "${originallyActiveLink.textContent.trim()}"에 'active' 클래스 다시 추가됨.`);
                }
             }, 50); // 짧은 지연 후 복원 시도
        }
    };

    const sidebar = document.getElementById('sidebar');

    if (sidebar) {
        sidebar.addEventListener('mouseenter', () => {
            isMouseOverSidebar = true;
            clearTimeout(restoreActiveTimer); // 사이드바에 들어오면 복원 타이머 취소
            console.log(`[sidebar] 마우스 사이드바 진입. isMouseOverSidebar: ${isMouseOverSidebar}`);
        });

        sidebar.addEventListener('mouseleave', () => {
            isMouseOverSidebar = false;
            console.log(`[sidebar] 마우스 사이드바 이탈. isMouseOverSidebar: ${isMouseOverSidebar}. ${250}ms 후 활성 링크 복원 시도.`);
            // 사이드바를 떠날 때, hideAll이 이미 트리거되었다면 거기서 복원 로직을 처리.
            // 여기서는 단순히 isMouseOverSidebar 상태만 업데이트.
            // 실제 복원은 hideAll의 끝에서 또는 마우스가 완전히 벗어났을 때 처리.
            clearTimeout(hideTimer); // 모든 메뉴/서브메뉴 숨김 타이머가 있다면 즉시 실행
            hideAll(); // 즉시 모든 하이라이트/서브메뉴 숨김
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
            hideTimer = setTimeout(hideAll, 200); // 200ms 후 hideAll 호출
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
            hideTimer = setTimeout(hideAll, 200); // 200ms 후 hideAll 호출
        });
    });
});
