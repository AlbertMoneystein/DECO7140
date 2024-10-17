function toggleMenu() {
    var navLinks = document.getElementById("nav-links");
    navLinks.classList.toggle("show");
}

function scrollToWorkout() {
    document.getElementById('workout-plan').scrollIntoView({
        behavior: 'smooth'
    });
}