
const contentArea = document.getElementById('submenu-content-area');
const tabLinks = document.querySelectorAll('.content-nav .tab-link');

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
    `
};

window.showTab = (tabId) => {
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
                    if (menuIdError) {
                        menuIdError.style.display = 'block';
                    }
                    if (window.showMessage) {
                        window.showMessage('상위 메뉴를 선택해야 합니다.', false);
                    }
                    return;
                } else {
                    const menuIdError = document.getElementById('menu-id-error');
                    if (menuIdError) {
                        menuIdError.style.display = 'none';
                    }
                }

                if (!submenuName.trim()) {
                    if (window.showMessage) {
                        window.showMessage('서브메뉴 이름을 입력해주세요.', false);
                    }
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
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: formData.toString()
                    });

                    if (response.status === 201) {
                        if (window.showMessage) {
                            window.showMessage('서브메뉴가 성공적으로 추가되었습니다!', true);
                        }
                        addForm.reset();
                        document.getElementById('add-menu-id').value = "";
                    } else {
                        if (window.showMessage) {
                            window.showMessage(`서브메뉴 추가 실패: ${response.status} ${response.statusText}`, false);
                        }
                        console.error('서브메뉴 추가 실패:', response.status, response.statusText);
                    }
                } catch (error) {
                    console.error('API 호출 중 오류 발생:', error);
                    if (window.showMessage) {
                        window.showMessage('API 호출 중 오류가 발생했습니다.', false);
                    }
                }
            });
        }
    }
};
