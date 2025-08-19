document.addEventListener('DOMContentLoaded', function() {
    const menuUrl = 'getmenu';
    const mainMenu = document.getElementById('main-menu');

    fetch(menuUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data) return;

            data.forEach(mainMenuItem => {
                const mainLi = document.createElement('li');
                mainLi.className = 'main-menu-item';

                const titleDiv = document.createElement('div');
                titleDiv.className = 'main-menu-title';
                titleDiv.textContent = mainMenuItem.이름;

                const subMenuUl = document.createElement('ul');
                subMenuUl.className = 'submenu';

                if (mainMenuItem.메뉴 && mainMenuItem.메뉴.length > 0) {
                    // 서브메뉴 배열을 '이름' 프로퍼티 기준으로 오름차순 정렬합니다.
                    mainMenuItem.메뉴.sort((a, b) => a.이름.localeCompare(b.이름));
                    
                    // 정렬된 배열을 사용하여 서브메뉴 항목을 생성합니다.
                    mainMenuItem.메뉴.forEach(subMenuItem => {
                        const subLi = document.createElement('li');
                        const subLink = document.createElement('a');
                        subLink.href = '#';
                        subLink.textContent = subMenuItem.이름;
                        subLink.title = subMenuItem.설명;

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
            mainMenu.innerHTML = `<li>메뉴를 불러오는 데 실패했습니다. (${error.message})</li>`;
        });
});
