// 定义API URL
const API_URL = "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericchat/";

// 定义身份认证信息（用你的实际值替换）
const student_number = "s4900100";  // 替换为实际的学号
const uqcloud_zone_id = "2466d9de"; // 替换为实际的UQCloud项目区ID

// 获取聊天帖子并显示在页面上
function fetchChatPosts() {
  const myHeaders = new Headers();
  myHeaders.append("student_number", student_number);
  myHeaders.append("uqcloud_zone_id", uqcloud_zone_id);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  fetch(API_URL, requestOptions)
    .then(response => response.json())
    .then(data => {
      let output = "";
      data.forEach(chatPost => {
        output += `
          <div class="chat-post">
            <h3>${chatPost.chat_post_title}</h3>
            <p>${chatPost.chat_post_content}</p>
            <small>Posted by ${chatPost.person_name} on ${chatPost.chat_date_time}</small>
          </div>
        `;
      });
      document.getElementById('chat-list').innerHTML = output;
    })
    .catch(error => console.error('Error:', error));
}

// 处理表单提交，发送POST请求
document.getElementById('chatPostForm').addEventListener('submit', function(event) {
  event.preventDefault();  // 阻止表单默认提交行为

  const myHeaders = new Headers();
  myHeaders.append("student_number", student_number);
  myHeaders.append("uqcloud_zone_id", uqcloud_zone_id);

  const form = document.getElementById('chatPostForm');
  const formData = new FormData(form);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formData,
    redirect: "follow"
  };

  fetch(API_URL, requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log('Post success:', result);
      fetchChatPosts();  // 刷新聊天列表
    })
    .catch(error => console.error('Error:', error));
});

// 页面加载时自动获取并显示聊天帖子
document.addEventListener('DOMContentLoaded', fetchChatPosts);
