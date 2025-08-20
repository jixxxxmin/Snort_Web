
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

            const urlParams = new URLSearchParams(window.location.search);
            const menuId = urlParams.get('menu_id');
            const submenuId = urlParams.get('submenu_id');

            if (menuId) {
                window.fetchBoardPosts('menu_id', menuId);
            } else if (submenuId) {
                window.fetchBoardPosts('submenu_id', submenuId);
            }
        })
        .catch(error => console.error('메뉴 데이터를 가져오는 중 오류 발생:', error));
}

function renderMenu(data) {
    const mainMenu = document.getElementById('main-menu');
    mainMenu.innerHTML = '';
    
    data.forEach(mainMenuItem => {
        const mainLi = document.createElement('li');
        mainLi.className = 'main-menu-item';
        mainLi.dataset.menuId = mainMenuItem.id; 
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'main-menu-title';
        titleDiv.textContent = mainMenuItem.이름;
        
        titleDiv.addEventListener('click', () => {
            window.fetchBoardPosts('menu_id', mainMenuItem.id);
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
                    window.fetchBoardPosts('submenu_id', subMenuItem.id);
                });
                
                subLink.addEventListener('mouseover', () => {
                    titleDiv.classList.add('parent-hover');
                });
                subLink.addEventListener('mouseout', () => {
                    titleDiv.classList.remove('parent-hover');
                });

                subLi.appendChild(subLink);
                subMenuUl.appendChild(subLi);
            });
        }

        mainLi.appendChild(titleDiv);
        mainLi.appendChild(subMenuUl);
        mainMenu.appendChild(mainLi);
    });
}
