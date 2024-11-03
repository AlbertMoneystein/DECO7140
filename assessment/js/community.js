// Define API URL for fetching and posting chat messages
const API_URL = "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericchat/";

// Define authentication information (replace with your actual values)
const student_number = "s4900100";  // Replace with actual student number
const uqcloud_zone_id = "2466d9de"; // Replace with actual UQCloud zone ID

// Fetch chat posts and display them on the page
function fetchChatPosts() {
    const myHeaders = new Headers();
    // Append authentication information to headers
    myHeaders.append("student_number", student_number);
    myHeaders.append("uqcloud_zone_id", uqcloud_zone_id);

    // Request configuration options
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    // Fetch chat data from the API and render it in the chat list container
    fetch(API_URL, requestOptions)
        .then(response => response.json()) // Convert response to JSON
        .then(data => {
            let output = "";  // Initialize output string for HTML content
            // Loop over each chat post and create an HTML structure for it
            data.forEach(chatPost => {
                output += `
                    <div class="community-chat-post chat-item">
                        <h6>${chatPost.chat_post_title}</h6>
                        <p>${chatPost.chat_post_content}</p>
                        <small>Posted by ${chatPost.person_name} on ${chatPost.chat_date_time}</small>
                    </div>
                `;
            });
            // Display the chat posts in the HTML element with id 'community-chat-list'
            document.getElementById('community-chat-list').innerHTML = output;
        })
        .catch(error => console.error('Error:', error)); // Log any errors to the console
}

// Handle form submission and send POST request
function handleSubmit(event) {
    event.preventDefault();  // Prevent the default form submission behavior

    const myHeaders = new Headers();
    // Append authentication headers for the POST request
    myHeaders.append("student_number", student_number);
    myHeaders.append("uqcloud_zone_id", uqcloud_zone_id);

    // Select the form and create a FormData object from it to capture user input
    const form = document.getElementById('community-chatPostForm');
    const formData = new FormData(form);

    // Set up POST request options with form data
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formData,
        redirect: "follow"
    };

    // Make POST request to the API and handle the response
    fetch(API_URL, requestOptions)
        .then(response => response.json()) // Convert response to JSON
        .then(result => {
            console.log('Post success:', result); // Log success message to console
            fetchChatPosts();  // Refresh chat list to show the new post
        })
        .catch(error => console.error('Error:', error)); // Log any errors to the console
}

// Automatically fetch and display chat posts when the page loads
document.addEventListener('DOMContentLoaded', fetchChatPosts);

// Add the event listener to the form to handle submission
document.getElementById('community-chatPostForm').addEventListener('submit', handleSubmit);
