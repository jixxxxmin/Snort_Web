
document.addEventListener('DOMContentLoaded', () => {
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
        display: none;
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

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = e.target.dataset.tab;
            if (tabId === 'add' && currentTab !== tabId) {
                currentTab = tabId;
                const newUrl = `${window.location.pathname}?submenu=${tabId}`;
                history.pushState({tab: tabId}, '', newUrl);
                if (typeof window.showTab === 'function') {
                    window.showTab(tabId);
                }
            } else if (tabId !== 'add') {
                if (window.showMessage) {
                    window.showMessage('현재는 서브메뉴 추가 기능만 활성화되어 있습니다.', false);
                }
            }
        });
    });

    window.addEventListener('popstate', () => {
        const params = new URLSearchParams(window.location.search);
        const tabFromUrl = params.get('submenu') || 'add';
        if (currentTab !== tabFromUrl && tabFromUrl === 'add') {
            currentTab = tabFromUrl;
            if (typeof window.showTab === 'function') {
                window.showTab(currentTab);
            }
        } else if (tabFromUrl !== 'add') {
            history.replaceState({tab: 'add'}, '', `${window.location.pathname}?submenu=add`);
            currentTab = 'add';
            if (typeof window.showTab === 'function') {
                window.showTab(currentTab);
            }
        }
    });

    const params = new URLSearchParams(window.location.search);
    const initialTab = params.get('submenu') || 'add';
    if (typeof window.showTab === 'function') {
        window.showTab(initialTab);
    }
});
