
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const menuId = urlParams.get('menu_id');
    const submenuId = urlParams.get('submenu_id');

    // URL에 ID가 있으면 바로 게시글을 불러옵니다.
    if (menuId) {
        window.fetchBoardPosts('menu_id', menuId, true);
    } else if (submenuId) {
        window.fetchBoardPosts('submenu_id', submenuId, true);
    }
});

const placeholder = document.getElementById('placeholder-content');
const boardContent = document.getElementById('board-content-section');
const postListBody = document.getElementById('post-list-body');
const paginationControls = document.getElementById('pagination-controls');

// window에 함수를 할당하여 getmenu.js에서 호출할 수 있도록 합니다.
window.fetchBoardPosts = (idType, id, shouldReplaceUrl = false) => {
    postListBody.innerHTML = '';
    paginationControls.innerHTML = '';
    placeholder.classList.add('hidden');
    boardContent.classList.remove('hidden');

    let allPosts = [];
    let currentPage = 1;
    const postsPerPage = 10;

    const url = `gettitle?${idType}=${id}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            allPosts = data;
            currentPage = 1;
            renderPage(currentPage, id, idType);
            setupPagination();

            // fetch가 성공한 후에만 URL을 초기화합니다.
            if (shouldReplaceUrl) {
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            postListBody.innerHTML = `<tr><td colspan="3" class="no-posts">게시글을 불러오는 데 실패했습니다.</td></tr>`;
            paginationControls.innerHTML = '';
        });

    function renderPage(page, parentId, idType) {
        postListBody.innerHTML = '';
        if (allPosts.length === 0) {
            postListBody.innerHTML = `<tr><td colspan="3" class="no-posts">게시글이 없습니다.</td></tr>`;
            return;
        }

        const start = (page - 1) * postsPerPage;
        const end = start + postsPerPage;
        const postsToDisplay = allPosts.slice(start, end);

        postsToDisplay.forEach(post => {
            const row = document.createElement('tr');
            
            const titleCell = document.createElement('td');
            titleCell.className = 'col-title';

            const titleLink = document.createElement('a');
            titleLink.href = `/articles?article_id=${post.num}&${idType}=${parentId}`;
            titleLink.textContent = post.article;
            
            titleCell.appendChild(titleLink);

            row.innerHTML = `
                <td class="col-num">${post.num}</td>
                <td class="col-date">${post.timestamp}</td>
            `;
            row.querySelector('.col-num').after(titleCell);

            postListBody.appendChild(row);
        });
    }

    function setupPagination() {
        paginationControls.innerHTML = '';
        const pageCount = Math.ceil(allPosts.length / postsPerPage);
        if (pageCount <= 1) return;

        for (let i = 1; i <= pageCount; i++) {
            const btn = document.createElement('button');
            btn.innerText = i;
            if (i === currentPage) {
                btn.classList.add('active');
            }
            btn.addEventListener('click', () => {
                currentPage = i;
                renderPage(i, id, idType);
                document.querySelectorAll('.pagination button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
            paginationControls.appendChild(btn);
        }
    }
};
