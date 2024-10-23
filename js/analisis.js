// Definición del Objeto rangosNormales para tener los rangos min y max de cada tipo de estudio
const rangosNormales = {
    'Vitamina D': { min: 30, max: 100 },
    'Glucosa': { min: 0.70, max: 1.10 },
    'TSH': { min: 0.40, max: 4.00 },
    'Triglicéridos': { min: 0, max: 150 },
    'Glóbulos Rojos': { min: 4.0, max: 6.0 },
    'Colesterol': { min: 0, max: 200 }
};

console.log(analisisSangre);
const contenedorAlertas = document.getElementById('alertasResultados');
// Referencias a los elementos HTML
const tipoEstudioSelect = document.getElementById('tipoEstudio');
const fechaEstudioSelect = document.getElementById('fechaEstudio');
const consultarBtn = document.getElementById('consultar');
const graficoCanvas = document.getElementById('graficoEstudios');
// Funcion para enviar mensajes generales
function mostrarMensaje(texto, tipo, contenedorId) {
    const contenedorMensajes = document.getElementById(contenedorId);
    contenedorMensajes.innerHTML = texto;
    contenedorMensajes.className = `alert alert-${tipo}`; // Cambia la clase según el tipo de mensaje
    contenedorMensajes.style.display = 'block'; // Muestra el contenedor
    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
        contenedorMensajes.style.display = 'none';
    }, 10000);
}
// Función para generar el gráfico
function generarGrafico(labels, data, estadoResultados, tipoEstudio) {
    const ctx = graficoCanvas.getContext('2d');

    // Destruir gráfico anterior si existe
    if (window.myChart) {
        window.myChart.destroy();
    }
    // Acceder a los rangos del tipo de estudio seleccionado
    const rango = rangosNormales[tipoEstudio];
    const rangoTexto = ` (Normal: ${rango.min} - ${rango.max})`;
    // Asegurar que las etiquetas y los datos estén alineados
    console.log("Etiquetas: ", labels);
    console.log("Datos: ", data);
    const datosValidos = data.filter(val => val !== null && val !== undefined && !isNaN(val));
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: `Resultado del estudio: ${tipoEstudio}${rangoTexto}`,
                data: datosValidos,
                backgroundColor: estadoResultados.map(estado => {
                    if (estado === 'normal') return '#61de7f'; // Azul para normal
                    if (estado === 'alto') return 'rgba(255, 99, 132, 0.2)';  // Rojo para alto
                    if (estado === 'bajo') return 'rgba(255, 206, 86, 0.2)';  // Amarillo para bajo
                }),
                borderColor: estadoResultados.map(estado => {
                    if (estado === 'normal') return 'rgba(54, 162, 235, 1)'; // Azul para normal
                    if (estado === 'alto') return 'rgba(255, 99, 132, 1)';  // Rojo para alto
                    if (estado === 'bajo') return 'rgba(255, 206, 86, 1)';  // Amarillo para bajo
                }),
                borderWidth: 1,
                fill: true,
                pointBackgroundColor: estadoResultados.map(estado => {
                    if (estado === 'normal') return 'rgba(54, 162, 235, 1)'; // Azul para normal
                    if (estado === 'alto') return 'rgba(255, 99, 132, 1)';  // Rojo para alto
                    if (estado === 'bajo') return 'rgba(255, 206, 86, 1)';  // Amarillo para bajo
                })
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        precision: 2 // Mostrar dos decimales
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `Resultados para: ${tipoEstudio}`, // Muestra el nombre del estudio en la parte superior
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}
// Función para verificar si el valor está en el rango normal, bajo o alto
function verificarEstado(tipoEstudio, resultado) {
    const rango = rangosNormales[tipoEstudio];

    if (resultado < rango.min) {
        return 'bajo';
    } else if (resultado > rango.max) {
        return 'alto';
    } else {
        return 'normal';
    }
}
// Función para agregar una alerta dinámica en el DOM
function agregarAlerta(tipoEstudio, resultado, fecha, estado) {
    // Crear el div de la alerta
    const alerta = document.createElement('div');
    alerta.classList.add('alert', 'alert-warning');
    alerta.role = 'alert';
    alerta.innerHTML = `El resultado del estudio de <strong>${tipoEstudio}</strong> de fecha <strong>${fecha}</strong>  es <strong>${resultado}</strong>, lo cual es <strong>${estado.toUpperCase()}</strong>.`;

    // Agregar la alerta al contenedor
    contenedorAlertas.appendChild(alerta);
}
// Función para limpiar las alertas del DOM
function limpiarAlertas() {
    contenedorAlertas.innerHTML = '';
}
// Función para consultar y mostrar resultados en el gráfico
function consultarResultados() {
    const tipoEstudio = tipoEstudioSelect.value;
    const fechaEstudio = fechaEstudioSelect.value;
    if (!tipoEstudio) {
        mostrarMensaje('Por favor, seleccione un tipo de estudio.', 'warning', 'contenedorMensajesGenerales');
        return;
    }
    // Filtrar los datos por tipo de estudio
    const estudiosFiltrados = analisisSangre.filter(estudio => estudio.tipoEstudio === tipoEstudio);
    let estudiosPorFecha = [];
   
    estudiosPorFecha = fechaEstudio === 'Todas'? estudiosFiltrados
        : estudiosFiltrados.filter(estudio => estudio.fecha === fechaEstudio);
    //--------Se uso un operador ternario-------------------------------------------------------------------------------
    if (estudiosPorFecha.length === 0) {
        mostrarMensaje('Por favor, seleccione opcion de fecha de estudio.', 'warning', 'contenedorMensajesGenerales');
        return;
    }
    // Limpiar las alertas previas
    limpiarAlertas();

    // Obtener las etiquetas (fechas) y los datos (resultados)
    const etiquetas = estudiosPorFecha.map(estudio => estudio.fecha);
    const resultados = estudiosPorFecha.map(estudio => estudio.resultado);

    // Evaluar el estado de cada resultado (normal, alto, bajo)
    const estadoResultados = estudiosPorFecha.map(estudio => {
        const estado = verificarEstado(estudio.tipoEstudio, estudio.resultado);

        // Si el resultado está fuera de rango, agregar una alerta, se activa la alerta dinámica
        if (estado !== 'normal') {
            agregarAlerta(estudio.tipoEstudio, estudio.resultado, estudio.fecha, estado);
        }

        return estado;
    });
    // Generar el gráfico con el estado de los resultados
    generarGrafico(etiquetas, resultados, estadoResultados, tipoEstudio);
}
// Agregar evento al botón de consultar
consultarBtn.addEventListener('click', consultarResultados);