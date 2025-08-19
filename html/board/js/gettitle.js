
const placeholder = document.getElementById('placeholder-content');
const boardContent = document.getElementById('board-content-section');
const postListBody = document.getElementById('post-list-body');
const paginationControls = document.getElementById('pagination-controls');

window.fetchBoardPosts = (idType, id) => {
    placeholder.classList.add('hidden');
    boardContent.classList.remove('hidden');

    let allPosts = [];
    let currentPage = 1;
    const postsPerPage = 10;

    const url = `board/title?${idType}=${id}`;
    
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
            renderPage(currentPage);
            setupPagination();
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            postListBody.innerHTML = `<tr><td colspan="3" class="no-posts">게시글을 불러오는 데 실패했습니다.</td></tr>`;
            paginationControls.innerHTML = '';
        });

    function renderPage(page) {
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
            row.innerHTML = `
                <td class="col-num">${post.num}</td>
                <td class="col-title">${post.article}</td>
                <td class="col-date">${post.timestamp}</td>
            `;
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
                renderPage(i);
                document.querySelectorAll('.pagination button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
            paginationControls.appendChild(btn);
        }
    }
};
