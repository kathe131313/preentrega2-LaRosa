
// para saber si se ejecuta este script

console.log('se ejecuta el js')

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.login-form').addEventListener('submit', async function (e) {
        e.preventDefault(); 

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('login-message');
       // limpiar mensajes anteriores        
        messageDiv.classList.add('d-none'); 
        messageDiv.classList.remove('alert-success', 'alert-danger');
        messageDiv.innerHTML = ''; 
        //Validaciones
        if (email === '' || password === '') {
            showMessage('email y contraseña son obligatorias.', 'alert-danger');
            return;
        }

        //----------------- Validar formato de email--------------------------------------------------------
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('El email no tiene un formato válido.', 'alert-danger');
            return;
        }
        
        //------------------ Validar longitud de la contraseña (mínimo 8 caracteres)--------------------------
        if (password.length < 6) {
            showMessage('La contraseña debe tener al menos 6 caracteres.', 'alert-danger');
            return;
        }

        fetch('https://reqres.in/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => {
            // -------------------------Verifica si la respuesta fue exitosa-------------------------------------------
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(data => {
            // Aquí verificamos si el token está presente
            if (data.token) {
                showMessage('Login exitoso. Token: ' + data.token, 'alert-success');
                window.location.href = '../pages/pre3.html';
            } else {
                // Manejamos el caso donde el token no está presente
                showMessage('Email o contraseña incorrectos.', 'alert-danger');
            }
        })
        .catch(error => {
            showMessage('Error en la conexión.', 'alert-danger');
            console.error('Error:', error);
        });

        function showMessage(message, alertClass) {
            messageDiv.classList.remove('d-none');
            messageDiv.classList.add(alertClass);
            messageDiv.innerHTML = message;
        }
    });
});

