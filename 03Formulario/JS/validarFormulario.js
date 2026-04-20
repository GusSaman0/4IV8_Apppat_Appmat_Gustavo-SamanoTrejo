function validar(formulario) {
    if(formulario.Login.trim().length < 3)
    {
        alert("Por favor ingrese un nombre mayor de 3 caracteres");
        formulario.nombre.focus();
        return false;
    }

    var abcOK = "qwertyuiopasdfghjklzxcvbnm QWERTYUIOPASDFGHJKLÑZXCVBNM";
    var checkString = formulario.nombre.value;
    var allValid = true;

    for (var i = 0; i < checkString.length; i++) { 
        var caracteres = checkString.charAt(i);
        for(j = 0; j < abcOK.length; j++) {
            if(caracteres == abcOK.charAt(j)) {
                break;
            }
        }
        if(!valido) {
            allValid = false;
            break;
        }
    }
    
    if(!allValid) {
        alert("Por favor escriba únicamente letras en el campo nombre");
        formulario.nombre.focus();
        return false;
    }

    if(formulario.password.value.trim().length < 3) {
        alert("Por favor ingrese la edad");
        formulario.password.focus();
        return false;
    }

    return true;
    var correoelectronico = /^[^@\s]+@[^@\.\s]+(\.[^@\.\s]+)+$/;
    var txt = formulario.gmail.value;
    alert("Email " + (correoelectronico.test(txt) ? "válido" : "inválido"));
}