// Function to fetch the workout plan based on user input
async function fetchWorkoutPlan() {
    // Select key HTML elements for loading, error, and content display
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const contentDiv = document.getElementById('content');
    const infoBeforeLoadingDiv = document.getElementById('information-before-loading'); // Element to display initial information

    // Show "information-before-loading" message before loading starts
    infoBeforeLoadingDiv.style.display = 'block';
    loadingDiv.style.display = 'none'; // Ensure loading indicator is hidden initially

    // Optional delay to keep "information-before-loading" visible for a short time
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay

    // Display loading indicator and clear any previous content or errors
    showLoading(loadingDiv, errorDiv, contentDiv);
    infoBeforeLoadingDiv.style.display = 'block';

    const url = 'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/generateWorkoutPlan?noqueue=1';

    // Collect user input values for workout plan customization
    const goal = document.getElementById('goal').value;
    const fitness_level = document.getElementById('fitness_level').value;
    const exercise_types = Array.from(document.querySelectorAll('#exercise_types input[type="checkbox"]:checked')).map(el => el.value);
    const equipment_available = Array.from(document.querySelectorAll('#equipment_available input[type="checkbox"]:checked')).map(el => el.value);
    const health_conditions = Array.from(document.querySelectorAll('#health_conditions input[type="checkbox"]:checked')).map(el => el.value);
    const days_per_week = parseInt(document.getElementById('days_per_week').value);
    const session_duration = parseInt(document.getElementById('session_duration').value);
    const plan_duration_weeks = parseInt(document.getElementById('plan_duration_weeks').value);
    const lang = document.getElementById('lang').value;

    // Organize user input data into a structured object for the API request
    const requestData = {
        goal: goal,
        fitness_level: fitness_level,
        preferences: {
            exercise_types: exercise_types,
            equipment_available: equipment_available
        },
        health_conditions: health_conditions,
        schedule: {
            days_per_week: days_per_week,
            session_duration: session_duration
        },
        lang: lang,
        plan_duration_weeks: plan_duration_weeks
    };

    // Configuration for fetch request, including headers with API key
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '3d4d69e460msh24610fb46443247p1d3432jsnc5adff07c4c7', // API key for authentication
            'x-rapidapi-host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData) // Convert request data to JSON format
    };

    try {
        // Perform the fetch request and handle the response
        const response = await fetch(url, options);

        // Convert the response to JSON format
        const data = await response.json();

        // If a result exists in the response, display the workout plan
        if (data.result) {
            displayPlanBasics(contentDiv, data.result); // Display basic plan information
            displayWorkoutPlan(data.result, contentDiv); // Display detailed workout exercises
        } else {
            // Display error message if the result is not available
            showError(errorDiv, 'Unable to generate workout plan, please check your inputs and try again.');
        }
    } catch (error) {
        // Display any errors encountered during the fetch request
        showError(errorDiv, `Error: ${error.message}`);
    } finally {
        // Hide loading indicator and the initial information message after fetching
        hideLoading(loadingDiv);
        infoBeforeLoadingDiv.style.display = 'none';
    }
}

// Function to display the detailed workout plan in a formatted structure
function displayWorkoutPlan(plan, contentDiv) {
    // Display main heading with the workout duration in weeks
    const title = document.createElement('h2');
    title.textContent = `Your ${plan.total_weeks}-week workout plan`;  // Correct usage of template literals
    contentDiv.appendChild(title);

    // Display basic info about goal, fitness level, days per week, and session duration
    const info = document.createElement('p');
    info.textContent = `Goal: ${translateGoal(plan.goal)} | Fitness Level: ${translateFitnessLevel(plan.fitness_level)} | Work out ${plan.schedule.days_per_week} days per week, ${plan.schedule.session_duration} minutes per session`;
    contentDiv.appendChild(info);

    // Iterate over each day's workout plan and create an entry for each exercise
    plan.exercises.forEach(dayPlan => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day-plan'); // Assign class for styling each day's plan
        const dayTitle = document.createElement('h3');
        dayTitle.textContent = dayPlan.day; // Display the day of the workout plan
        dayDiv.appendChild(dayTitle);

        const exerciseList = document.createElement('ul');
        dayPlan.exercises.forEach(exercise => {
            const exerciseItem = document.createElement('li');
            const exerciseName = document.createElement('h6');
            exerciseName.textContent = exercise.name;
            exerciseItem.appendChild(exerciseName);

            // Display additional details for each exercise, including duration, repetitions, sets, and equipment
            const exerciseDetails = document.createElement('p');
            exerciseDetails.innerHTML = `
                ${exercise.duration ? `Duration: ${exercise.duration}` : ''}
                ${exercise.repetitions ? `<br>Repetitions: ${exercise.repetitions}` : ''}
                ${exercise.sets ? `<br>Sets: ${exercise.sets}` : ''}
                ${exercise.equipment ? `<br>Equipment: ${translateEquipment(exercise.equipment)}` : ''}
            `;  // Correct usage of template literals
            exerciseItem.appendChild(exerciseDetails);
            exerciseList.appendChild(exerciseItem);
        });
        dayDiv.appendChild(exerciseList);
        contentDiv.appendChild(dayDiv);
    });
}

// Helper function to translate fitness level values for better readability
function translateFitnessLevel(level) {
    const levels = {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced'
    };
    return levels[level] || level;
}

// Helper function to translate equipment names for better readability
function translateEquipment(equipment) {
    const equipments = {
        'dumbbells': 'Dumbbells',
        'yoga_mat': 'Yoga Mat',
        'resistance_band': 'Resistance Band',
        'no_equipment': 'No Equipment'
    };
    return equipments[equipment] || equipment;
}

// Add event listener to the "Generate Workout Plan" button to initiate plan generation
document.getElementById('generateWorkoutPlanBtn').addEventListener('click', fetchWorkoutPlan);
