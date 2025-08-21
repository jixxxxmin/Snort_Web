
document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('submenu-content-area');
    const tabLinks = document.querySelectorAll('.content-nav .tab-link');

    const tabContents = {
        'add': `
            <h2>서브메뉴 추가</h2>
            <p>새로운 서브메뉴 항목을 생성합니다.</p>
            <form>
                <div class="form-group">
                    <label for="menu-name">메뉴 이름</label>
                    <input type="text" id="menu-name" class="form-control" placeholder="예: 공지사항">
                </div>
                <div class="form-group">
                    <label for="menu-url">메뉴 설명</label>
                    <input type="text" id="menu-url" class="form-control" placeholder="예: /board/notice">
                </div>
                <button type="submit" class="btn btn-primary">추가하기</button>
            </form>
        `,
        'delete': `
            <h2>서브메뉴 삭제</h2>
            <p>기존 서브메뉴 항목을 삭제합니다. 삭제 버튼을 클릭하면 즉시 삭제됩니다.</p>
            <table class="content-table">
                <thead>
                    <tr><th>ID</th><th>메뉴 이름</th><th>URL</th><th>관리</th></tr>
                </thead>
                <tbody>
                    <tr><td>1</td><td>서브메뉴 추가</td><td>/adminSubmenu?submenu=add</td><td><button class="btn btn-danger">삭제</button></td></tr>
                    <tr><td>2</td><td>서브메뉴 삭제</td><td>/adminSubmenu?submenu=delete</td><td><button class="btn btn-danger">삭제</button></td></tr>
                    <tr><td>3</td><td>서브메뉴 수정</td><td>/adminSubmenu?submenu=edit</td><td><button class="btn btn-danger">삭제</button></td></tr>
                </tbody>
            </table>
        `,
        'edit': `
            <h2>서브메뉴 수정</h2>
            <p>기존 서브메뉴 항목을 수정합니다.</p>
            <table class="content-table">
                <thead>
                    <tr><th>ID</th><th>메뉴 이름</th><th>URL</th><th>관리</th></tr>
                </thead>
                <tbody>
                    <tr><td>1</td><td>서브메뉴 추가</td><td>/adminSubmenu?submenu=add</td><td><button class="btn btn-secondary">수정</button></td></tr>
                    <tr><td>2</td><td>서브메뉴 삭제</td><td>/adminSubmenu?submenu=delete</td><td><button class="btn btn-secondary">수정</button></td></tr>
                    <tr><td>3</td><td>서브메뉴 수정</td><td>/adminSubmenu?submenu=edit</td><td><button class="btn btn-secondary">수정</button></td></tr>
                </tbody>
            </table>
        `
    };

    /**
     * URL 파라미터에서 현재 활성화할 탭의 이름을 가져오는 함수
     * @returns {string} 현재 탭 이름 (기본값: 'add')
     */
    const getCurrentTab = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('submenu') || 'add';
    };

    /**
     * 특정 탭 콘텐츠를 로드하고 탭 메뉴의 활성 상태를 업데이트하는 함수
     * @param {string} tabName - 로드할 탭의 이름
     */
    const loadTabContent = (tabName) => {
        tabLinks.forEach(link => link.classList.remove('active'));
        
        const activeTab = document.querySelector(`.content-nav .tab-link[data-tab="${tabName}"]`);
        if(activeTab) {
            activeTab.classList.add('active');
        }

        contentArea.innerHTML = tabContents[tabName] || '<h2>콘텐츠 없음</h2>';
    };

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = link.dataset.tab;
            
            const newUrl = `${window.location.pathname}?submenu=${tabName}`;
            history.pushState({tab: tabName}, '', newUrl);

            loadTabContent(tabName);
        });
    });

    window.addEventListener('popstate', () => {
        const currentTab = getCurrentTab();
        loadTabContent(currentTab);
    });

    const initialTab = getCurrentTab();
    loadTabContent(initialTab);
});

