async function fetchNutritionPlan() {
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const contentDiv = document.getElementById('content');

    // 显示加载指示器
    loadingDiv.style.display = 'block';
    errorDiv.innerText = '';
    contentDiv.innerHTML = '';

    const url = 'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/nutritionAdvice?noqueue=1';
    const goal = document.getElementById('goal').value;

    // 获取多选饮食限制
    const dietSelect = document.getElementById('diet');
    const diets = Array.from(dietSelect.selectedOptions).map(option => option.value);

    const currentWeight = parseFloat(document.getElementById('current_weight').value);
    const targetWeight = parseFloat(document.getElementById('target_weight').value);
    const activityLevel = document.getElementById('activity_level').value;
    const age = parseInt(document.getElementById('age').value, 10);
    const gender = document.getElementById('gender').value;
    const height = parseInt(document.getElementById('height').value, 10);
    const language = document.getElementById('language').value;

    // 获取多选活动类型
    const activityTypeSelect = document.getElementById('activity_type');
    const activityTypes = Array.from(activityTypeSelect.selectedOptions).map(option => option.value);

    // 获取多选过敏信息
    const allergiesSelect = document.getElementById('allergies');
    const allergies = Array.from(allergiesSelect.selectedOptions).map(option => option.value);

    // 获取多选餐食偏好
    const mealPreferencesSelect = document.getElementById('meal_preferences');
    const mealPreferences = Array.from(mealPreferencesSelect.selectedOptions).map(option => option.value);

    const budget = parseFloat(document.getElementById('budget').value);

    // 表单验证
    const validationError = validateForm({
        current_weight: currentWeight,
        target_weight: targetWeight,
        height: height,
        age: age,
        goal: goal
    });

    if (validationError) {
        loadingDiv.style.display = 'none';
        errorDiv.innerText = `表单错误：${validationError}`;
        return;
    }

    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '3d4d69e460msh24610fb46443247p1d3432jsnc5adff07c4c7', // 请替换为您的 RapidAPI 密钥
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
            if (response.status === 429) {
                throw new Error('请求过于频繁，请稍后再试。');
            } else {
                throw new Error(`请求失败，状态码：${response.status}`);
            }
        }

        const data = await response.json();

        if (data && data.result) {
            displayNutritionPlan(data.result);
        } else {
            throw new Error('未收到有效的数据。');
        }
    } catch (error) {
        console.error(error);
        errorDiv.innerText = `获取数据时出错：${error.message}`;
    } finally {
        // 隐藏加载指示器
        loadingDiv.style.display = 'none';
    }
}

function displayNutritionPlan(result) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';

    // 显示目标和描述
    const goalSection = document.createElement('div');
    goalSection.className = 'section';
    goalSection.innerHTML = `<h2>目标: ${translateGoal(result.goal)}</h2>
                             <p>${result.description}</p>`;
    contentDiv.appendChild(goalSection);

    // 显示每日热量摄入和宏量营养素分配
    const nutritionSection = document.createElement('div');
    nutritionSection.className = 'section';
    nutritionSection.innerHTML = `<h3>每日摄入热量: ${result.calories_per_day} kcal</h3>
                                  <p>碳水化合物: ${result.macronutrients.carbohydrates}</p>
                                  <p>蛋白质: ${result.macronutrients.proteins}</p>
                                  <p>脂肪: ${result.macronutrients.fats}</p>`;
    contentDiv.appendChild(nutritionSection);

    // 显示餐食建议
    const mealsSection = document.createElement('div');
    mealsSection.className = 'section';
    mealsSection.innerHTML = '<h3>餐食建议</h3>';
    result.meal_suggestions.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.className = 'meal';
        mealDiv.innerHTML = `<h4>${meal.meal}</h4>`;
        meal.suggestions.forEach(suggestion => {
            mealDiv.innerHTML += `<p><strong>${suggestion.name}</strong> (${suggestion.calories} kcal)</p>
                                  <p>原料: ${suggestion.ingredients.join(', ')}</p>`;
        });
        mealsSection.appendChild(mealDiv);
    });
    contentDiv.appendChild(mealsSection);

    // 显示SEO内容
    const seoSection = document.createElement('div');
    seoSection.className = 'section';
    seoSection.innerHTML = `<h3>${result.seo_title}</h3>
                            <p>${result.seo_content}</p>
                            <p><strong>关键词:</strong> ${result.seo_keywords}</p>`;
    contentDiv.appendChild(seoSection);
}

function translateGoal(goal) {
    const goals = {
        'muscle_gain': '增肌',
        'weight_loss': '减脂',
        'weight_maintenance': '维持体重'
        // 根据需要添加更多目标的翻译
    };
    return goals[goal] || goal;
}

function validateForm(data) {
    if (data.current_weight <= 0 || data.target_weight <= 0 || data.height <= 0 || data.age <= 0) {
        return '体重、身高和年龄必须为正数。';
    }
    if (data.target_weight === data.current_weight && data.goal !== 'weight_maintenance') {
        return '目标体重与当前体重相同，请选择正确的目标。';
    }
    // 添加更多验证规则
    return null;
}
