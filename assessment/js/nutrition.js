async function fetchNutritionPlan() {
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const contentDiv = document.getElementById('content');

    // Show loading indicator
    loadingDiv.style.display = 'block';
    errorDiv.innerText = '';
    contentDiv.innerHTML = '';

    const url = 'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/nutritionAdvice?noqueue=1';
    const goal = document.getElementById('goal').value;

    // Get multi-select values
    const diets = Array.from(document.getElementById('diet').selectedOptions).map(option => option.value);
    const activityTypes = Array.from(document.getElementById('activity_type').selectedOptions).map(option => option.value);
    const allergies = Array.from(document.getElementById('allergies').selectedOptions).map(option => option.value);
    const mealPreferences = Array.from(document.getElementById('meal_preferences').selectedOptions).map(option => option.value);

    const currentWeight = parseFloat(document.getElementById('current_weight').value);
    const targetWeight = parseFloat(document.getElementById('target_weight').value);
    const activityLevel = document.getElementById('activity_level').value;
    const age = parseInt(document.getElementById('age').value, 10);
    const gender = document.getElementById('gender').value;
    const height = parseInt(document.getElementById('height').value, 10);
    const language = document.getElementById('language').value;
    const budget = parseFloat(document.getElementById('budget').value);

    // Validate form data
    const validationError = validateForm({
        current_weight: currentWeight,
        target_weight: targetWeight,
        height: height,
        age: age,
        goal: goal
    });

    if (validationError) {
        loadingDiv.style.display = 'none';
        errorDiv.innerText = `Form error: ${validationError}`;
        return;
    }

    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '3d4d69e460msh24610fb46443247p1d3432jsnc5adff07c4c7', // Replace with your key
            'x-rapidapi-host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
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
        })
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.result) {
            displayNutritionPlan(data.result);
        } else {
            throw new Error('No valid data received.');
        }
    } catch (error) {
        console.error(error);
        errorDiv.innerText = `Error fetching data: ${error.message}`;
    } finally {
        // Hide loading indicator
        loadingDiv.style.display = 'none';
    }
}

function displayNutritionPlan(result) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';

    // Create section for goal and description
    contentDiv.appendChild(createSection('section', `<h2>Goal: ${translateGoal(result.goal)}</h2><p>${result.description}</p>`));

    // Create section for nutrition data
    contentDiv.appendChild(createSection('section', `
        <h3>Daily Caloric Intake: ${result.calories_per_day} kcal</h3>
        <p>Carbohydrates: ${result.macronutrients?.carbohydrates || 'N/A'}</p>
        <p>Proteins: ${result.macronutrients?.proteins || 'N/A'}</p>
        <p>Fats: ${result.macronutrients?.fats || 'N/A'}</p>
    `));

    // Create section for meal suggestions
    const mealsSection = createSection('section', '<h3>Meal Suggestions</h3>');
    result.meal_suggestions.forEach(meal => {
        let mealDiv = createSection('meal', `<h4>${meal.meal}</h4>`);
        meal.suggestions.forEach(suggestion => {
            mealDiv.innerHTML += `
                <p><strong>${suggestion.name}</strong> (${suggestion.calories} kcal)</p>
                <p>Ingredients: ${suggestion.ingredients.join(', ')}</p>`;
        });
        mealsSection.appendChild(mealDiv);
    });
    contentDiv.appendChild(mealsSection);

    // Create SEO section
    if (result.seo_title && result.seo_content) {
        contentDiv.appendChild(createSection('section', `
            <h3>${result.seo_title}</h3>
            <p>${result.seo_content}</p>
            <p><strong>Keywords:</strong> ${result.seo_keywords}</p>
        `));
    }
}

function createSection(className, innerHTML) {
    const section = document.createElement('div');
    section.className = className;
    section.innerHTML = innerHTML;
    return section;
}

function translateGoal(goal) {
    const goals = {
        'muscle_gain': 'Muscle Gain',
        'weight_loss': 'Weight Loss',
        'weight_maintenance': 'Weight Maintenance'
    };
    return goals[goal] || goal;
}

function validateForm(data) {
    if (data.current_weight <= 0 || data.target_weight <= 0 || data.height <= 0 || data.age <= 0) {
        return 'Weight, height, and age must be positive numbers.';
    }
    if (data.target_weight === data.current_weight && data.goal !== 'weight_maintenance') {
        return 'Target weight is the same as current weight. Please select the correct goal.';
    }
    return null;
}
