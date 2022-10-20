const botones = document.getElementsByClassName("boton-addcart");
const cantidades = document.getElementsByClassName("card-cantidad-text");
const cantItems = document.getElementById("cantItems");
const botonesInfo = document.getElementsByClassName("card-moreinfo");
const ventanaMasInfo = document.querySelector("#mas-info-overlay");
const cerrarMasInfo = document.querySelector("#close-btn");
const infoProducto = document.querySelector("#infoProducto");

const btnBuscar = document.getElementById("btnBuscar");

let cantidadItems = 0;

let listaProductos = JSON.parse(localStorage.getItem("listadoProductos")) || [
    {id: 1, descripcion: "LUIGI BOSCA CABERNET", precio: 1000, stock: 10, img: "producto1.png", informacion: "Tinto de color rojo rubí profundo y brillante. Sus aromas son sutiles y equi­librados, con notas de frutos negros, especias y cuero. En boca es jugoso y expresivo, con taninos finos y firmes que se agarran. De paladar franco y fresco, con buen cuerpo y carácter vivaz, y final profundo en el que se aprecian los ahumados de la crianza en barricas de roble. Es un vino referente del varietal, con gran potencial de guarda."}, 
    {id: 2, descripcion: "JORGE RUBIO GRAN RESERVA", precio: 1500, stock: 10, img: "producto2.png", informacion: "Un vino especial para cualquier momento"}, 
    {id: 3, descripcion: "JORGE RUBIO MALBEC", precio: 1250, stock: 10, img: "producto3.png"},
    {id: 4, descripcion: "ANIMAL ORGANICO", precio: 1299, stock: 4, img: "producto4.png"},
    {id: 5, descripcion: "NUCHA ORGANICO", precio: 2550, stock: 0, img: "producto5.png"},
    {id: 6, descripcion: "SUSANA BALBO BRIOSO", precio: 5425, stock: 2, img: "producto6.png"},
    {id: 7, descripcion: "SUSANA BALBO SIGNATURE", precio: 2700, stock: 3, img: "producto7.png"},
    {id: 8, descripcion: "VINO BOCA 1905 BLEND", precio: 5500, stock: 1, img: "producto8.png"}];

class Producto {
    constructor(id, descripcion, precio, stock) {
        this.Id = id;
        this.Descripcion = descripcion;
        this.Precio = precio;
        this.Stock = stock;
    }

    static RestarStock (idProducto, cantidad){
        listaProductos[idProducto].stock -= cantidad;
        return listaProductos;
    }
}

class Compra{
    constructor (nroCompra, productos, total, estado){
        this.nroCompra = nroCompra;
        this.Productos = productos;
        this.Total = total;
        this.Estado = estado;
    }

    Agregar(idProducto){
        let posProducto = listaProductos.indexOf(listaProductos.find((elemento) => elemento.id == idProducto));

        let cantidadProducto = parseInt(cantidades[posProducto].value);

        if (cantidadProducto <= 0 || !(isInt(cantidadProducto))){
            alert("Cantidad inválida")
        }else{
            if (cantidadProducto <= listaProductos[posProducto].stock){
                let posProductoExistente = this.Productos.indexOf(this.Productos.find((elemento) => elemento.idProducto == idProducto));
                if (posProductoExistente != -1){
                    let cantActual = this.Productos[posProductoExistente].cantidadProducto;
                    this.Productos.splice(posProductoExistente, 1);
                    cantidadProducto += cantActual;
                }
                this.Productos.push({idProducto, cantidadProducto});
                Producto.RestarStock(posProducto, cantidadProducto);
                localStorage.setItem("listadoProductos", JSON.stringify(listaProductos));
                localStorage.setItem("itemsCarrito", JSON.stringify(this.Productos));
                cantidadItems = nuevaCompra.Productos.reduce((acumulador, prod) => acumulador + prod.cantidadProducto, 0);
                cantItems.innerHTML = cantidadItems;
            }else{
                alert(`No hay suficiente stock de ese producto. Quedan ${listaProductos[posProducto].stock} unidades.`);
            }
        }
    }

    MostrarCompra(){
        console.log(`Nro Compra: ${this.nroCompra}`);
        console.log(` Producto  |  Precio  |  Cantidad  |  Subtotal`);
        this.Productos.forEach(prod => {
            let posProducto = listaProductos.indexOf(listaProductos.find((elemento) => elemento.id == prod.idProducto));
            let subtotal = (listaProductos[posProducto].precio) * prod.cantidadProducto;
            console.log(`${listaProductos[posProducto].descripcion} | $${listaProductos[posProducto].precio} | ${prod.cantidadProducto} | $${subtotal}`);
            this.Total += subtotal;
        });
        console.log(`Subtotal: $${this.Total}`);
    }

