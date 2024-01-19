document.getElementById('code_form').addEventListener('submit', function(event) {
    event.preventDefault();

    const codeboxContent = document.getElementById('codebox').value;

    fetch('http://localhost:3000/runcode', {
        method: 'POST',
        body: codeboxContent,
    })
    .then(response => response.text())
    .then(data => {
        console.log('Server Response:', data);
        document.getElementById("code_output").textContent = data;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
const textarea = document.getElementById('codebox');

    textarea.addEventListener('keydown', function (event) {
        if (event.key === 'Tab') {
            event.preventDefault();  // Prevent the default behavior (focus change)

            // Insert a tab character at the current cursor position
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            // Insert a tab character at the cursor position
            const tabCharacter = '\t';
            textarea.value = textarea.value.substring(0, start) + tabCharacter + textarea.value.substring(end);

            // Move the cursor to the end of the inserted tab
            textarea.selectionStart = textarea.selectionEnd = start + tabCharacter.length;
        }
    });

    const codeBox = document.getElementById('codebox');
    const editor = CodeMirror.fromTextArea(codeBox, {
        mode: 'javascript',
        lineNumbers: true,
    });