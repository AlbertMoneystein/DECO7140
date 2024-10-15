// 确保所有代码在 DOM 加载完毕后执行
document.addEventListener('DOMContentLoaded', function() {
    let currentUser = '';

    // Handle registration form submission
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('signupUsername').value;
        const password = document.getElementById('signupPassword').value;

        fetch('community.php?action=signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Registration successful! Please log in.');
                document.querySelector('.signup-form').style.display = 'none';
                document.querySelector('.login-form').style.display = 'block';
            } else {
                alert('Registration failed. Username may already be taken.');
            }
        })
        .catch(error => console.error('Error during registration:', error));
    });

    // 添加这一段代码用于切换到登录表单
    document.getElementById('showLoginForm').addEventListener('click', function() {
        document.querySelector('.signup-form').style.display = 'none';
        document.querySelector('.login-form').style.display = 'block';
    });

    // Handle login form submission
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('community.php?action=login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentUser = username;
                alert('Login successful!');
                document.querySelector('.login-form').style.display = 'none';
                document.querySelector('.story-form').style.display = 'block';
                loadStories();
            } else {
                alert('Login failed.');
            }
        })
        .catch(error => console.error('Error during login:', error));
    });

    // Handle story submission form
    document.getElementById('storyForm').addEventListener('submit', function(e) {
        e.preventDefault();

        // 检查用户是否已登录
        if (!currentUser) {
            alert('You must be logged in to submit a story.');
            return;
        }

        const title = document.getElementById('storyTitle').value;
        const content = document.getElementById('storyContent').value;

        fetch('community.php?action=submit_story', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ authorName: currentUser, title, content }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Story submitted successfully!');
                loadStories();
            } else {
                alert('Failed to submit story.');
            }
        })
        .catch(error => console.error('Error during story submission:', error));
    });

    // Handle logout button click
    document.getElementById('logoutButton').addEventListener('click', function() {
        currentUser = '';
        alert('You have logged out.');
        document.querySelector('.story-form').style.display = 'none';
        document.querySelector('.login-form').style.display = 'block';
    });

    // Load and display stories
    function loadStories() {
        fetch('community.php?action=get_stories')
            .then(response => response.json())
            .then(data => {
                const storiesDiv = document.getElementById('stories');
                storiesDiv.innerHTML = '';

                if (Array.isArray(data)) {
                    data.forEach(story => {
                        const storyDiv = document.createElement('div');
                        storyDiv.className = 'story';
                        storyDiv.innerHTML = `
                            <h3>${story.title} (by ${story.author}) <span class="delete-button" onclick="deleteStory('${story.id}')">Delete</span></h3>
                            <p>${story.content}</p>
                            <p>Submitted on: ${story.submission_time}</p>
                            <div class="comments">
                                <h4>Comments</h4>
                                ${story.comments.map(comment => `
                                    <div class="comment">${comment.content} (by ${comment.author}) <span class="delete-button" onclick="deleteComment('${comment.id}')">Delete</span></div>
                                `).join('')}
                                <input type="text" id="commentInput${story.id}" placeholder="Add a comment">
                                <button class="submit-comment" onclick="submitComment('${story.id}')">Submit</button>
                            </div>
                        `;
                        storiesDiv.appendChild(storyDiv);
                    });
                } else {
                    console.error('Expected an array but received:', data);
                }
            })
            .catch(error => console.error('Error fetching stories:', error));
    }

    // Submit a comment
    function submitComment(storyId) {
        // 检查用户是否已登录
        if (!currentUser) {
            alert('You must be logged in to submit a comment.');
            return;
        }

        const commentContent = document.getElementById(`commentInput${storyId}`).value;
        if (!commentContent.trim()) {
            alert('Please enter a comment.');
            return;
        }

        fetch('community.php?action=add_comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ storyId, commentContent, author: currentUser }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadStories();
            } else {
                alert('Failed to add comment.');
            }
        })
        .catch(error => console.error('Error submitting comment:', error));
    }

    // Delete a story
    function deleteStory(storyId) {
        fetch('community.php?action=delete_story', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ storyId }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Story deleted successfully.');
                loadStories();
            } else {
                alert('Failed to delete story.');
            }
        })
        .catch(error => console.error('Error deleting story:', error));
    }

    // Delete a comment
    function deleteComment(commentId) {
        fetch('community.php?action=delete_comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ commentId }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Comment deleted successfully.');
                loadStories();
            } else {
                alert('Failed to delete comment.');
            }
        })
        .catch(error => console.error('Error deleting comment:', error));
    }

    // Initialize by loading stories
    loadStories();
});
