function conteo()
{
    var hombres = document.getElementById("hombres").value;
    var mujeres = document.getElementById("mujeres").value;

    const resultadoMasculino = document.getElementById("resultadoHombres");
    const resultadoFemenino = document.getElementById("resultadoMujeres");

    resultadoMasculino.textContent = "La cantidad de hombres es: " + hombres;
    resultadoFemenino.textContent = "La cantidad de mujeres es: " + mujeres;
    return false;
}