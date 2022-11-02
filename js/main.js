const botones = document.getElementsByClassName("boton-addcart");
let cantidades = document.getElementsByClassName("card-cantidad-text");
const cantItems = document.getElementById("cantItems");
const botonesInfo = document.getElementsByClassName("card-moreinfo");
const ventanaMasInfo = document.querySelector("#mas-info-overlay");
const cerrarMasInfo = document.querySelector("#close-btn");
const infoProducto = document.querySelector("#infoProducto");
const prodDestacadoExtranjero = document.querySelector("#productoDestacadoExtranjero");
const btnBuscar = document.getElementById("btnBuscar");
const contenedorProductos = document.getElementById("listadoProductos");
const contenedorMenorEdad = document.getElementById("ventaProhibida");

let cantidadItems = 0;
let listaProductos = JSON.parse(localStorage.getItem("listadoProductos")) || [];

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
        if (listaProductos.length == 0) { 
            listaProductos = JSON.parse(localStorage.getItem("listadoProductos"));
        };

        let posProducto = listaProductos.indexOf(listaProductos.find((elemento) => elemento.id == idProducto));
        let cantidadProducto = parseInt(cantidades[posProducto].value);
        let cantidadARestar = cantidadProducto;

        if (cantidadProducto <= 0 || !(isInt(cantidadProducto))){
            Toastify({
                text: "Cantidad inválida",
                style: {
                    height: "50px",
                  background: "red",
                }
              }).showToast();
        }else{
            if (cantidadProducto <= listaProductos[posProducto].stock){
                let posProductoExistente = this.Productos.indexOf(this.Productos.find((elemento) => elemento.idProducto == idProducto));
                if (posProductoExistente != -1){
                    let cantActual = this.Productos[posProductoExistente].cantidadProducto;
                    this.Productos.splice(posProductoExistente, 1);
                    cantidadProducto += cantActual;
                }
                mostrarMensaje_productoAgregado();
                this.Productos.push({idProducto, cantidadProducto});
                Producto.RestarStock(posProducto, cantidadARestar);
                localStorage.setItem("listadoProductos", JSON.stringify(listaProductos));
                localStorage.setItem("itemsCarrito", JSON.stringify(this.Productos));
                cantidadItems = nuevaCompra.Productos.reduce((acumulador, prod) => acumulador + prod.cantidadProducto, 0);
                cantItems.innerHTML = cantidadItems;
            }else{
                alert(`No hay suficiente stock de ese producto. Quedan ${listaProductos[posProducto].stock} unidades.`);
            }
        }
    }

    //Cancelación de compra
    CancelarCompra(){
        this.NroCompra = -1;
        this.Productos = [];
        this.Total = 0;
        this.Estado = "cancelada";
    }
}

function mostrarMensaje_productoAgregado(){
    Toastify({
        text: "Producto agregado con éxito",
        className: "aviso-productoAgregrado",
        style: {
            height: "50px",
            position: "center",
          background: "linear-gradient(to right, #451C17, #bda09e)",
        }
      }).showToast();
}

//Validación de la edad del cliente
function ValidarEdad(){

    let esMayor = sessionStorage.getItem("esMayor") || "unknown";
    if (esMayor == "unknown"){
        swal({
            title: "¿Eres mayor de edad?",
            text: "Prohibida la venta de alcohol a menores de 18 años.",
            icon: "warning",
            buttons: {
                aceptar: {text:"Sí, confirmo",value:"si"},
                cancelar: {text:"No, no lo soy", value:"no"}
            },
            dangerMode: true,
        })
        .then((value) => {
            if (value == "si") {
            esMayor = 'true';
            } else {
            esMayor = 'false';
            contenedorMenorEdad.style.display = 'block';
            contenedorProductos.style.display = 'none';
            }
            sessionStorage.setItem("esMayor", esMayor);
        });  
    }
    return esMayor;
}

