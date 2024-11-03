// Function to toggle the navigation menu visibility on mobile
function toggleMenu() {
    var navLinks = document.getElementById("nav-links");
    navLinks.classList.toggle("show"); // Toggles the 'show' class to display or hide the menu
}

// Function to display the loading indicator
function showLoading(loadingDiv, errorDiv, contentDiv) {
    loadingDiv.style.display = 'block'; // Show the loading indicator
    errorDiv.innerText = ''; // Clear any previous error messages
    contentDiv.innerHTML = ''; // Clear previous content to prepare for new data
}

// Function to hide the loading indicator once loading is complete
function hideLoading(loadingDiv) {
    loadingDiv.style.display = 'none'; // Hide the loading indicator
}

// Function to validate form data before submission
function validateForm(data) {
    // Check if essential values like weight, height, and age are positive numbers
    if (data.current_weight <= 0 || data.target_weight <= 0 || data.height <= 0 || data.age <= 0) {
        return 'Weight, height, and age must be positive numbers.'; // Return error message if validation fails
    }
    // Ensure the target weight differs from the current weight if the goal isn't maintenance
    if (data.target_weight === data.current_weight && data.goal !== 'weight_maintenance') {
        return 'Target weight is the same as current weight. Please select the correct goal.'; // Return specific error for invalid goal
    }
    return null; // Return null if all validations pass
}

// Function to display error messages in a specific error element
function showError(errorDiv, message) {
    errorDiv.innerText = message; // Display the error message in the designated errorDiv
}

// Function to display the basic plan information (goal and description)
function displayPlanBasics(contentDiv, plan, description) {
    contentDiv.innerHTML = ''; // Clear existing content

    // Create a section for the goal and description using the createSection helper
    contentDiv.appendChild(createSection('section', `<h2>Goal: ${translateGoal(plan.goal)}</h2><p>${description || ''}</p>`));
}

// Helper function to create a generic HTML section with a specified class and content
function createSection(className, innerHTML) {
    const section = document.createElement('div'); // Create a new div element
    section.className = className; // Assign the specified class
    section.innerHTML = innerHTML; // Set the inner HTML to the provided content
    return section; // Return the created section element
}

// Helper function to translate goal keywords to more readable goal names
function translateGoal(goal) {
    const goals = {
        'muscle_gain': 'Muscle Gain',
        'weight_loss': 'Weight Loss',
        'weight_maintenance': 'Weight Maintenance',
        'endurance': 'Endurance'
    };
    // Return the readable name for the goal, or the original goal if not found in the list
    return goals[goal] || goal;
}
