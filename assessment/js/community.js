// Define API URL
const API_URL = "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericchat/";

// Define authentication information (replace with your actual values)
const student_number = "s4900100";  // Replace with actual student number
const uqcloud_zone_id = "2466d9de"; // Replace with actual UQCloud zone ID

// Fetch chat posts and display them on the page
/*
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
                    <div class="community-chat-post">
                        <h3>${chatPost.chat_post_title}</h3>
                        <p>${chatPost.chat_post_content}</p>
                        <small>Posted by ${chatPost.person_name} on ${chatPost.chat_date_time}</small>
                    </div>
                `;
            });
            document.getElementById('community-chat-list').innerHTML = output;
        })
        .catch(error => console.error('Error:', error));
}*/


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
                    <div class="community-chat-post chat-item">
                        <h5>${chatPost.chat_post_title}</h5>
                        <p>${chatPost.chat_post_content}</p>
                        <small>Posted by ${chatPost.person_name} on ${chatPost.chat_date_time}</small>
                    </div>
                `;
            });
            document.getElementById('community-chat-list').innerHTML = output;
        })
        .catch(error => console.error('Error:', error));
}


// Handle form submission and send POST request
function handleSubmit(event) {
    event.preventDefault();  // Prevent the default form submission

    const myHeaders = new Headers();
    myHeaders.append("student_number", student_number);
    myHeaders.append("uqcloud_zone_id", uqcloud_zone_id);

    const form = document.getElementById('community-chatPostForm');
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
            fetchChatPosts();  // Refresh chat list
        })
        .catch(error => console.error('Error:', error));
}

// Automatically fetch and display chat posts when the page loads
document.addEventListener('DOMContentLoaded', fetchChatPosts);

// Add the event listener to the form to handle submission
document.getElementById('community-chatPostForm').addEventListener('submit', handleSubmit);
