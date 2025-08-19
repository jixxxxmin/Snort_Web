
document.addEventListener('DOMContentLoaded', function() {
    const menuUrl = 'getmenu';
    const mainMenu = document.getElementById('main-menu');

    fetch(menuUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
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

                titleDiv.addEventListener('click', () => {
                    const isActive = mainLi.classList.contains('active');

                    document.querySelectorAll('.main-menu-item').forEach(item => {
                        item.classList.remove('active');
                    });

                    if (!isActive) {
                        mainLi.classList.add('active');
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error fetching menu data:', error);
            mainMenu.innerHTML = '<li>메뉴를 불러오는 데 실패했습니다.</li>';
        });
});
