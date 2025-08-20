
document.addEventListener('DOMContentLoaded', function() {
    const cachedMenu = localStorage.getItem('cachedMenu');
    
    if (cachedMenu) {
        console.log('캐시된 메뉴 데이터를 사용합니다.');
        try {
            const data = JSON.parse(cachedMenu);
            renderMenu(data);
        } catch (e) {
            console.error('캐시 데이터 파싱 오류:', e);
            fetchAndRenderMenu();
        }
    } else {
        console.log('캐시가 없어 서버에서 새로 가져옵니다.');
        fetchAndRenderMenu();
    }
});

function fetchAndRenderMenu() {
    fetch('/board/getmenu')
        .then(response => response.json())
        .then(data => {
            if (!data) return;

            localStorage.setItem('cachedMenu', JSON.stringify(data));
            renderMenu(data);
        })
        .catch(error => console.error('메뉴 데이터를 가져오는 중 오류 발생:', error));
}

function renderMenu(data) {
    const mainMenu = document.getElementById('main-menu');
    mainMenu.innerHTML = '';
    
    const currentQuery = new URLSearchParams(window.location.search);
    const currentMenuId = currentQuery.get('menu_id');
    const currentSubmenuId = currentQuery.get('submenu_id');

    data.forEach(mainMenuItem => {
        const mainLi = document.createElement('li');
        mainLi.className = 'main-menu-item';
        mainLi.dataset.menuId = mainMenuItem.id; 

        const titleDiv = document.createElement('div');
        titleDiv.className = 'main-menu-title';
        titleDiv.textContent = mainMenuItem.이름;
        
        titleDiv.addEventListener('click', () => {
            document.querySelectorAll('.submenu a').forEach(link => link.classList.remove('submenu-active'));
            const isPinned = mainLi.classList.contains('pinned');
            document.querySelectorAll('.main-menu-item').forEach(item => item.classList.remove('pinned'));
            if (!isPinned) {
                mainLi.classList.add('pinned');
            }
            window.fetchBoardPosts('menu_id', mainLi.dataset.menuId);
        });

        const subMenuUl = document.createElement('ul');
        subMenuUl.className = 'submenu';

        if (mainMenuItem.메뉴 && mainMenuItem.메뉴.length > 0) {
            mainMenuItem.메뉴.sort((a, b) => a.이름.localeCompare(b.이름));
            
            mainMenuItem.메뉴.forEach(subMenuItem => {
                const subLi = document.createElement('li');
                const subLink = document.createElement('a');
                subLink.href = '#';
                subLink.textContent = subMenuItem.이름;
                subLink.title = subMenuItem.설명;
                subLink.dataset.submenuId = subMenuItem.id;
                
                subLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.querySelectorAll('.main-menu-item').forEach(item => item.classList.remove('pinned'));
                    document.querySelectorAll('.submenu a').forEach(link => link.classList.remove('submenu-active'));
                    subLink.classList.add('submenu-active');
                    
                    const parentMainMenu = subLink.closest('.main-menu-item');
                    if (parentMainMenu) {
                        parentMainMenu.classList.add('pinned');
                    }
                    window.fetchBoardPosts('submenu_id', subLink.dataset.submenuId);
                });
                
                subLink.addEventListener('mouseover', () => {
                    titleDiv.classList.add('parent-hover');
                });
                subLink.addEventListener('mouseout', () => {
                    titleDiv.classList.remove('parent-hover');
                });

                subLi.appendChild(subLink);
                subMenuUl.appendChild(subLi);
                
                if (currentSubmenuId === subMenuItem.id) {
                    subLink.classList.add('submenu-active');
                    mainLi.classList.add('pinned');
                }
            });
        }
        
        mainLi.appendChild(titleDiv);
        mainLi.appendChild(subMenuUl);
        mainMenu.appendChild(mainLi);

        if (currentMenuId === mainMenuItem.id && !currentSubmenuId) {
            mainLi.classList.add('pinned');
        }
    });
}
