var instrucciones = [
    "Utiliza las flechas de navegación para mover las piezas",
    "Para ordenar las piezas guiate por la imagen del Objetivo"
];

//Para ordenar los movimientos necesitamos un arreglo

var movimientos = [];

//tengo que saber cuales son las posiciones del rompecabezas original

var rompe = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

//necesitamos tra variable para saber donde que el orden del rompecabezas es correcto

var rompeCorrecta = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

//necesito conocer donde esta la pieza vacia

var filaVacia = 2;
var columnaVacia = 2;

//necesitamos una funcion que se encargue de mostrar la lista de instrucciones
function mostrarInstrucciones(instrucciones){
    for(var i = 0; i < instrucciones.length; i++){
        mostrarInstruccioneslista(instrucciones[i], "lista-instrucciones");
    }
}

function mostrarInstruccioneslista(instruccion, id){
    var li = document.createElement("li");
    var ul = document.getElementById(id);
    li.innerHTML = instruccion;
    ul.appendChild(li);
}