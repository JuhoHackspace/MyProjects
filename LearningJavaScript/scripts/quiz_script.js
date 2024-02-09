retrieveQuizes();

//Iterate over all the quiz links, quiz IDs, quiz submit buttons, code contents and outputs and add eventlisteners with the appropriate function calls 
for(let i = 1; i <= 8; i++) {
    //We use IIFE to create a new scope for each iteration. This allows the eventlistener to capture the correct element names
    (function(i) { 
        var link_name = 'show_quiz' + i;
        var quiz_name = 'quiz' + i;
        var output_name = 'output_' + i;
        var quiz_code_name = 'code_' +i;
        var submit_button_name = 'submit_quiz' + i;

        var link = document.getElementById(link_name);
        var submit_button = document.getElementById(submit_button_name);
        
        link.addEventListener("click", () => {
            showQuiz(quiz_name);
        });
        submit_button.addEventListener('click', () => {
            submitQuiz(quiz_name,quiz_code_name,output_name);
        });
    })(i);
}

//Show the selected quiz. This function hides all quizes by removing the active class from them, and activates the selected quiz
function showQuiz(quizId) {
    
    //Capture the scroll y position. This is used to prevent page jumping to the start when a new quiz is activated
    var currentScrollPosition = window.scrollY;

    //Clear the output
    document.getElementById("quiz_output").textContent = "";
    
    //Clear the result and set the background color to default
    var quiz_result = document.getElementById("quiz_result");
    quiz_result.textContent = "";
    quiz_result.style.backgroundColor= "#ccc";

    //Clear all blanks (span elements with classes blank_l and blank_s).
    var blanks = document.querySelectorAll('.blank_l, .blank_s');
    blanks.forEach(function (blank) {
        blank.textContent= "";
    });

    //Deactivate and hide all quizes
    var quizzes = document.querySelectorAll('.quiz');
    quizzes.forEach(function (quiz) {
        quiz.classList.remove('active');
    });

    // Show the selected quiz
    var selectedQuiz = document.getElementById(quizId);
    if (selectedQuiz) {
        selectedQuiz.classList.add('active');
    }
    
    //Force the scroll position to remain in the current position captured earlier
    requestAnimationFrame(() => {
        window.scrollTo(0, currentScrollPosition);
    });
}

//Remove editor intendation from the quiz pre elements. This identifies the common leading whitespace (where content starts in the first row), and trims all rows to that point
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

//Set compeleted quizes to session storage
function storeCompletedQuiz(quizID) {
    sessionStorage.setItem(quizID,'completed');
}

//Retrieve quiz status from session storage
function getQuizStatus(quizID) {
    return sessionStorage.getItem(quizID) === 'completed';
}

//Iterate over all quizes, retrieve the status and display it.
function retrieveQuizes() {
    for(let i = 1; i < 10; i++) {
        let quizname = 'quiz' + i;

        if(getQuizStatus(quizname)) {
            let element_name = 'completed_' + i;
            document.getElementById(element_name).textContent = "Completed";
        }
    }
}

//Sends the quiz to the server for execution
function submitQuiz(quizID,codeContent,answer) {
    //Retrieve the quiz code and the correct answer
    var code = document.getElementById(codeContent).textContent;
    var correctAnswer = document.getElementById(answer).textContent;
    var result = document.getElementById("quiz_result");
    var output = document.getElementById("quiz_output");

    fetch('https://runcode-k32h4hyj3a-uc.a.run.app', {
        method: 'POST',
        body: code
    })
    .then(response => response.text())
    .then(data => {
        console.log('Server Response:', data);
        output.innerHTML = data;
        
        if(data === correctAnswer) {
            result.innerHTML = "Correct!";
            result.style.backgroundColor = '#0f0';
            storeCompletedQuiz(quizID);
            retrieveQuizes(); //Immediately retrieve and display the completion status
        }else {
            result.innerHTML = "Oops! Try again."
            result.style.backgroundColor = '#f00';
        }
    })
    .catch(error => {
        output.innerHTML = "Error: Server offline";
    });
}