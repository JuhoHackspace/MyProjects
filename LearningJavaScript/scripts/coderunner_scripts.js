document.getElementById('code_form').addEventListener('submit', function(event) {
    event.preventDefault();

    const codeboxContent = document.getElementById('codebox').value;

    fetch('https://runcode-k32h4hyj3a-uc.a.run.app', {
        method: 'POST',
        body: codeboxContent,
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById("code_output").textContent = data;
    })
    .catch(error => {
        document.getElementById("code_output").textContent = "Error: "+error;
    });
});

const codebox = document.getElementById('codebox');

codebox.addEventListener('keydown', function (event) {
    if (event.key === 'Tab') {
        event.preventDefault();

        const start = codebox.selectionStart;
        const end = codebox.selectionEnd;

        const tabCharacter = '\t';
        codebox.value = codebox.value.substring(0, start) + tabCharacter + codebox.value.substring(end);

        codebox.selectionStart = codebox.selectionEnd = start + tabCharacter.length;
    }
});

const editor = CodeMirror.fromTextArea(codebox, {
    mode: 'javascript',
    lineNumbers: true,
});