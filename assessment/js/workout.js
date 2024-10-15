document.getElementById('generateBtn').addEventListener('click', function() {
    // 获取用户输入的参数
    const goal = document.getElementById('goal').value;
    const fitness_level = document.getElementById('fitness_level').value;

    const exercise_types = Array.from(document.querySelectorAll('#exercise_types input[type="checkbox"]:checked')).map(el => el.value);
    const equipment_available = Array.from(document.querySelectorAll('#equipment_available input[type="checkbox"]:checked')).map(el => el.value);
    const health_conditions = Array.from(document.querySelectorAll('#health_conditions input[type="checkbox"]:checked')).map(el => el.value);

    const days_per_week = parseInt(document.getElementById('days_per_week').value);
    const session_duration = parseInt(document.getElementById('session_duration').value);
    const plan_duration_weeks = parseInt(document.getElementById('plan_duration_weeks').value);
    const lang = document.getElementById('lang').value;

    // 构建请求体
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

    // 清空之前的结果
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<p>正在生成健身计划，请稍候...</p>';

    // 调用API
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
        // 检查是否有result字段
        if (data.result) {
            displayWorkoutPlan(data.result);
        } else {
            resultDiv.innerHTML = '<p>无法生成健身计划，请检查输入并重试。</p>';
        }
    })


    .then(data => {
        console.log("API response data:"); // Log the full response from the API
     
        // 检查是否有result字段 (Check if result exists)
        if (data.result) {
           console.log("Workout Plan Result:", data.result); // Log the result specifically
           displayWorkoutPlan(data.result);
        } else {
           console.log("No result found in the response."); // Log if there's no result
           resultDiv.innerHTML = '<p>无法生成健身计划，请检查输入并重试。</p>';
        }
     })





    .catch(error => {
        console.error('Error:', error);
        alert('生成健身计划时出错，请稍后重试。');
    });
});



// 新增函数，用于格式化并显示健身计划
function displayWorkoutPlan(plan) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // 清空内容

    // 创建标题
    const title = document.createElement('h2');
    title.textContent = `您的${plan.total_weeks}周健身计划`;
    resultDiv.appendChild(title);

    // 显示目标和健身水平
    const info = document.createElement('p');
    info.textContent = `目标：${translateGoal(plan.goal)} | 健身水平：${translateFitnessLevel(plan.fitness_level)} | 每周锻炼${plan.schedule.days_per_week}天，每次${plan.schedule.session_duration}分钟`;
    resultDiv.appendChild(info);

    // 遍历每一天的计划
    plan.exercises.forEach(dayPlan => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day-plan');

        const dayTitle = document.createElement('h3');
        dayTitle.textContent = dayPlan.day;
        dayDiv.appendChild(dayTitle);

        // 创建一个列表，展示当天的所有练习
        const exerciseList = document.createElement('ul');

        dayPlan.exercises.forEach(exercise => {
            const exerciseItem = document.createElement('li');

            // 创建练习名称
            const exerciseName = document.createElement('strong');
            exerciseName.textContent = exercise.name;
            exerciseItem.appendChild(exerciseName);

            // 创建练习详情
            const exerciseDetails = document.createElement('p');
            exerciseDetails.innerHTML = `
                ${exercise.duration ? `时长：${exercise.duration}` : ''}
                ${exercise.repetitions ? `<br>重复次数：${exercise.repetitions}` : ''}
                ${exercise.sets ? `<br>组数：${exercise.sets}` : ''}
                ${exercise.equipment ? `<br>器械：${translateEquipment(exercise.equipment)}` : ''}
            `;
            exerciseItem.appendChild(exerciseDetails);

            exerciseList.appendChild(exerciseItem);
        });

        dayDiv.appendChild(exerciseList);
        resultDiv.appendChild(dayDiv);
    });
}

// 辅助函数：翻译目标
function translateGoal(goal) {
    const goals = {
        'weight_loss': '减肥',
        'muscle_gain': '增肌',
        'endurance': '耐力'
    };
    return goals[goal] || goal;
}

// 辅助函数：翻译健身水平
function translateFitnessLevel(level) {
    const levels = {
        'beginner': '初学者',
        'intermediate': '中级',
        'advanced': '高级'
    };
    return levels[level] || level;
}

// 辅助函数：翻译器械
function translateEquipment(equipment) {
    const equipments = {
        'dumbbells': '哑铃',
        'yoga_mat': '瑜伽垫',
        'resistance_band': '弹力带',
        'no_equipment': '无器械'
    };
    return equipments[equipment] || equipment;
}
