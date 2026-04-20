function edad() {
    var añoNacimiento = document.getElementById("añoNacimiento").value;
    var añoActual = new Date().getFullYear();
    var edad = añoActual - añoNacimiento;
    document.getElementById("resultado").textContent = "La edad es: " + edad;
    return false;
}