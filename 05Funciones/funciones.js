//vamos a hacer un viaje en el tiempo y ahora vamos a programar todo bajo el esquema ES6

/*
Para javascript ya conocemos el concepto de variable

var

Se sustituye por las nuevas varibles:

let --> es una variable de tipo "protegida", ya que solo funciona dentro de un fragmento de codigo

const --> si es constante


if (true)
{
    const x = "x";
    console.log(x);
}

let x = "y";
console.log(x);


//para declarar en js las funciones hau una forma mas efectiva para declararlas y a partir de una funcion flecha

//Una funcion flecha en JS a diferencia de una funcion normal, no genera su propio contexto(this), necesita ser declarada antes de ser usada y no necesita un return

// funcion cosa(String hola){ this.hola = hola}

//vamos a hacer una funcion que sume dos numeros
function sumarnumeros(n1, n2)
{
    return n1+n2;
}

const sumarDosNumeros = (n1,n2) => n1 + n2;

console.log(`la suma de la funcion es: (2,3): ${sumarnumeros(2,3)}`);

console.log(`la suma de la funcion es: (2,3): ${sumarDosNumeros(4,3)}`);

//para armar una funcion flecha debemos entender su estructura:
//"cadena" (el tipo de variable, nombre de la funcion y los argumentos)=> operacion

*/


const razaDePerros = [
    "Gran Danes",
    "Doverman",
    "Chihuahua",
    "Pastor Aleman",
    "Pitbull",
    "San Bernardo",
    "Xoloscuincle"
];
/*
for(let i = 0; i < razaDePerros.length; i++){
    console.log(razaDePerros[i])
}

//toma la caja y recorre elemento por elemento
for(const raza of razaDePerros){
    console.log(raza)
}
//entra el numero de veces de ahi el indice
for(const indice in razaDePerros){
    console.log(razaDePerros[indice])
}

//Iterar sobre elementos de arreglo que devuelven nada
razaDePerros.forEach((raza, indice, arregloOruginal) => console.log(raza))

//Por Ejemplo
Necesitamos unba funcion para buscar la raza Chihuahua y sino existe agregala

//fimcopm ,a`esta fimcopm otera spnre ñps eñe,emtps deñ arregñp y regresa uin arreglo diferente con el podemos hacer los que queramos sin necesidad de modificar el arreglo original
*/

const razasDePerrosMayuscular = razaDePerros.map((raza,indice, arregloOriginal) => console.log(razaDePerros.toUpperCase()));

if(razaDePerros.find(raza => raza === "Chihuahua")){
    console.log("la raza si c encontro y es chihuahua");
    console.log(razaDePerros);
}else{
    razaDePerros.push("Chihuahua");
    console.log("La raza no se encontro");
    console.log(razaDePerros);
}