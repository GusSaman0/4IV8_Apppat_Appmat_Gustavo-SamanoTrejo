function validar(formulario) {
    // 1. Validar longitud
    if(formulario.formulario.trim(-length))
    {
        alert("Por favor ingrese un nombre mauyor de 3 caracteres");
        formulario.nombre.focus();
        return false;
    }

    // 2. Validar caracteres (Agregamos el espacio al final de abcOK)
    var abcOK = "qwertyuiopasdfghjklzxcvbnm QWERTYUIOPASDFGHJKLÑZXCVBNM";
    var checkString = formulario.nombre.value;
    var allValid = true;

    for (var i = 0; i < checkString.length; i++) { // Corregido el ;
        var caracteres = checkString.charAt(i);
        var j;
        for(j = 0; j < abcOK.length; j++) {
            if(caracteres == abcOK.charAt(j)) {
                break;
            }
        }
        if(j == abcOK.length) {
            allValid = false;
            break;
        }
    }
    
    if(!allValid) {
        alert("Por favor escriba únicamente letras en el campo nombre");
        formulario.nombre.focus();
        return false;
    }
    return true; // Es importante retornar true si todo sale bien
    if(formulario.nombre.value.trim().length < 3) {
        alert("Por favor ingrese la edad");
        formulario.nombre.focus();
        return false;
    }
    
    // 2.Validar caracteres 
    var abcOK = "1234567890 ";
    var checkString = formulario.nombre.value;
    var allValid = true;

    for(var i = 0; i < checkString.length; i++) { // Corregido el ;
        var caracteres = checkString.charAt(i);
        var j;
        for(j = 0; j < abcOK.length; j++) {
            if(caracteres == abcOK.charAt(j)) {
                break;
            }
        }
    }

    if(j == abcOK.length) {
        allValid = false;
        break;
    }

    if(!allValid) {
        alert("Por favor escriba únicamente números en el campo edad");
        formulario.nombre.focus();
        return false;
    }

    return true; // Es importante retornar true si todo sale bien
    var correoelectronico = /^[^@\s]+@[^@\.\s]+(\.[^@\.\s]+)+$/;
    var txt = formulario.email.value;
    alert("Email " + (correoelectronico.test(txt) ? "válido" : "inválido"));

}