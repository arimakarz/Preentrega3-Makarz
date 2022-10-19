let total;
const importeTotal = document.getElementById("importeTotal");
const importeDescuento = document.getElementById("importeDescuento");
const cantItems = document.getElementById("cantItems");
const validarCupon = document.getElementById("validarCupon");
const validarCupon_invalido = document.getElementById("validarCupon_invalido");
const vaciarCarrito = document.getElementById("cancelarCompra");

let botonesEliminar;

let listaProductos = JSON.parse(localStorage.getItem("listaProductos"));
const listaDeCompra = JSON.parse(localStorage.getItem("itemsCarrito"));

const Mostrar = () => {
    total = 0;
    botonesEliminar = [];
    if ((listaDeCompra == null) || (listaDeCompra.length <= 0)){
        console.log("vacio");
        const carritoVacio = document.getElementById("carritoVacio");
        carritoVacio.innerHTML = "No hay productos en el carrito de compras.";
    }else{
        let tabla = document.getElementById("carrito");

        tabla.innerHTML = `
            <th class="descripcion">Descripción</th>
            <th class="colClasica">$/u</th>
            <th class="colClasica">Cant.</th>
            <th class="colClasica">Subtotal</th>
            <th class="colEliiminar"> </th>
        `;

        listaDeCompra.forEach(producto => {
            let posProducto = listaProductos.indexOf(listaProductos.find((elemento) => elemento.id == producto.idProducto));
            let subtotal = (listaProductos[posProducto].precio) * producto.cantidadProducto;

            let item = document.createElement("tr");
            item.setAttribute("idProducto", producto.idProducto);
            tabla.append(item);

            let colDescripcion = document.createElement("td");
            colDescripcion.innerHTML = listaProductos[posProducto].descripcion;
            tabla.append(colDescripcion);

            let colPrecio = document.createElement("td");
            colPrecio.innerHTML = `$ ${listaProductos[posProducto].precio}`;
            tabla.append(colPrecio);

            let colCantidad = document.createElement("td");
            colCantidad.innerHTML = producto.cantidadProducto;
            tabla.append(colCantidad);
            
            let colSubtotal = document.createElement("td");
            colSubtotal.innerHTML = `$ ${subtotal}`;
            tabla.append(colSubtotal);

            total += subtotal; console.log(total);

            let colBtnEliminar = document.createElement("td");
            // let btn = document.createElement('input');
            // btn.id = producto.idProducto;
            // btn.type = "button";
            // btn.className = "boton-eliminar boton-envio";
            // btn.value = "Eliminar";
            //btn.innerHTML = '<img src="../assets/images/trash.jpeg"';
            let btn = document.createElement('img');
            btn.id = producto.idProducto;
            btn.className = "boton-eliminar";
            btn.setAttribute("src", "../assets/images/trash.png");
            colBtnEliminar.appendChild(btn);
            //colBtnEliminar.innerHTML = "Eliminar";
            //botonesEliminar.push(btn);
            tabla.append(colBtnEliminar);

            cantidadItems = listaDeCompra.reduce((acumulador, prod) => acumulador + prod.cantidadProducto, 0);
            cantItems.innerHTML = cantidadItems;
        })
        botonesEliminar = document.querySelectorAll(".boton-eliminar");
    }

    importeDescuento.innerHTML = `Descuento: $ 0`;
    importeTotal.innerHTML = `Total: $ ${total}`;
}

const ValidarDescuento = (codigo, total) =>{
    let descuento = 0;
    switch (codigo){
        case "viole10":
            descuento = total * 0.1;
            total = total * 0.9;
            break;
        case "viole20":
            descuento = total * 0.2;
            total = total * 0.8;
            break;
        case "":
            return 0;
        default:
            return -1;
            break;
    }
    importeDescuento.innerHTML = `Descuento: $ ${descuento}`;
    importeTotal.innerHTML = `Total: $ ${total}`;
    return total;
}

const EliminarProducto = (idProducto) => {
    console.log(`busco ${idProducto}`);
    let index = listaDeCompra.indexOf(listaDeCompra.find((el) => el.idProducto == idProducto))
    console.log(index);
    listaDeCompra.splice(index, 1);
    localStorage.setItem("itemsCarrito", JSON.stringify(listaDeCompra));
    return listaDeCompra;
}

validarCupon.onclick = (e) =>{
    e.preventDefault();
    let codigoIngresado = document.getElementById("cuponDescuento").value;
    if ((codigoIngresado != "") && ((codigoIngresado != "viole10") && (codigoIngresado!= "viole20"))){
        console.log("mostrar errir");
        validarCupon_invalido.classList.add("visible");
    }else{
        let descuento = ValidarDescuento(codigoIngresado, total);
        if (descuento > 0){
            total = descuento;
            validarCupon.classList.add("boton-disabled");
            validarCupon.setAttribute("disabled", true);
            validarCupon_invalido.classList.remove("visible");
        }
    }
}

vaciarCarrito.onclick = (e) => {
    localStorage.removeItem("itemsCarrito");
}

Mostrar();

if (botonesEliminar.length > 0){
    for(let i = 0; i < botonesEliminar.length; i++){
        const boton = botonesEliminar[i];
        boton.onclick = (e) => {
            //e.preventDefault();
            console.log(e);
            EliminarProducto(e.target.id);
            Mostrar();
        }
    }
}