const VerProductos = (lista) =>{
    lista.forEach(producto => {
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
            <p class="card-text">$${(producto.precio).toFixed(2)}</p>
            <div class="card-cantidad">    
                <label for="cantidad">Cantidad:</label>
                <input class="card-cantidad-text" type="number" placeholder="0" min="0" max="${producto.stock}"> 
                <a href="#" id="${producto.id}" class="btn btn-primary boton-addcart" min="0" max="20">Comprar</a>
            </div>
        </div>
        `;
        
        contenedorProductos.appendChild(item);
    })
}

const CargarProductos = () =>{
    contenedorProductos.innerHTML = "";
    fetch("../js/listaProductos.json")
    .then (response => response.json())
    .then (result => {
        let listaProductos = result.listaProductos;
        VerProductos(listaProductos);
        // listaProductos.forEach(producto => {
        //     let item = document.createElement('div');
        //     item.setAttribute("class", "card");
        //     item.setAttribute("id", producto.id);
        //     item.innerHTML = `
        //     <img src="../assets/images/productos/${producto.img}" class="card-img-top" alt="${producto.img}">
        //     `;
            
        //     if (producto.stock == 0){
        //         item.innerHTML += `
        //             <div>
        //                 <img class="card-img-nostock" src="../assets/images/no-stock.png">
        //             </div>
        //         `;
        //     }

        //     item.innerHTML += `
        //     <button class="card-moreinfo">+ INFO</button>
        //     <div class="card-body">
        //         <label class="card-title">${producto.descripcion}</label>
        //         <p class="card-text">$${(producto.precio).toFixed(2)}</p>
        //         <div class="card-cantidad">    
        //             <label for="cantidad">Cantidad:</label>
        //             <input class="card-cantidad-text" type="number" placeholder="0" min="0" max="${producto.stock}"> 
        //             <a href="#" id="${producto.id}" class="btn btn-primary boton-addcart" min="0" max="20">Comprar</a>
        //         </div>
        //     </div>
        //     `;
            
        //     contenedorProductos.appendChild(item);
        //     })
        localStorage.setItem("listadoProductos", JSON.stringify(listaProductos));
        listaProductos = JSON.parse(localStorage.getItem("listadoProductos"));
        AgregarBotones();
    })
    .catch((error) => contenedorProductos.innerHTML = `Error al cargar los productos. <br>Error: ${error}.`)
    return listaProductos;
}

const MostrarInfoProducto = (idProducto) => {
    if (listaProductos.length == 0){
        listaProductos = JSON.parse(localStorage.getItem("listadoProductos"));
    }
    let unProducto = listaProductos.find((elemento) => elemento.id == idProducto);
    infoProducto.innerHTML = `
        <h3 class="masInfo_Titulo">${unProducto.descripcion ?? 'No disponible'}</h3>
        <p class="masInfo_texto"> ${unProducto.informacion ?? 'Información no disponible.'}</p>
        `;
}

// ---Búsqueda de productos en Tienda
const Buscar = (textoABuscar) => {
    let resultado = listaProductos.filter((elemento) => elemento.descripcion.toUpperCase().indexOf(textoABuscar.toUpperCase()) > -1);
    return resultado;
}

// ---Busca en API de vinos un vino recomendado extranjero y lo muestra al azar
const obtenerVinoRandom = async() => {
    try{
        let response = await fetch("https://api.sampleapis.com/wines/reds");
        let resultados = await response.json();
        let vinoRandom = Math.floor(Math.random() * resultados.length);

        prodDestacadoExtranjero.innerHTML = `
            <div class="productoDestacadoExtranjero">
            <img src="${resultados[vinoRandom].image}" class="productoDestacadoExtranjero__imagen" alt="Producto destacado sin imagen">
            <p><label class="productoDestacadoExtranjero__nombre">${resultados[vinoRandom].wine} - RATING: ${resultados[vinoRandom].rating.average}</label></p>
            </div>
        `;       
    }catch (error){
        console.log(error);
    }
}

// ------- Funciones generales ------- //

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

// ------- Botones y Load de página ------- //

//Búsqueda de productos en Tienda
btnBuscar.onclick = (e) =>{
    e.preventDefault();
    const textoBusqueda = document.getElementById("textoBusqueda").value;
    let listaBusqueda = Buscar(textoBusqueda);
    contenedorProductos.innerHTML = "";
    VerProductos(listaBusqueda);
}

//Crear los botones de "Agregar" y "Mas info" para cada producto cuando carga la tienda
const AgregarBotones = () => {

    cantidades = document.getElementsByClassName("card-cantidad-text");

    for(let i=0; i < botones.length; i++){
        const boton = botones[i];
        boton.onclick = (e) => {
            e.preventDefault();
            console.log(e);
            nuevaCompra.Agregar(e.target.id);
        }
    }

    //Botones Más información
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
}

//Load de página
let esMayor = ValidarEdad();
if (esMayor == 'false'){
    contenedorMenorEdad.style.display = 'block';
}else{
    contenedorMenorEdad.style.display = 'none';
    let idCompra = 1;
    const listaDeCompra = JSON.parse(localStorage.getItem("itemsCarrito")) || [];
    nuevaCompra = new Compra(idCompra, listaDeCompra, 0, "activa");
    cantidadItems = nuevaCompra.Productos.reduce((acumulador, prod) => acumulador + prod.cantidadProducto, 0);
    cantItems.innerHTML = cantidadItems;
    const stringURL = new URLSearchParams(window.location.search);
    const textoBusqueda = stringURL.get("textoBusqueda");
    if (textoBusqueda){
        VerProductos(Buscar(textoBusqueda));
    }else{
        if (listaProductos.length > 0){
            VerProductos(listaProductos);
        }else{
            CargarProductos();
        }
    }
    AgregarBotones();
    //textoBusqueda ? CargarProductos(Buscar(textoBusqueda)) : CargarProductos(listaProductos);;
    
    obtenerVinoRandom();
}