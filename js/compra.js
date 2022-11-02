let total;
const importeTotal = document.getElementById("importeTotal");
const importeDescuento = document.getElementById("importeDescuento");
const cantItems = document.getElementById("cantItems");
const validarCupon = document.getElementById("validarCupon");
const validarCupon_invalido = document.getElementById("validarCupon_invalido");
const vaciarCarrito = document.getElementById("cancelarCompra");
const finalizarCompra = document.getElementById("finalizarCompra");

let botonesEliminar;

let listaProductos = JSON.parse(localStorage.getItem("listadoProductos"));
let listaDeCompra = JSON.parse(localStorage.getItem("itemsCarrito"));

const Mostrar = () => {
    total = 0;
    let tabla = document.getElementById("carrito");
    tabla.innerHTML = "";

    if ((listaDeCompra == null) || (listaDeCompra.length <= 0)){
        const carritoVacio = document.getElementById("carritoVacio");
        carritoVacio.innerHTML = "No hay productos en el carrito de compras.";
        cantItems.innerHTML = "0";
    }else{
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
            colPrecio.innerHTML = `$ ${listaProductos[posProducto].precio.toFixed(2)}`;
            tabla.append(colPrecio);

            let colCantidad = document.createElement("td");
            colCantidad.innerHTML = producto.cantidadProducto;
            tabla.append(colCantidad);
            
            let colSubtotal = document.createElement("td");
            colSubtotal.innerHTML = `$ ${subtotal.toFixed(2)}`;
            tabla.append(colSubtotal);

            total += subtotal; console.log(total.toFixed(2));

            let colBtnEliminar = document.createElement("td");
            let btn = document.createElement('img');
            btn.id = producto.idProducto;
            btn.className = "boton-eliminar";
            btn.setAttribute("src", "../assets/images/trash.png");
            colBtnEliminar.appendChild(btn);
            tabla.append(colBtnEliminar);    
        })
        
        botonesEliminar = document.querySelectorAll(".boton-eliminar");
    
        contarItemsCarrito();
    }

    importeDescuento.innerHTML = `Descuento: $ 0.00`;
    importeTotal.innerHTML = `Total: $ ${total.toFixed(2)}`;
}

const contarItemsCarrito = () => {
    cantidadItems = listaDeCompra?.reduce((acumulador, prod) => acumulador + prod.cantidadProducto, 0) ?? 0;
    cantItems.innerHTML = cantidadItems;
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
    importeDescuento.innerHTML = `Descuento: $ ${descuento.toFixed(2)}`;
    importeTotal.innerHTML = `Total: $ ${total.toFixed(2)}`;
    return total;
}

const EliminarProducto = (idProducto) => {
    let index = listaDeCompra.indexOf(listaDeCompra.find((el) => el.idProducto == idProducto))
    let cantidad = listaDeCompra[index].cantidadProducto;
    listaDeCompra.splice(index, 1);
    let indexProducto = listaProductos.indexOf(listaProductos.find(el => el.id == idProducto));
    listaProductos[indexProducto].stock += cantidad;
    localStorage.setItem("listadoProductos", JSON.stringify(listaProductos));
    localStorage.setItem("itemsCarrito", JSON.stringify(listaDeCompra));
    return listaDeCompra;
}

validarCupon.onclick = (e) =>{
    e.preventDefault();
    let codigoIngresado = document.getElementById("cuponDescuento").value;
    if ((codigoIngresado != "") && ((codigoIngresado != "viole10") && (codigoIngresado!= "viole20"))){
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

const mostrarCompraFinalizada = (metodoPago) =>{
    const formularioPago = document.getElementById("formularioPago");
    formularioPago.style.display = 'none';

    botonesEliminar.forEach((boton)=>{
        boton.style.display='none';    
    })

    const resumenCompraConfirmada = document.getElementById("resumenCompraConfirmada");
    resumenCompraConfirmada.style.display = 'block';
    resumenCompraConfirmada.innerHTML = `
        <h3>¡SU COMPRA HA SIDO CONFIRMADA CON ÉXITO!</h3>

        <p>Pronto le llegará a su casilla de mail las instrucciones para el pago.</p>

        <p>Método de pago elegido: ${metodoPago}</p>

    `;

    listaDeCompra = [];
    localStorage.removeItem("itemsCarrito");
    contarItemsCarrito();
}

//Load de página
Mostrar();

//Eliminar ítem del carrito de compras
if (botonesEliminar != null && botonesEliminar.length > 0){
    for(let i = 0; i < botonesEliminar.length; i++){
        const boton = botonesEliminar[i];
        boton.onclick = (e) => {
            //e.preventDefault();
            swal({
                title: "¿Estás seguro que deseas eliminar este producto?",
                text: "Una vez eliminado, deberás volver a cargarlo en el carrito si lo deseas. \nSi habías cargado un cupón de descuento, deberás volver a cargarlo.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    EliminarProducto(e.target.id);
                    swal("¡Producto eliminado existosamente!", {
                        icon: "success",
                    });
                    setTimeout(() => {
                        location.reload();
                        Mostrar();
                    }, 2000);
                }
            });
        }
    }
}

//Vaciar carrito de compras
vaciarCarrito.onclick = (e) => {
    listaDeCompra.forEach((producto)=>{
        EliminarProducto(producto.idProducto);
    })
    localStorage.removeItem("itemsCarrito");
}

finalizarCompra.onclick = (e) => {
    e.preventDefault();
    if (cantidadItems > 0){
        const metodoPago = document.getElementById("metodoPago");
        mostrarCompraFinalizada(metodoPago.value);
    }
}

