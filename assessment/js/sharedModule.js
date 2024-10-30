function toggleMenu() {
    var navLinks = document.getElementById("nav-links");
    navLinks.classList.toggle("show");
}

// 显示加载指示器
function showLoading(loadingDiv, errorDiv, contentDiv) {
    loadingDiv.style.display = 'block';
    errorDiv.innerText = '';
    contentDiv.innerHTML = '';
}

// 隐藏加载指示器
function hideLoading(loadingDiv) {
    loadingDiv.style.display = 'none';
}

// 验证表单数据
function validateForm(data) {
    if (data.current_weight <= 0 || data.target_weight <= 0 || data.height <= 0 || data.age <= 0) {
        return 'Weight, height, and age must be positive numbers.';
    }
    if (data.target_weight === data.current_weight && data.goal !== 'weight_maintenance') {
        return 'Target weight is the same as current weight. Please select the correct goal.';
    }
    return null;
}

// 显示错误信息
function showError(errorDiv, message) {
    errorDiv.innerText = message;
}

// 显示计划的基本信息（通用部分）
function displayPlanBasics(contentDiv, plan, description) {
    contentDiv.innerHTML = '';

    // 创建目标和描述部分
    contentDiv.appendChild(createSection('section', `<h2>Goal: ${translateGoal(plan.goal)}</h2><p>${description || ''}</p>`));
}

// 创建通用的 HTML section
function createSection(className, innerHTML) {
    const section = document.createElement('div');
    section.className = className;
    section.innerHTML = innerHTML;
    return section;
}

// Helper function: translate goal (通用)
function translateGoal(goal) {
    const goals = {
        'muscle_gain': 'Muscle Gain',
        'weight_loss': 'Weight Loss',
        'weight_maintenance': 'Weight Maintenance',
        'endurance': 'Endurance'
    };
    return goals[goal] || goal;
}
