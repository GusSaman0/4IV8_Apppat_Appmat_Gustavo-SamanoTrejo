function calificacion() {
    var parcial1 = document.getElementById("parcial1").value;
    var parcial2 = document.getElementById("parcial2").value;
    var parcial3 = document.getElementById("parcial3").value;
    var examenFinal = document.getElementById("examenFinal").value;
    var trabajoFinal = document.getElementById("trabajoFinal").value;

    const resultado = document.getElementById("resultado");
    var promedioParciales = (parseFloat(parcial1) + parseFloat(parcial2) + parseFloat(parcial3)) / 3;
    var calificacionFinal = (promedioParciales * 0.55) + (parseFloat(examenFinal) * 0.30) + (parseFloat(trabajoFinal) * 0.15);
    resultado.textContent = "La calificación final es: " + calificacionFinal.toFixed(2);
    return false;
}