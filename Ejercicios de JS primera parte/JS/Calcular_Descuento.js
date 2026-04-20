function descuento() {
    var total = document.getElementById("total").value;
    var descuento = 0.15;

    const resultado = document.getElementById("resultado");
    resultado.textContent = "El total con descuento es: " + (total - (total * descuento)).toFixed(2);
    return false;
}