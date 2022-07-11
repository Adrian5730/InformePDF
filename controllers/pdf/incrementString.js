//Creo la funcion que suma 1 en la cadena de numeros
let incrementString = (cadena) => {
    er = /(\d)*$/;
    numeros = er.exec(cadena)[0];
    longitud = numeros.length;
    incremento = parseInt(numeros || 0) + 1;
    strIncremento = incremento.toString().padStart(longitud, "0");
    nuevaCadena = cadena.substring(0, cadena.length - longitud) + strIncremento;
    return nuevaCadena
}

module.exports = incrementString;