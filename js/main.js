let importeTotal = 0;
let cantItemsTotales = 0;
let edadCliente = 0;
let estadoCompra = "activa";

/*Creación del carrito de compras
Solicita al usuario que llene el carrito de compras. 
Precio unitario = -1 finaliza la compra. 
Precio unitario = -5 cancela la compra.*/

function AddItems(){
    let precioUnitario = 0;

    do{
        precioUnitario = parseFloat(prompt("Ingrese el precio unitario del vino. \nPrecio '-1' finaliza y confirma la compra. \nPrecio '-5' cancela la compra."));
        if ((precioUnitario <= 0) || !(isFloat(precioUnitario))){
            if (!isInt(precioUnitario)){
                alert("Valor incorrecto. El precio debe ser mayor a 0. \nIngrese nuevamente.");
            }
        }
    }while(((precioUnitario <= 0) && !(isFloat(precioUnitario))) || !(isInt(precioUnitario)))

    let cantItems = 0;
    while ((precioUnitario != -1) && (precioUnitario != -5)){
        do{
            cantItems = parseInt(prompt("Ingrese la cantidad"));
            if (cantItems <= 0){
                alert("Cantidad inválida. Ingrese nuevamente.");
            }
        }while(cantItems <= 0);

        cantItemsTotales += cantItems;
        importeTotal += precioUnitario * cantItems;

        alert(`Producto agregado. Subtotal: ${precioUnitario * cantItems}. Total: ${importeTotal}`);

        precioUnitario = prompt("Ingrese precio unitario del siguiente producto. \nPrecio '-1' finaliza y confirma la compra. \nPrecio '-5' cancela la compra.");
        if (precioUnitario == -5){
            CancelarCompra();
        }
    }
}

//Validación de código de descuento
function ValidarDescuento(codigo){
    switch (codigo){
        case "VIOLE10":
            importeTotal = importeTotal * 0.9;
            break;
        case "VIOLE20":
            importeTotal = importeTotal * 0.8;
            break;
        case "N", "n":
            break;
        default:
            alert("No existe ese código.");
            break;
    }
}

//Validación de la edad del cliente
function ValidarEdad(edadCliente){
    if (edadCliente >= 18){
        return true;
    }else{
        return false;
    }
}

//Cancelación de la compra
function CancelarCompra(){
    cantItemsTotales = 0;
    importeTotal = 0;
    estadoCompra = "cancelada";
    alert("Compra cancelada.");
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

//Simulador
do{
    edadCliente = parseInt(prompt("Venta de productos alcohólicos. Por favor ingrese su edad para continuar."));
    if ((edadCliente < 0) || !(isInt(edadCliente))){
        alert("Edad inválida. Ingrese nuevamente.")
    }
}while((edadCliente < 0) || !(isInt(edadCliente)));

if (ValidarEdad(edadCliente)){
    AddItems();
    if (estadoCompra == "activa"){
        let codigoDescuento = prompt("Ingrese código de descuento. 'N' si no tiene un código.");
        ValidarDescuento(codigoDescuento.toUpperCase());
        alert(`Muchas gracias por su compra. En el carrito hay ${cantItemsTotales} productos.`);
        alert(`El importe total es ${importeTotal}`);
    }
}else{
    alert("Prohibida la venta a menores de 18 años.");
}