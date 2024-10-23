# Trabajo final
Este proyecto contiene para ser evaluado por el profesor los siguientes puntos y archivos:

* accesosocio.html(pant)
email:    "eve.holt@reqres.in"
password: "pistol"
* login.js
* analisis.js: Para probar use la vitamina D y todas las fechas así puede ver los mensajes dinámicos
* analisisSangre.js
* pre3.html
Se usa la API Reqres (https://reqres.in/)

* Se validan los campos como obligatorios, formato
* Al recibir el token, se accede a la pag pre3.html, la cual realiza los análisis de sangre realizado por el socio logueado
* Se utilizó una estructura de datos array de objeto, con sus formas de acceso y filtro
* Se uso operador ternario: 
 /* Este pedacito de código fue cambiado por el siguiente codigo con la finalidad de mejorarlo
    if (fechaEstudio === 'Todas') {
        // Si se selecciona "Todas", tomar todos los estudios filtrados
        estudiosPorFecha = estudiosFiltrados;
    } else {
        // Filtrar por la fecha seleccionada
        estudiosPorFecha = estudiosFiltrados.filter(estudio => estudio.fecha === fechaEstudio);
    }*/

    estudiosPorFecha = fechaEstudio === 'Todas'? estudiosFiltrados
        : estudiosFiltrados.filter(estudio => estudio.fecha === fechaEstudio);
* Se usó una librerís canva para gráficos
* Se modificó el DOM para mensajería dinámica


Nota: Se envió todo el proyecto para conservar los estilos y la forma original del proyecto en el modulo de Diseño Web, pero sólo debe corregir lo indicado arriba. 
Muchas Gracias!
