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
        document.getElementById("code_output").textContent = "Error: Server offline";
    });
});

const codebox = document.getElementById('codebox');

    codebox.addEventListener('keydown', function (event) {
        if (event.key === 'Tab') {
            event.preventDefault();  // Prevent the default behavior (focus change)

            // Insert a tab character at the current cursor position
            const start = codebox.selectionStart;
            const end = codebox.selectionEnd;

            // Insert a tab character at the cursor position
            const tabCharacter = '\t';
            codebox.value = codebox.value.substring(0, start) + tabCharacter + codebox.value.substring(end);

            // Move the cursor to the end of the inserted tab
            codebox.selectionStart = codebox.selectionEnd = start + tabCharacter.length;
        }
    });

const editor = CodeMirror.fromTextArea(codebox, {
    mode: 'javascript',
    lineNumbers: true,
});