retrieveQuizes();

function showQuiz(quizId) {
    // Hide all quizzes
    var currentScrollPosition = window.scrollY;

    document.getElementById("quiz_output").textContent = "";
    
    var quiz_result = document.getElementById("quiz_result");
    quiz_result.textContent = "";
    quiz_result.style.backgroundColor= "#ccc";

    var blanks = document.querySelectorAll('.blank_l, .blank_s');
    blanks.forEach(function (blank) {
        blank.textContent= "";
    });

    var quizzes = document.querySelectorAll('.quiz');
    quizzes.forEach(function (quiz) {
        quiz.classList.remove('active');
    });

    // Show the selected quiz
    var selectedQuiz = document.getElementById(quizId);
    if (selectedQuiz) {
        selectedQuiz.classList.add('active');
    }
   
    requestAnimationFrame(() => {
        window.scrollTo(0, currentScrollPosition);
    });
}

// Get the content of the <pre> element
var codeElements = document.getElementsByClassName('code');
for(let i = 0; i < codeElements.length; i++) {
    var codeContent = codeElements[i].innerHTML;

    // Identify the common leading whitespace
    var leadingWhitespace = codeContent.match(/^\s*/)[0];

    // Trim only the leading whitespace from each line
    var trimmedContent = codeContent
        .split('\n')
        .map(line => line.replace(new RegExp('^' + leadingWhitespace), ''))
        .join('\n');

    // Update the content of the <pre> element
    codeElements[i].innerHTML = trimmedContent;
}

function storeCompletedQuiz(quizID) {
    sessionStorage.setItem(quizID,'completed');
}

function getQuizStatus(quizID) {
    return sessionStorage.getItem(quizID) === 'completed';
}

function retrieveQuizes() {
    for(let i = 1; i < 4; i++) {
        let quizname = 'quiz' + i;

        if(getQuizStatus(quizname)) {
            let element_name = 'completed_' + i;
            document.getElementById(element_name).textContent = "Completed";
        }
    }
}

function submitQuiz(quizID,codeContent,answer) {
    var code = document.getElementById(codeContent).textContent;
    var correctAnswer = document.getElementById(answer).textContent;

    fetch('http://localhost:3000/runcode', {
        method: 'POST',
        body: code
    })
    .then(response => response.text())
    .then(data => {
        console.log('Server Response:', data);
        document.getElementById("quiz_output").textContent = data;

        if(data === correctAnswer) {
            document.getElementById("quiz_result").innerHTML = "Correct!";
            document.getElementById("quiz_result").style.backgroundColor = '#0f0';
            storeCompletedQuiz(quizID);
            retrieveQuizes();
        }else {
            document.getElementById("quiz_result").innerHTML = "Oops! Try again."
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("quiz_output").textContent = "Error: Server offline";
    });
}