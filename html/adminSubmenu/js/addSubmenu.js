document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('submenu-content-area');
    const tabLinks = document.querySelectorAll('.content-nav .tab-link');

    let currentTab = 'add'; 

    const messageArea = document.createElement('div');
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
                        <option value="1">메뉴 구조 관리</option> <!-- 예시 ID, 실제 메뉴 ID로 변경 필요 -->
                        <option value="2">게시글 관리</option> <!-- 예시 ID, 실제 메뉴 ID로 변경 필요 -->
                        <option value="3">회원 관리</option> <!-- 예시 ID, 실제 메뉴 ID로 변경 필요 -->
                    </select>
                    <small id="menu-id-error" style="color: red; display: none; margin-top: 5px;">상위 메뉴를 선택해야 합니다.</small>
                </div>
                <div class="form-group">
                    <label for="add-submenu-name">서브메뉴 이름</label>
                    <input type="text" id="add-submenu-name" name="submenu_name" class="form-control" placeholder="예: 공지사항" required>
                </div>
                <div class="form-group">
                    <label for="add-descript">서브메뉴 설명</label>
                    <input type="text" id="add-descript" name="descript" class="form-control" placeholder="예: 사이트의 주요 소식을 알립니다.">
                </div>
                <button type="submit" class="btn btn-primary">추가하기</button>
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
                            body: formData.toString(),
                            credentials: 'include'
                        });

                        if (response.status === 201) {
                            if (window.showMessage) {
                                window.showMessage('서브메뉴가 성공적으로 추가되었습니다!', true);
                            }
                            addForm.reset();
                            document.getElementById('add-menu-id').value = "";
                        } else if (response.status === 302) {
                             if (window.showMessage) {
                                window.showMessage('인증이 필요합니다. 로그인 페이지로 리디렉션됩니다.', false);
                            }
                            console.warn('인증 필요: 302 리디렉션 발생', response.headers.get('Location'));
                            window.location.href = response.headers.get('Location');
                        } else if (response.status === 404) {
                             if (window.showMessage) {
                                window.showMessage('요청한 리소스를 찾을 수 없습니다 (404 Not Found).', false);
                            }
                            console.error('404 Not Found:', apiUrl);
                        }
                        else {
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
        if (messageArea) {
            messageArea.style.display = 'none';
            messageArea.textContent = '';
        }
    };

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = e.target.dataset.tab;
            if (tabId === 'add' && currentTab !== tabId) {
                currentTab = tabId;
                const newUrl = `${window.location.pathname}?submenu=${tabId}`;
                history.pushState({tab: tabId}, '', newUrl);
                showTab(tabId);
            } else if (tabId !== 'add') {
                if (window.showMessage) {
                    window.showMessage('현재는 서브메뉴 추가 기능만 활성화되어 있습니다.', false);
                }
            }
        });
    });

    window.addEventListener('popstate', (event) => {
        const params = new URLSearchParams(window.location.search);
        const tabFromUrl = params.get('submenu') || 'add';
        if (currentTab !== tabFromUrl && tabFromUrl === 'add') {
            currentTab = tabFromUrl;
            showTab(currentTab);
        } else if (tabFromUrl !== 'add') {
            history.replaceState({tab: 'add'}, '', `${window.location.pathname}?submenu=add`);
            currentTab = 'add';
            showTab(currentTab);
        }
    });

    showTab(currentTab);
});
