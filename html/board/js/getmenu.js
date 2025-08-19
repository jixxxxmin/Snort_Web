document.addEventListener('DOMContentLoaded', function() {
    const mainMenu = document.getElementById('main-menu');

    fetch('getmenu')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.error) {
                throw new Error(data.error || '메뉴 데이터가 비어있습니다.');
            }

            data.forEach(mainMenuItem => {
                const mainLi = document.createElement('li');
                mainLi.className = 'main-menu-item';
                mainLi.dataset.menuId = mainMenuItem.id; 

                const titleDiv = document.createElement('div');
                titleDiv.className = 'main-menu-title';
                titleDiv.textContent = mainMenuItem.이름;
                
                titleDiv.addEventListener('click', () => {
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
                            window.fetchBoardPosts('submenu_id', subLink.dataset.submenuId);
                        });

                        subLi.appendChild(subLink);
                        subMenuUl.appendChild(subLi);
                    });
                }

                mainLi.appendChild(titleDiv);
                mainLi.appendChild(subMenuUl);
                mainMenu.appendChild(mainLi);
            });
        })
        .catch(error => {
            console.error('Error fetching menu data:', error);
            mainMenu.innerHTML = '<li>메뉴 로딩 실패</li>';
        });
});
