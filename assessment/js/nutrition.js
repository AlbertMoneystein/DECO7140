async function fetchNutritionPlan() {
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const contentDiv = document.getElementById('content');
    const infoBeforeLoadingDiv = document.getElementById('information-before-loading'); // 获取信息前的div



    // 在显示loading之前，显示 "information-before-loading" 部分内容
    infoBeforeLoadingDiv.style.display = 'block'; 
    loadingDiv.style.display = 'none'; // 确保loading暂时不显示

    // 模拟短暂停留以显示 "information-before-loading"（可选）
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒等待

    showLoading(loadingDiv, errorDiv, contentDiv);

    const url = 'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/nutritionAdvice?noqueue=1';
    const goal = document.getElementById('goal').value;

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

    const validationError = validateForm({
        current_weight: currentWeight,
        target_weight: targetWeight,
        height: height,
        age: age,
        goal: goal
    });

    if (validationError) {
        hideLoading(loadingDiv);
        showError(errorDiv, `Form error: ${validationError}`);
        return;
    }

    const requestData={
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

    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '3d4d69e460msh24610fb46443247p1d3432jsnc5adff07c4c7',
            'x-rapidapi-host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.result) {
            displayPlanBasics(contentDiv, data.result, data.result.description);
            displayNutritionPlan(data.result, contentDiv);
        } else {
            throw new Error('No valid data received.');
        }
    } catch (error) {
        showError(errorDiv, `Error fetching data: ${error.message}`);
    } finally {
        hideLoading(loadingDiv);
        infoBeforeLoadingDiv.style.display = 'none'; 
    }
}


function displayNutritionPlan(result, contentDiv) {
    const mealsSection = createSection('section', '<h3>Meal Suggestions</h3>');
    result.meal_suggestions.forEach((meal, index) => {
        // 添加类 'meal-item'，以便 CSS 处理颜色
        let mealDiv = createSection('div', `<h4>${meal.meal}</h4>`);
        mealDiv.classList.add('meal-item');  // 确保每个 meal 有相同的类

        meal.suggestions.forEach(suggestion => {
            mealDiv.innerHTML += `
                <p><strong>${suggestion.name}</strong> (${suggestion.calories} kcal)</p>
                <p>Ingredients: ${suggestion.ingredients.join(', ')}</p>`;
        });
        mealsSection.appendChild(mealDiv);
    });
    contentDiv.appendChild(mealsSection);
}





document.getElementById('generateNutritionPlanBtn').addEventListener('click', fetchNutritionPlan);
