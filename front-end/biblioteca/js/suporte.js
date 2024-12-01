document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const problema = document.querySelector("#descricaoProblema").value;

    if (problema.trim() === "") {
        alert("Por favor, descreva o seu problema antes de enviar.");
        return;
    }

    alert("Problema enviado com sucesso! Agradecemos por nos informar.");
    
    document.querySelector("#descricaoProblema").value = "";
});
