
document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('submenu-content-area');
    const tabLinks = document.querySelectorAll('.content-nav .tab-link');
    let currentTab = 'add'; // 기본으로 'add' 탭을 표시

    // 각 탭에 대한 HTML 콘텐츠
    const contentMap = {
        'add': `
            <h2>서브메뉴 추가</h2>
            <p>새로운 서브메뉴 항목을 생성합니다. 상위 메뉴를 반드시 선택해야 합니다.</p>
            <form id="addSubmenuForm">
                <div class="form-group">
                    <label for="add-menu-id">상위 메뉴 선택</label>
                    <select id="add-menu-id" name="menu_id" class="form-control" required>
                        <option value="" selected disabled>-- 필수로 선택해주세요 --</option>
                        <option value="menu_manage">메뉴 구조 관리</option>
                        <option value="article_manage">게시글 관리</option>
                        <option value="user_manage">회원 관리</option>
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

    // 탭에 맞는 JS 파일을 동적으로 로드하는 함수
    const loadTabScript = (tabId) => {
        // 이전에 로드된 탭 스크립트가 있다면 제거
        const oldScript = document.getElementById('tab-specific-script');
        if (oldScript) {
            oldScript.remove();
        }

        // 새 스크립트 태그 생성
        const script = document.createElement('script');
        script.id = 'tab-specific-script';
        script.src = `./js/submenu_${tabId}.js`; // 파일 경로 설정
        script.defer = true; // DOM 로드 후 실행

        // body에 스크립트 추가하여 로드
        document.body.appendChild(script);
    };

    // 탭을 표시하는 함수
    const showTab = (tabId) => {
        // 모든 탭 링크에서 'active' 클래스 제거
        tabLinks.forEach(link => link.classList.remove('active'));
        // 현재 클릭한 탭에 'active' 클래스 추가
        document.querySelector(`.tab-link[data-tab="${tabId}"]`).classList.add('active');

        // 콘텐츠 영역에 해당 HTML 삽입
        contentArea.innerHTML = contentMap[tabId];
        // 해당 탭의 JS 파일 로드
        loadTabScript(tabId);
    };

    // 탭 링크에 클릭 이벤트 리스너 추가
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = e.target.dataset.tab;
            if (currentTab !== tabId) {
                currentTab = tabId;
                showTab(tabId);
            }
        });
    });

    // 페이지 첫 로드 시 기본 탭 표시
    showTab(currentTab);
});
