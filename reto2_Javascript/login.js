document.getElementById('loginForm').addEventListener('submit', login);

function login(event) {
    event.preventDefault(); 
    const email = document.querySelector('[name="email"]').value;
    const password = document.querySelector('[name="password"]').value;
    const rememberMe = document.querySelector('[name="remember"]').checked;

    if (email && password) {
        if (rememberMe) {
            localStorage.setItem('email', email);
        } else {
            localStorage.setItem('email', email);
        }

        window.location.href = 'index.html';
    } else {
        alert('Por favor ingresa un email y contraseña');
    }
}

function checkLogin() {
    if (localStorage.getItem('email') || sessionStorage.getItem('email')) {
        console.log('El usuario está logueado');
    }
}

window.onload = checkLogin;
