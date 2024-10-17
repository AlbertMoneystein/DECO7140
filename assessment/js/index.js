// js/index.js

const apiKey = '1b5521110c46785a3aedc441feee49af1b477fe9'; // 请替换为您的 API 密钥

const workoutContainer = document.getElementById('recommended-workouts');

function fetchRecommendedWorkouts() {
    // 获取一些初学者级别的练习作为推荐
    let apiUrl = 'https://wger.de/api/v2/exercise/?language=2&status=2&limit=3&difficulty=1';

    fetch(apiUrl, {
        headers: {
            'Authorization': `Token ${apiKey}`
        }
    })
    .then(response => response.json())
    .then(data => {
        let exercises = data.results;

        // 显示练习
        exercises.forEach(exercise => {
            displayExercise(exercise);
        });

        // 如果没有结果，显示提示
        if (exercises.length === 0) {
            workoutContainer.innerHTML = '<p>No recommended workouts available at the moment.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching workouts:', error);
    });
}

function displayExercise(exercise) {
    const card = document.createElement('div');
    card.classList.add('card');

    // 练习名称
    const title = document.createElement('h3');
    title.textContent = exercise.name;

    // 简短描述（截取前80个字符）
    const description = document.createElement('p');
    description.innerHTML = exercise.description ? exercise.description.substring(0, 80) + '...' : 'No description available.';

    // 详情按钮
    const button = document.createElement('button');
    button.textContent = 'View Details';
    button.addEventListener('click', () => {
        alert(`${exercise.name}\n\n${stripHtmlTags(exercise.description)}`);
    });

    // 将元素添加到卡片
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(button);

    // 将卡片添加到容器
    workoutContainer.appendChild(card);
}

function stripHtmlTags(str) {
    return str ? str.replace(/<[^>]*>?/gm, '') : '';
}

// 页面加载时获取推荐的健身计划
fetchRecommendedWorkouts();


function scrollToWorkout() {
    document.getElementById('workout-plan').scrollIntoView({
        behavior: 'smooth'
    });
}