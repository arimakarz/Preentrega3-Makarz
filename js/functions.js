const listaProductos = JSON.parse(localStorage.getItem("listaProductos"));
const listaDeCompra = JSON.parse(localStorage.getItem("itemsCarrito"));
const cantItems = document.getElementById("cantItems");
const btnBuscar = document.getElementById("btnBuscar");
const textoBusqueda = document.getElementById("textoBusqueda").value;

const contarItemsCarrito = () => {
    console.log(listaDeCompra);
    cantidadItems = listaDeCompra.reduce((acumulador, prod) => acumulador + prod.cantidadProducto, 0);
    cantItems.innerHTML = cantidadItems;
}

const Buscar = (textoABuscar) => {
    let resultado = listaProductos.filter((elemento) => elemento.descripcion == textoABuscar);
    return resultado;
}

btnBuscar.onclick = (e) =>{
    e.preventDefault();
    let listaBusqueda = Buscar(textoBusqueda);
    console.log(resultado);
    return listaBusqueda;
}

contarItemsCarrito();







