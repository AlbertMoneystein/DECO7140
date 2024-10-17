document.getElementById('generateBtn').addEventListener('click', function() {
    // Get user input parameters
    const goal = document.getElementById('goal').value;
    const fitness_level = document.getElementById('fitness_level').value;

    const exercise_types = Array.from(document.querySelectorAll('#exercise_types input[type="checkbox"]:checked')).map(el => el.value);
    const equipment_available = Array.from(document.querySelectorAll('#equipment_available input[type="checkbox"]:checked')).map(el => el.value);
    const health_conditions = Array.from(document.querySelectorAll('#health_conditions input[type="checkbox"]:checked')).map(el => el.value);

    const days_per_week = parseInt(document.getElementById('days_per_week').value);
    const session_duration = parseInt(document.getElementById('session_duration').value);
    const plan_duration_weeks = parseInt(document.getElementById('plan_duration_weeks').value);
    const lang = document.getElementById('lang').value;

    // Construct the request body
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

    // Clear previous results
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<p>Generating workout plan, please wait...</p>';

    // Call API
    fetch('https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/generateWorkoutPlan?noqueue=1', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-key': '3d4d69e460msh24610fb46443247p1d3432jsnc5adff07c4c7',
            'x-rapidapi-host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        // Check if the result field exists
        if (data.result) {
            console.log("Workout Plan Result:", data.result); // Log the result specifically
            displayWorkoutPlan(data.result);
        } else {
            console.log("No result found in the response."); // Log if there's no result
            resultDiv.innerHTML = '<p>Unable to generate workout plan, please check your inputs and try again.</p>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while generating the workout plan. Please try again later.');
    });
});


// Function to format and display the workout plan
function displayWorkoutPlan(plan) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear content

    // Create title
    const title = document.createElement('h2');
    title.textContent = `Your ${plan.total_weeks}-week workout plan`;
    resultDiv.appendChild(title);

    // Display goal and fitness level
    const info = document.createElement('p');
    info.textContent = `Goal: ${translateGoal(plan.goal)} | Fitness Level: ${translateFitnessLevel(plan.fitness_level)} | Work out ${plan.schedule.days_per_week} days per week, ${plan.schedule.session_duration} minutes per session`;
    resultDiv.appendChild(info);

    // Loop through each day's plan
    plan.exercises.forEach(dayPlan => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day-plan');

        const dayTitle = document.createElement('h3');
        dayTitle.textContent = dayPlan.day;
        dayDiv.appendChild(dayTitle);

        // Create a list to show all exercises for the day
        const exerciseList = document.createElement('ul');

        dayPlan.exercises.forEach(exercise => {
            const exerciseItem = document.createElement('li');

            // Create exercise name
            const exerciseName = document.createElement('strong');
            exerciseName.textContent = exercise.name;
            exerciseItem.appendChild(exerciseName);

            // Create exercise details
            const exerciseDetails = document.createElement('p');
            exerciseDetails.innerHTML = `
                ${exercise.duration ? `Duration: ${exercise.duration}` : ''}
                ${exercise.repetitions ? `<br>Repetitions: ${exercise.repetitions}` : ''}
                ${exercise.sets ? `<br>Sets: ${exercise.sets}` : ''}
                ${exercise.equipment ? `<br>Equipment: ${translateEquipment(exercise.equipment)}` : ''}
            `;
            exerciseItem.appendChild(exerciseDetails);

            exerciseList.appendChild(exerciseItem);
        });

        dayDiv.appendChild(exerciseList);
        resultDiv.appendChild(dayDiv);
    });
}

// Helper function: translate goal
function translateGoal(goal) {
    const goals = {
        'weight_loss': 'Weight Loss',
        'muscle_gain': 'Muscle Gain',
        'endurance': 'Endurance'
    };
    return goals[goal] || goal;
}

// Helper function: translate fitness level
function translateFitnessLevel(level) {
    const levels = {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced'
    };
    return levels[level] || level;
}

// Helper function: translate equipment
function translateEquipment(equipment) {
    const equipments = {
        'dumbbells': 'Dumbbells',
        'yoga_mat': 'Yoga Mat',
        'resistance_band': 'Resistance Band',
        'no_equipment': 'No Equipment'
    };
    return equipments[equipment] || equipment;
}
