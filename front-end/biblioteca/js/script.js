const usuarios = {
    "usuario1": {
        senha: "123",
        id: 1 
    },
    "usuario2": {
        senha: "456",
        id: 2 
    }
};

const validarLogin = (username, password) => {
    if (usuarios[username] && usuarios[username].senha === password) {
        return true;  
    } else {
        return false;  
    }
};

document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();  

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (validarLogin(username, password)) {
        localStorage.setItem("usuarioLogado", username);
        localStorage.setItem("usuarioLogadoId", usuarios[username].id); 

        window.location.href = "pagina.html"; 
    } else {
        alert("Credenciais inválidas!");
    }
});