    Mostrar(){
        let tabla = document.getElementById("carrito");

        listaEjemplo.forEach(producto => {
            let posProducto = listaProductos.indexOf(listaProductos.find((elemento) => elemento.id == producto.idProducto));
            let subtotal = (listaProductos[posProducto].precio) * prod.cantidadProducto;

            let item = document.createElement("tr");
            item.setAttribute("idProducto", producto.idProducto);
            tabla.append(item);

            let colDescripcion = document.createElement("td");
            colDescripcion.innerHTML = listaProductos[posProducto].descripcion;
            tabla.append(colDescripcion);

            let colPrecio = document.createElement("td");
            colPrecio.innerHTML = listaProductos[posProducto].precio;
            tabla.append(colPrecio);

            let colCantidad = document.createElement("td");
            colCantidad.innerHTML = producto.cantidadProducto;
            tabla.append(colCantidad);
            
            let colSubtotal = document.createElement("td");
            colSubtotal.innerHTML = subtotal;
            tabla.append(colSubtotal);
        })
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

const CargarProductos = (listaProductos) =>{
    const contenedor = document.getElementById("listadoProductos");
    contenedor.innerHTML ="";
    listaProductos.forEach((producto)=>{
        let item = document.createElement('div');
        item.setAttribute("class", "card");
        item.setAttribute("id", producto.id);
        item.innerHTML = `
           <img src="../assets/images/productos/${producto.img}" class="card-img-top" alt="${producto.img}">
           `;
        
        if (producto.stock == 0){
            item.innerHTML += `
                <div>
                    <img class="card-img-nostock" src="../assets/images/no-stock.png">
                </div>
            `;
        }

        item.innerHTML += `
           <button class="card-moreinfo">+ INFO</button>
           <div class="card-body">
             <label class="card-title">${producto.descripcion}</label>
             <p class="card-text">$${producto.precio}</p>
             <div class="card-cantidad">    
                <label for="cantidad">Cantidad:</label>
                <input class="card-cantidad-text" type="number" placeholder="0" min="0" max="${producto.stock}"> 
                <a href="#" id="${producto.id}" class="btn btn-primary boton-addcart" min="0" max="20">Comprar</a>
             </div>
         </div>
        `;
        
        contenedor.appendChild(item);
    });
    console.log(botones);
}

const MostrarInfoProducto = (idProducto) => {
    let unProducto = listaProductos.find((elemento) => elemento.id == idProducto);
    infoProducto.innerHTML = `
        <h3 class="masInfo_Titulo">${unProducto.descripcion}</h3>
        <p class="masInfo_texto"> ${unProducto.informacion ?? 'Información no disponible.'}</p>
        `;
}

// ---Búsqueda de productos en Tienda
const Buscar = (textoABuscar) => {
    let resultado = listaProductos.filter((elemento) => elemento.descripcion.toUpperCase().indexOf(textoABuscar.toUpperCase()) > -1);
    return resultado;
}

/*const finDeCompra = (e) => {
    switch (e.keyCode){
        case 70: //"F" finaliza compra
            let codigoDescuento = prompt("Ingrese código de descuento. 'N' si no tiene un código.");
            nuevaCompra.MostrarCompra();
            nuevaCompra.Total = nuevaCompra.ValidarDescuento(codigoDescuento.toLowerCase(), nuevaCompra.Total);
            console.log(`Cantidad de productos: ${cantidadItems} | Total: $${nuevaCompra.Total}`);
            
            idCompra++;
            listaDeCompra = [];
            nuevaCompra = new Compra(idCompra, listaDeCompra, 0, "activa");
            break;
        case 67: //"C" cancela compra
            nuevaCompra.CancelarCompra();
            listaDeCompra = [];
            nuevaCompra = new Compra(idCompra, listaDeCompra, 0, "activa");
    }
}

window.addEventListener("keydown", finDeCompra);*/

//Load de página
const stringURL = new URLSearchParams(window.location.search);
const textoBusqueda = stringURL.get("textoBusqueda");

textoBusqueda ? CargarProductos(Buscar(textoBusqueda)) : CargarProductos(listaProductos);

localStorage.setItem("listadoProductos", JSON.stringify(listaProductos));
const listaDeCompra = JSON.parse(localStorage.getItem("itemsCarrito")) || [];
let idCompra = 1;
nuevaCompra = new Compra(idCompra, listaDeCompra, 0, "activa");
cantidadItems = nuevaCompra.Productos.reduce((acumulador, prod) => acumulador + prod.cantidadProducto, 0);
cantItems.innerHTML = cantidadItems;

/*botones.forEach(boton => (e) => {
    e.preventDefault();
    nuevaCompra.Agregar(e.target.id);
})*/


//Agregar ítems al carrito
for(let i=0; i < botones.length; i++){
    const boton = botones[i];
    boton.onclick = (e) => {
        e.preventDefault();
        console.log(e);
        nuevaCompra.Agregar(e.target.id);
    }
}

//Búsqueda de productos en Tienda
btnBuscar.onclick = (e) =>{
    e.preventDefault();
    const textoBusqueda = document.getElementById("textoBusqueda").value;
    let listaBusqueda = Buscar(textoBusqueda);
    CargarProductos(listaBusqueda);
}

//Más información
for(let i=0; i < botonesInfo.length; i++){
    const boton = botonesInfo[i];
    boton.addEventListener("click", (e)=>{
        ventanaMasInfo.setAttribute("class", "open");
        let idProd = boton.parentElement.id;
        MostrarInfoProducto(idProd);
    })
}

cerrarMasInfo.addEventListener("click", () => {
    ventanaMasInfo.classList.remove("open");
})

