
document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('submenu-content-area');
    const tabLinks = document.querySelectorAll('.content-nav .tab-link');
    let currentTab = 'add';
    let allMenusData = [];

    const messageArea = document.createElement('div');
    messageArea.id = 'status-message';
    messageArea.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 600px;
        max-width: 90%;
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: bold;
        text-align: center;
        display: none;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1000; /* 다른 요소 위에 표시되도록 z-index 설정 */
    `;
    document.body.appendChild(messageArea);

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
                <button type="submit" class="btn btn-primary">삭제하기</button>
            </form>
        `,
        'update': `
            <h2>서브메뉴 수정</h2>
            <p>선택한 서브메뉴 항목의 정보를 수정합니다. 변경 사항을 저장하려면 모든 필수 필드를 채워야 합니다.</p>
            <form id="updateSubmenuForm">
                <div class="form-group">
                    <label for="update-select-submenu-id">수정할 서브메뉴 선택</label>
                    <select id="update-select-submenu-id" name="selected_submenu_id" class="form-control" required>
                        <option value="" selected disabled>-- 수정할 서브메뉴를 선택하세요 --</option>
                    </select>
                    <small id="update-select-submenu-id-error" style="color: red; display: none; margin-top: 5px;">수정할 서브메뉴를 선택해야 합니다.</small>
                </div>
                <div class="form-group">
                    <label for="update-menu-id">상위 메뉴 선택</label>
                    <select id="update-menu-id" name="menu_id" class="form-control" required>
                        <option value="" selected disabled>-- 필수로 선택해주세요 --</option>
                        <!-- 메뉴 옵션은 JS에서 동적으로 채워집니다. -->
                    </select>
                    <small id="update-menu-id-error" style="color: red; display: none; margin-top: 5px;">상위 메뉴를 선택해야 합니다.</small>
                </div>
                <div class="form-group">
                    <label for="update-submenu-name">서브메뉴 이름</label>
                    <input type="text" id="update-submenu-name" name="submenu_name" class="form-control" placeholder="-- 필수로 입력해주세요 --" required>
                </div>
                <div class="form-group">
                    <label for="update-descript">서브메뉴 설명</label>
                    <input type="text" id="update-descript" name="descript" class="form-control" placeholder="">
                </div>
                <input type="hidden" id="update-submenu-id" name="submenu_id"> <!-- 실제 업데이트에 사용될 서브메뉴 ID -->
                <button type="submit" class="btn btn-primary">수정하기</button>
            </form>
        `
    };

    // 'add' 탭 폼 제출을 위한 함수
    const submitAddForm = async (addForm) => {
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
                
                fetchAndStoreMenuData();
            } else {
                window.showMessage(`서브메뉴 추가 실패: ${response.status} ${response.statusText}`, false);
                console.error('서브메뉴 추가 실패:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('API 호출 중 오류 발생:', error);
            window.showMessage('API 호출 중 오류가 발생했습니다.', false);
        }
    };

    // 'delete' 탭 폼 제출을 위한 함수
    const submitDeleteForm = async (deleteForm) => {
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

            if (response.status === 201) {
                window.showMessage('서브메뉴가 성공적으로 삭제되었습니다.', true);
                deleteForm.reset();
                fetchAndStoreMenuData();
            } else {
                window.showMessage(`삭제 실패: ${response.status} ${response.statusText}`, false);
            }
        } catch (error) {
            console.error('API 호출 중 오류 발생:', error);
            window.showMessage('API 호출 중 오류가 발생했습니다.', false);
        }
    };

    // 'update' 탭 폼 제출을 위한 함수
    const submitUpdateForm = async (updateForm) => {
        const submenuId = document.getElementById('update-submenu-id').value;
        const menuId = document.getElementById('update-menu-id').value;
        const submenuName = document.getElementById('update-submenu-name').value;
        const descript = document.getElementById('update-descript').value;

        if (!submenuId) {
            const submenuSelectError = document.getElementById('update-select-submenu-id-error');
            if (submenuSelectError) submenuSelectError.style.display = 'block';
            window.showMessage('수정할 서브메뉴를 선택해야 합니다.', false);
            return;
        } else {
            const submenuSelectError = document.getElementById('update-select-submenu-id-error');
            if (submenuSelectError) submenuSelectError.style.display = 'none';
        }

        if (!menuId) {
            const menuIdError = document.getElementById('update-menu-id-error');
            if (menuIdError) menuIdError.style.display = 'block';
            window.showMessage('상위 메뉴를 선택해야 합니다.', false);
            return;
        } else {
            const menuIdError = document.getElementById('update-menu-id-error');
            if (menuIdError) menuIdError.style.display = 'none';
        }

        if (!submenuName.trim()) {
            window.showMessage('서브메뉴 이름을 입력해주세요.', false);
            return;
        }

        const apiUrl = `/admin/adminsubmenu`;
        const formData = new URLSearchParams();
        formData.append('submenu_id', submenuId);
        formData.append('menu_id', menuId);
        formData.append('submenu_name', submenuName);
        formData.append('descript', descript);
        formData.append('action', 'update');

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            });

            if (response.status === 201) {
                window.showMessage('서브메뉴가 성공적으로 수정되었습니다!', true);
                updateForm.reset();
                document.getElementById('update-select-submenu-id').value = "";
                fetchAndStoreMenuData();
                
                document.getElementById('update-menu-id').disabled = true;
                document.getElementById('update-submenu-name').disabled = true;
                document.getElementById('update-descript').disabled = true;
                updateForm.querySelector('button[type="submit"]').disabled = true;
            } else {
                window.showMessage(`서브메뉴 수정 실패: ${response.status} ${response.statusText}`, false);
                console.error('서브메뉴 수정 실패:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('API 호출 중 오류 발생:', error);
            window.showMessage('API 호출 중 오류가 발생했습니다.', false);
        }
    };

    const fetchAndStoreMenuData = async () => {
        try {
            const response = await fetch('http://192.168.207.134/admin/admingetmenu');
            const data = await response.json();
            allMenusData = data;
            
            const deleteSelectElement = document.getElementById('delete-submenu-id');
            if (deleteSelectElement) {
                deleteSelectElement.innerHTML = `<option value="" selected disabled>-- 삭제할 서브메뉴를 선택하세요 --</option>`;
                if (data.length === 0 || data.every(menu => !menu.submenu || menu.submenu.length === 0)) {
                    deleteSelectElement.innerHTML += `<option value="" disabled>-- 서브메뉴가 존재하지 않습니다 --</option>`;
                } else {
                    data.forEach(menu => {
                        if (menu.submenu && menu.submenu.length > 0) {
                            const optgroup = document.createElement('optgroup');
                            optgroup.label = menu.menu_name;
                            menu.submenu.forEach(submenu => {
                                const option = document.createElement('option');
                                option.value = submenu.sub_id;
                                option.textContent = `- ${submenu.sub_name}`;
                                optgroup.appendChild(option);
                            });
                            deleteSelectElement.appendChild(optgroup);
                        }
                    });
                }
            }

            const updateSelectSubmenuId = document.getElementById('update-select-submenu-id');
            if (updateSelectSubmenuId) {
                updateSelectSubmenuId.innerHTML = `<option value="" selected disabled>-- 수정할 서브메뉴를 선택하세요 --</option>`;
                if (data.length === 0 || data.every(menu => !menu.submenu || menu.submenu.length === 0)) {
                    updateSelectSubmenuId.innerHTML += `<option value="" disabled>-- 서브메뉴가 존재하지 않습니다 --</option>`;
                } else {
                    data.forEach(menu => {
                        if (menu.submenu && menu.submenu.length > 0) {
                            const optgroup = document.createElement('optgroup');
                            optgroup.label = menu.menu_name;
                            menu.submenu.forEach(submenu => {
                                const option = document.createElement('option');
                                option.value = submenu.sub_id;
                                option.textContent = `- ${submenu.sub_name}`;
                                optgroup.appendChild(option);
                            });
                            updateSelectSubmenuId.appendChild(optgroup);
                        }
                    });
                }
            }

            const updateMenuIdSelect = document.getElementById('update-menu-id');
            if (updateMenuIdSelect) {
                updateMenuIdSelect.innerHTML = `<option value="" selected disabled>-- 필수로 선택해주세요 --</option>`;
                data.forEach(menu => {
                    const option = document.createElement('option');
                    option.value = menu.id;
                    option.textContent = menu.menu_name;
                    updateMenuIdSelect.appendChild(option);
                });
            }

        } catch (error) {
            console.error('메뉴 및 서브메뉴 목록을 불러오는 데 실패했습니다:', error);
            const errorOption = `<option value="" selected disabled>-- 목록을 불러오는 데 실패했습니다 --</option>`;
            const deleteSelectElement = document.getElementById('delete-submenu-id');
            if (deleteSelectElement) deleteSelectElement.innerHTML = errorOption;
            const updateSelectSubmenuId = document.getElementById('update-select-submenu-id');
            if (updateSelectSubmenuId) updateSelectSubmenuId.innerHTML = errorOption;
            const updateMenuIdSelect = document.getElementById('update-menu-id');
            if (updateMenuIdSelect) updateMenuIdSelect.innerHTML = errorOption;
        }
    };

    const populateUpdateForm = (submenuId) => {
        let selectedSubmenu = null;
        for (const menu of allMenusData) {
            if (menu.submenu) {
                selectedSubmenu = menu.submenu.find(sub => sub.sub_id === submenuId);
                if (selectedSubmenu) {
                    selectedSubmenu.parent_menu_id = menu.id;
                    break;
                }
            }
        }

        const updateMenuId = document.getElementById('update-menu-id');
        const updateSubmenuName = document.getElementById('update-submenu-name');
        const updateDescript = document.getElementById('update-descript');
        const hiddenSubmenuId = document.getElementById('update-submenu-id');
        const updateFormBtn = document.querySelector('#updateSubmenuForm button[type="submit"]');


        if (selectedSubmenu) {
            hiddenSubmenuId.value = selectedSubmenu.sub_id;
            updateMenuId.value = selectedSubmenu.parent_menu_id;
            updateSubmenuName.value = selectedSubmenu.sub_name;
            updateDescript.value = selectedSubmenu.sub_descript || '';

            updateMenuId.disabled = false;
            updateSubmenuName.disabled = false;
            updateDescript.disabled = false;
            updateFormBtn.disabled = false;
        } else {
            hiddenSubmenuId.value = '';
            updateMenuId.value = '';
            updateSubmenuName.value = '';
            updateDescript.value = '';

            updateMenuId.disabled = true;
            updateSubmenuName.disabled = true;
            updateDescript.disabled = true;
            updateFormBtn.disabled = true;
        }
    };


    const showTab = (tabId) => {
        tabLinks.forEach(link => link.classList.remove('active'));
        const activeTabLink = document.querySelector(`.tab-link[data-tab="${tabId}"]`);
        if (activeTabLink) {
            activeTabLink.classList.add('active');
        }

        contentArea.innerHTML = contentMap[tabId] || '<h2>콘텐츠 없음</h2>';

        if (messageArea) {
            messageArea.style.display = 'none';
            messageArea.textContent = '';
        }

        if (tabId === 'add') {
            const addForm = document.getElementById('addSubmenuForm');
            if (addForm) {
                addForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    submitAddForm(addForm);
                });
            }
        } else if (tabId === 'delete') {
            const deleteForm = document.getElementById('deleteSubmenuForm');
            if (deleteForm) {
                fetchAndStoreMenuData();
                deleteForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    submitDeleteForm(deleteForm);
                });
            }
        } else if (tabId === 'update') {
            const updateForm = document.getElementById('updateSubmenuForm');
            if (updateForm) {
                fetchAndStoreMenuData();
                
                document.getElementById('update-menu-id').disabled = true;
                document.getElementById('update-submenu-name').disabled = true;
                document.getElementById('update-descript').disabled = true;
                updateForm.querySelector('button[type="submit"]').disabled = true;


                const updateSelectSubmenuId = document.getElementById('update-select-submenu-id');
                if (updateSelectSubmenuId) {
                    updateSelectSubmenuId.addEventListener('change', (e) => {
                        populateUpdateForm(e.target.value);
                    });
                }

                updateForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    submitUpdateForm(updateForm);
                });
            }
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
    fetchAndStoreMenuData();
});
