
document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('submenu-content-area');
    const tabLinks = document.querySelectorAll('.content-nav .tab-link');
    let currentTab = 'add'; 

    const messageArea = document.createElement('div');
    messageArea.id = 'status-message';
    messageArea.style.cssText = `
        margin-top: 20px;
        padding: 10px;
        border-radius: 8px;
        font-weight: bold;
        text-align: center;
        display: none; /* 초기에는 숨김 */
    `;
    document.getElementById('main-content').appendChild(messageArea);

    window.showMessage = (message, isSuccess = true) => {
        messageArea.textContent = message;
        messageArea.style.backgroundColor = isSuccess ? '#e6ffe6' : '#ffe6e6';
        messageArea.style.color = isSuccess ? '#2e7d32' : '#d32f2f';
        messageArea.style.display = 'block';
        setTimeout(() => {
            messageArea.style.display = 'none';
            messageArea.textContent = '';
        }, 3000);
    };

    const contentMap = {
        'add': `
            <h2>서브메뉴 추가</h2>
            <p>새로운 서브메뉴 항목을 생성합니다. 상위 메뉴를 반드시 선택해야 합니다.</p>
            <form id="addSubmenuForm">
                <div class="form-group">
                    <label for="add-menu-id">상위 메뉴 선택</label>
                    <select id="add-menu-id" name="menu_id" class="form-control" required>
                        <option value="" selected disabled>-- 필수로 선택해주세요 --</option>
                        <option value="1">공식 배포 룰</option>
                        <option value="2">비공식 배포 룰</option>
                        <option value="3">자체 제작 룰</option>
                    </select>
                    <small id="menu-id-error" style="color: red; display: none; margin-top: 5px;">상위 메뉴를 선택해야 합니다.</small>
                </div>
                <div class="form-group">
                    <label for="add-submenu-name">서브메뉴 이름</label>
                    <input type="text" id="add-submenu-name" name="submenu_name" class="form-control" placeholder="-- 필수로 입력해주세요 --" required>
                </div>
                <div class="form-group">
                    <label for="add-descript">서브메뉴 설명</label>
                    <input type="text" id="add-descript" name="descript" class="form-control" placeholder="">
                </div>
                <button type="submit" class="btn btn-primary">추가하기</button>
            </form>
        `,
        'delete': `
            <h2>서브메뉴 삭제</h2>
            <p>선택한 서브메뉴 항목을 삭제합니다. 삭제된 데이터는 복구할 수 없습니다.</p>
            <form id="deleteSubmenuForm">
                <div class="form-group">
                    <label for="delete-submenu-id">서브메뉴 선택</label>
                    <select id="delete-submenu-id" name="submenu_id" class="form-control" required>
                        <option value="" selected disabled>-- 삭제할 서브메뉴를 선택하세요 --</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-danger">삭제하기</button>
            </form>
        `
    };

    const showTab = (tabId) => {
        tabLinks.forEach(link => link.classList.remove('active'));
        const activeTabLink = document.querySelector(`.tab-link[data-tab="${tabId}"]`);
        if (activeTabLink) {
            activeTabLink.classList.add('active');
        }

        contentArea.innerHTML = contentMap[tabId] || '<h2>콘텐츠 없음</h2>';

        if (tabId === 'add') {
            const addForm = document.getElementById('addSubmenuForm');
            if (addForm) {
                addForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const menuId = document.getElementById('add-menu-id').value;
                    const submenuName = document.getElementById('add-submenu-name').value;
                    const descript = document.getElementById('add-descript').value;

                    if (!menuId) {
                        const menuIdError = document.getElementById('menu-id-error');
                        if (menuIdError) menuIdError.style.display = 'block';
                        window.showMessage('상위 메뉴를 선택해야 합니다.', false);
                        return;
                    } else {
                        const menuIdError = document.getElementById('menu-id-error');
                        if (menuIdError) menuIdError.style.display = 'none';
                    }

                    if (!submenuName.trim()) {
                        window.showMessage('서브메뉴 이름을 입력해주세요.', false);
                        return;
                    }

                    const apiUrl = `/admin/adminsubmenu`;
                    const formData = new URLSearchParams();
                    formData.append('submenu_name', submenuName);
                    formData.append('menu_id', menuId);
                    formData.append('descript', descript);
                    formData.append('action', 'add');

                    try {
                        const response = await fetch(apiUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: formData.toString()
                        });
                        
                        if (response.status === 201) {
                            window.showMessage('서브메뉴가 성공적으로 추가되었습니다!', true);
                            addForm.reset();
                            document.getElementById('add-menu-id').value = "";
                        } else {
                            window.showMessage(`서브메뉴 추가 실패: ${response.status} ${response.statusText}`, false);
                            console.error('서브메뉴 추가 실패:', response.status, response.statusText);
                        }
                    } catch (error) {
                        console.error('API 호출 중 오류 발생:', error);
                        window.showMessage('API 호출 중 오류가 발생했습니다.', false);
                    }
                });
            }
        } else if (tabId === 'delete') {
            const deleteForm = document.getElementById('deleteSubmenuForm');
            if (deleteForm) {
                fetchSubmenus();

                deleteForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const submenuId = document.getElementById('delete-submenu-id').value;

                    if (!submenuId) {
                        window.showMessage('삭제할 서브메뉴를 선택해야 합니다.', false);
                        return;
                    }

                    const apiUrl = `/admin/adminsubmenu`;
                    const formData = new URLSearchParams();
                    formData.append('submenu_id', submenuId);
                    formData.append('action', 'delete');

                    try {
                        const response = await fetch(apiUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: formData.toString()
                        });

                        if (response.status === 200) {
                            window.showMessage('서브메뉴가 성공적으로 삭제되었습니다.', true);
                            deleteForm.reset();
                            fetchSubmenus();
                        } else {
                            window.showMessage(`삭제 실패: ${response.status} ${response.statusText}`, false);
                        }
                    } catch (error) {
                        console.error('API 호출 중 오류 발생:', error);
                        window.showMessage('API 호출 중 오류가 발생했습니다.', false);
                    }
                });
            }
        }
        
        if (messageArea) {
            messageArea.style.display = 'none';
            messageArea.textContent = '';
        }
    };

    const fetchSubmenus = async () => {
        const selectElement = document.getElementById('delete-submenu-id');
        if (!selectElement) return;
        
        selectElement.innerHTML = `<option value="" selected disabled>-- 서브메뉴 목록을 불러오는 중... --</option>`;

        try {
            const response = await fetch('/admin/adminsubmenu');
            const submenus = await response.json();

            selectElement.innerHTML = `<option value="" selected disabled>-- 삭제할 서브메뉴를 선택하세요 --</option>`;
            submenus.forEach(submenu => {
                const option = document.createElement('option');
                option.value = submenu.id;
                option.textContent = submenu.name;
                selectElement.appendChild(option);
            });
        } catch (error) {
            console.error('서브메뉴 목록을 불러오는 데 실패했습니다:', error);
            selectElement.innerHTML = `<option value="" selected disabled>-- 서브메뉴 목록을 불러오는 데 실패했습니다 --</option>`;
        }
    };

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = e.target.dataset.tab;
            if (currentTab !== tabId) {
                currentTab = tabId;
                const newUrl = `${window.location.pathname}?submenu=${tabId}`;
                history.pushState({tab: tabId}, '', newUrl);
                showTab(tabId);
            }
        });
    });

    window.addEventListener('popstate', () => {
        const params = new URLSearchParams(window.location.search);
        const tabFromUrl = params.get('submenu') || 'add';
        if (currentTab !== tabFromUrl) {
            currentTab = tabFromUrl;
            showTab(currentTab);
        }
    });

    const params = new URLSearchParams(window.location.search);
    const initialTab = params.get('submenu') || 'add';
    currentTab = initialTab;
    showTab(currentTab);
});
