async function fetchNutritionPlan() {
    // Elements to show loading, errors, and content results
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const contentDiv = document.getElementById('content');
    const infoBeforeLoadingDiv = document.getElementById('information-before-loading'); // The information message before loading

    // Display information message briefly before loading
    infoBeforeLoadingDiv.style.display = 'block';
    loadingDiv.style.display = 'none'; // Ensure loading is initially hidden

    // Optional delay to show "information-before-loading" message (1 second)
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    // Show loading message and clear previous content and errors
    showLoading(loadingDiv, errorDiv, contentDiv);

    const url = 'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/nutritionAdvice?noqueue=1';
    const goal = document.getElementById('goal').value;

    // Retrieve multiple selected options for diet, activity type, allergies, and meal preferences
    const diets = Array.from(document.getElementById('diet').selectedOptions).map(option => option.value);
    const activityTypes = Array.from(document.getElementById('activity_type').selectedOptions).map(option => option.value);
    const allergies = Array.from(document.getElementById('allergies').selectedOptions).map(option => option.value);
    const mealPreferences = Array.from(document.getElementById('meal_preferences').selectedOptions).map(option => option.value);

    // Gather additional form data, parsing numbers and assigning relevant variables
    const currentWeight = parseFloat(document.getElementById('current_weight').value);
    const targetWeight = parseFloat(document.getElementById('target_weight').value);
    const activityLevel = document.getElementById('activity_level').value;
    const age = parseInt(document.getElementById('age').value, 10);
    const gender = document.getElementById('gender').value;
    const height = parseInt(document.getElementById('height').value, 10);
    const language = document.getElementById('language').value;
    const budget = parseFloat(document.getElementById('budget').value);

    // Validate the form data before sending it
    const validationError = validateForm({
        current_weight: currentWeight,
        target_weight: targetWeight,
        height: height,
        age: age,
        goal: goal
    });

    // If validation fails, hide loading and display the error
    if (validationError) {
        hideLoading(loadingDiv);
        showError(errorDiv, `Form error: ${validationError}`);
        return;
    }

    // Construct the request data object to send with the POST request
    const requestData = {
        goal: goal,
        dietary_restrictions: diets,
        current_weight: currentWeight,
        target_weight: targetWeight,
        daily_activity_level: activityLevel,
        age: age,
        gender: gender,
        height: height,
        lang: language,
        activity_type: activityTypes,
        allergies: allergies,
        meal_preferences: mealPreferences,
        budget: budget
    };

    // Define options for the fetch request, including headers for API authentication
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '3d4d69e460msh24610fb46443247p1d3432jsnc5adff07c4c7', // API key
            'x-rapidapi-host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    };

    try {
        // Make the fetch request and handle the response
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }
        
        // Parse JSON data from the response
        const data = await response.json();
        if (data && data.result) {
            // Display plan basics and detailed nutrition plan
            displayPlanBasics(contentDiv, data.result, data.result.description);
            displayNutritionPlan(data.result, contentDiv);
        } else {
            throw new Error('No valid data received.');
        }
    } catch (error) {
        // Display any error that occurs during fetch or data handling
        showError(errorDiv, `Error fetching data: ${error.message}`);
    } finally {
        // Hide loading indicators and the initial information message after processing
        hideLoading(loadingDiv);
        infoBeforeLoadingDiv.style.display = 'none'; 
    }
}

// Function to display the nutrition plan details
function displayNutritionPlan(result, contentDiv) {
    // Create a section for meal suggestions and set the heading
    const mealsSection = createSection('section', '<h3>Meal Suggestions</h3>');
    
    // Loop over each meal suggestion and display details
    result.meal_suggestions.forEach((meal, index) => {
        // Create a container for each meal and apply the 'meal-item' class for CSS styling
        let mealDiv = createSection('div', `<h4>${meal.meal}</h4>`);
        mealDiv.classList.add('meal-item');  // Ensures each meal has a consistent class

        // Display each suggestion within the meal, including name, calories, and ingredients
        meal.suggestions.forEach(suggestion => {
            mealDiv.innerHTML += `
                <p><strong>${suggestion.name}</strong> (${suggestion.calories} kcal)</p>
                <p>Ingredients: ${suggestion.ingredients.join(', ')}</p>`;
        });
        mealsSection.appendChild(mealDiv);
    });

    // Append the completed meals section to the content display area
    contentDiv.appendChild(mealsSection);
}

// Add an event listener to trigger the nutrition plan generation
document.getElementById('generateNutritionPlanBtn').addEventListener('click', fetchNutritionPlan);
