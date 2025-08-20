
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('article_id');
    const menuId = urlParams.get('menu_id');
    const submenuId = urlParams.get('submenu_id');

    const parentIdType = menuId ? 'menu_id' : 'submenu_id';
    const parentId = menuId || submenuId;

    if (articleId && parentId) {
        fetch(`/articles?article_id=${articleId}&${parentIdType}=${parentId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('네트워크 응답 오류');
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('article-title').textContent = data.title;
                document.getElementById('article-content').textContent = data.content;
                document.getElementById('article-timestamp').textContent = data.timestamp;

                const prevPostLink = document.querySelector('#prev-post a');
                if (data.prevPost) {
                    prevPostLink.textContent = data.prevPost.title;
                    prevPostLink.href = `/article?article_id=${data.prevPost.id}&${parentIdType}=${parentId}`;
                } else {
                    document.getElementById('prev-post').classList.add('hidden');
                }
                
                const nextPostLink = document.querySelector('#next-post a');
                if (data.nextPost) {
                    nextPostLink.textContent = data.nextPost.title;
                    nextPostLink.href = `/article?article_id=${data.nextPost.id}&${parentIdType}=${parentId}`;
                } else {
                    document.getElementById('next-post').classList.add('hidden');
                }
            })
            .catch(error => {
                console.error('게시글 데이터를 가져오는 중 오류 발생:', error);
                document.getElementById('article-content').textContent = '게시글을 불러올 수 없습니다.';
            });
    } else {
        document.getElementById('article-title').textContent = '잘못된 접근입니다.';
        document.getElementById('article-content').textContent = '유효한 게시글 ID와 메뉴 ID가 필요합니다.';
    }
});
