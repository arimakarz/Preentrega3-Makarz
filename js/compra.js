let listaProductos = [
    {id: 1, descripcion: "LUIGI BOSCA CABERNET", precio: 1000, stock: 10}, 
    {id: 2, descripcion: "JORGE RUBIO GRAN RESERVA", precio: 1500, stock: 10}, 
    {id: 3, descripcion: "JORGE RUBIO MALBEC", precio: 1250, stock: 10},
    {id: 4, descripcion: "ANIMAL ORGANICO", precio: 1299, stock: 0},
    {id: 5, descripcion: "NUCHA ORGANICO", precio: 2550, stock: 5},
    {id: 6, descripcion: "SUSANA BALBO BRIOSO", precio: 5425, stock: 2},
    {id: 7, descripcion: "SUSANA BALBO SIGNATURE", precio: 2700, stock: 3},
    {id: 8, descripcion: "1905 BLEND", precio: 5500, stock: 1}];

class Producto {
    constructor(id, descripcion, precio, stock) {
        this.Id = id;
        this.Descripcion = descripcion;
        this.Precio = precio;
        this.Stock = stock;
    }

    static RestarStock (idProducto, cantidad){
        listaProductos[idProducto].stock -= cantidad;
    }
}

class Compra{
    constructor (nroCompra, productos, total, estado){
        this.nroCompra = nroCompra;
        this.Productos = productos;
        this.Total = total;
        this.Estado = estado;
    }

    AgregarProducto(){
        let nombreProducto = "";
        let cantidadProducto = 0;

        nombreProducto = (prompt("Ingrese el nombre del producto. \n'Listo' finaliza y confirma la compra. \n'Cancelar' cancela la compra.")).toUpperCase();
        while((nombreProducto != "LISTO") && (nombreProducto != "CANCELAR")){
            //let idProducto = listaProductos.indexOf(nombreProducto);
            let idProducto = listaProductos.indexOf(listaProductos.find((elemento) => elemento.descripcion == nombreProducto));
    
            if (idProducto != -1){
                do{
                    cantidadProducto = parseInt(prompt("Ingrese la cantidad"));
                    if (cantidadProducto <= 0){
                        alert("Cantidad inválida. Ingrese nuevamente.");
                    }
                }while(cantidadProducto <= 0);

                if (cantidadProducto <= listaProductos[idProducto].stock){
                    let indexProducto = this.Productos.indexOf(this.Productos.find((elemento) => elemento.idProducto == idProducto));
                    if (indexProducto != -1){
                        let cantActual = this.Productos[indexProducto].cantidadProducto;
                        this.Productos.splice(indexProducto, 1);
                        cantidadProducto += cantActual;
                    }
                    this.Productos.push({idProducto, cantidadProducto});
                    Producto.RestarStock(idProducto, cantidadProducto);
                }else{
                    alert(`No hay suficiente stock de ese producto. Quedan ${listaProductos[idProducto].stock} unidades.`);
                }
            }else{
                alert("No existe el producto. Ingrese nuevamente");
            }

            nombreProducto = (prompt("Ingrese el nombre del producto. \n'Listo' finaliza y confirma la compra. \n'Cancelar' cancela la compra.")).toUpperCase();
        }
        
        if(nombreProducto == "LISTO"){
            return this;
        }else if (nombreProducto == "CANCELAR"){
            this.CancelarCompra();
            return this;
        }
    }

    MostrarCompra(){
        console.log(`Nro Compra: ${this.nroCompra}`);
        console.log(` Producto  |  Precio  |  Cantidad  |  Subtotal`);
        this.Productos.forEach(prod => {
            let subtotal = (listaProductos[prod.idProducto].precio) * prod.cantidadProducto;
            console.log(`${listaProductos[prod.idProducto].descripcion} | $${listaProductos[prod.idProducto].precio} | ${prod.cantidadProducto} | $${subtotal}`);
            this.Total += subtotal;
        });
        console.log(`Subtotal: $${this.Total}`);
    }

    //Cancelación de compra
    CancelarCompra(){
        this.NroCompra = -1;
        this.Productos = [];
        this.Total = 0;
        this.Estado = "cancelada";
    }

    //Validación de código de descuento
    ValidarDescuento(codigo, total){
        switch (codigo){
            case "viole10":
                console.log(`Descuento: -$${total * 0.1}`);
                total = total * 0.9;
                break;
            case "viole20":
                console.log(`Descuento: -$${total * 0.2}`);
                total = total * 0.8;
                break;
            case "N", "n":
                console.log(`Descuento: $0.00`);
                break;
            default:
                alert("No existe ese código.");
                console.log(`Descuento: $0.00`);
                break;
        }
        return total;
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

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

//SIMULADOR
do{
    edadCliente = parseInt(prompt("Venta de productos alcohólicos. Por favor ingrese su edad para continuar."));
    if ((edadCliente < 0) || !(isInt(edadCliente))){
        alert("Edad inválida. Ingrese nuevamente.")
    }
}while((edadCliente < 0) || !(isInt(edadCliente)));

if (ValidarEdad(edadCliente)){
    let listaDeCompra = [];
    let nuevaCompra = new Compra(1, listaDeCompra, 0, "activa");
    nuevaCompra = nuevaCompra.AgregarProducto();

    console.log(nuevaCompra);

    if (nuevaCompra.Estado == "activa"){
        let codigoDescuento = prompt("Ingrese código de descuento. 'N' si no tiene un código.");
        nuevaCompra.MostrarCompra(nuevaCompra.Productos);
        nuevaCompra.Total = nuevaCompra.ValidarDescuento(codigoDescuento.toLowerCase(), nuevaCompra.Total);
        let cantidadItems = nuevaCompra.Productos.reduce((acumulador, prod) => acumulador + prod.cantidadProducto, 0);
        alert(`Muchas gracias por su compra. En el carrito hay ${cantidadItems} productos.`);
        alert(`El importe total es $${nuevaCompra.Total}`);
        console.log(`Total: $${nuevaCompra.Total}`);
    }else{
        alert("Compra cancelada.");
    }
}else{
    alert("Prohibida la venta a menores de 18 años.");
}
