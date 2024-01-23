function showQuiz(quizId) {
    // Hide all quizzes
    var quizzes = document.querySelectorAll('.quiz');
    quizzes.forEach(function (quiz) {
        quiz.classList.remove('active');
    });

    // Show the selected quiz
    var selectedQuiz = document.getElementById(quizId);
    if (selectedQuiz) {
        selectedQuiz.classList.add('active');
    }
}