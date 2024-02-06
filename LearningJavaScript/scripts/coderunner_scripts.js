const codeForm = document.getElementById('code_form');
const codebox = document.getElementById('codebox');

//Eventlistener and code submit function
codeForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const codeboxContent = codebox.value;
    
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

//Prevent default "Tab" key behaviour, and set it to add a tab to the codebox content
codebox.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
        event.preventDefault();

        const start = codebox.selectionStart;
        const end = codebox.selectionEnd;

        const tabCharacter = '\t';
        codebox.value = codebox.value.substring(0, start) + tabCharacter + codebox.value.substring(end);

        codebox.selectionStart = codebox.selectionEnd = start + tabCharacter.length;
    }
});

//Activate syntax highlighting and rownumbering in the code editor.
const editor = CodeMirror.fromTextArea(codebox, {
    mode: 'javascript',
    lineNumbers: true,
});