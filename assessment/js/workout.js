async function fetchWorkoutPlan() {
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
    infoBeforeLoadingDiv.style.display = 'block'; 
    const url= 'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/generateWorkoutPlan?noqueue=1';

    const goal = document.getElementById('goal').value;
    const fitness_level = document.getElementById('fitness_level').value;
    const exercise_types = Array.from(document.querySelectorAll('#exercise_types input[type="checkbox"]:checked')).map(el => el.value);
    const equipment_available = Array.from(document.querySelectorAll('#equipment_available input[type="checkbox"]:checked')).map(el => el.value);
    const health_conditions = Array.from(document.querySelectorAll('#health_conditions input[type="checkbox"]:checked')).map(el => el.value);
    const days_per_week = parseInt(document.getElementById('days_per_week').value);
    const session_duration = parseInt(document.getElementById('session_duration').value);
    const plan_duration_weeks = parseInt(document.getElementById('plan_duration_weeks').value);
    const lang = document.getElementById('lang').value;

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

    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '3d4d69e460msh24610fb46443247p1d3432jsnc5adff07c4c7',
            'x-rapidapi-host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)

    }

    try {
        const response = await fetch(url, options);

        const data = await response.json();

        if (data.result) {
            displayPlanBasics(contentDiv, data.result);
            displayWorkoutPlan(data.result, contentDiv);
        } else {
            showError(errorDiv, 'Unable to generate workout plan, please check your inputs and try again.');
        }
    } catch (error) {
        showError(errorDiv, `Error: ${error.message}`);
    } finally {
        hideLoading(loadingDiv);
        infoBeforeLoadingDiv.style.display = 'none'; 
        
    }
}

function displayWorkoutPlan(plan, contentDiv) {
    const title = document.createElement('h2');
    title.textContent = `Your ${plan.total_weeks}-week workout plan`;  // 修正模板字符串语法
    contentDiv.appendChild(title);

    const info = document.createElement('p');
    info.textContent = `Goal: ${translateGoal(plan.goal)} | Fitness Level: ${translateFitnessLevel(plan.fitness_level)} | Work out ${plan.schedule.days_per_week} days per week, ${plan.schedule.session_duration} minutes per session`;  // 修正模板字符串语法
    contentDiv.appendChild(info);

    plan.exercises.forEach(dayPlan => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day-plan');
        const dayTitle = document.createElement('h3');
        dayTitle.textContent = dayPlan.day;
        dayDiv.appendChild(dayTitle);

        const exerciseList = document.createElement('ul');
        dayPlan.exercises.forEach(exercise => {
            const exerciseItem = document.createElement('li');
            const exerciseName = document.createElement('strong');
            exerciseName.textContent = exercise.name;
            exerciseItem.appendChild(exerciseName);

            const exerciseDetails = document.createElement('p');
            exerciseDetails.innerHTML = `
                ${exercise.duration ? `Duration: ${exercise.duration}` : ''}
                ${exercise.repetitions ? `<br>Repetitions: ${exercise.repetitions}` : ''}
                ${exercise.sets ? `<br>Sets: ${exercise.sets}` : ''}
                ${exercise.equipment ? `<br>Equipment: ${translateEquipment(exercise.equipment)}` : ''}
            `;  // 修正模板字符串语法
            exerciseItem.appendChild(exerciseDetails);
            exerciseList.appendChild(exerciseItem);
        });
        dayDiv.appendChild(exerciseList);
        contentDiv.appendChild(dayDiv);
    });
}




// 翻译健身等级和设备的专用函数
function translateFitnessLevel(level) {
    const levels = {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced'
    };
    return levels[level] || level;
}

function translateEquipment(equipment) {
    const equipments = {
        'dumbbells': 'Dumbbells',
        'yoga_mat': 'Yoga Mat',
        'resistance_band': 'Resistance Band',
        'no_equipment': 'No Equipment'
    };
    return equipments[equipment] || equipment;
}

document.getElementById('generateWorkoutPlanBtn').addEventListener('click', fetchWorkoutPlan);
