
import { useState, type FormEvent } from "react";
import "./index.css";

type Producto = {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
};

type EstadoPedido = "Pendiente" | "En proceso" | "Entregado";

type Pedido = {
  id: number;
  cliente: string;
  producto: string;
  cantidad: number;
  fecha: string;
  estado: EstadoPedido;
};

function App() {
  const [productos, setProductos] = useState<Producto[]>([]); /*Crea un arreglo vacío de productos. */
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const [nombre, setNombre] = useState("");/* useState crea un estado que guarda las cosas que van cambiando
   */
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const [cliente, setCliente] = useState("");
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [fecha, setFecha] = useState(
    new Date().toLocaleDateString("en-CA")
  );

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"error" | "exito">("exito");

  const mostrarMensaje = (texto: string, tipo: "error" | "exito") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
  };

  const registrarProducto = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !nombre.trim() ||
      !categoria.trim() ||
      precio.trim() === "" ||
      stock.trim() === ""
    ) {
      mostrarMensaje("Completa todos los campos del producto.", "error");
      return;
    }

    const precioNumero = Number(precio);
    const stockNumero = Number(stock);

    if (
      !Number.isFinite(precioNumero) ||
      !Number.isInteger(stockNumero) ||
      precioNumero <= 0 ||
      stockNumero < 0
    ) {
      mostrarMensaje("El precio debe ser mayor que cero y el stock un entero no negativo.", "error");
      return;
    }

    const nuevoProducto: Producto = {
      id: Date.now(),
      nombre: nombre.trim(),
      categoria: categoria.trim(),
      precio: precioNumero,
      stock: stockNumero,
    };

    setProductos((actuales) => [...actuales, nuevoProducto]);

    setNombre("");
    setCategoria("");
    setPrecio("");
    setStock("");

    mostrarMensaje("Producto registrado correctamente.", "exito");
  };

  const registrarPedido = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!cliente.trim() || !productoId || !cantidad || !fecha) {
      mostrarMensaje("Completa todos los campos del pedido.", "error");
      return;
    }

    const cantidadNumero = Number(cantidad);
    const productoSeleccionado = productos.find(
      (producto) => producto.id === Number(productoId)
    );

    if (!productoSeleccionado) {
      mostrarMensaje("Selecciona un producto válido.", "error");
      return;
    }

    if (!Number.isInteger(cantidadNumero) || cantidadNumero <= 0) {
      mostrarMensaje("La cantidad debe ser un número entero mayor que cero.", "error");
      return;
    }

    if (cantidadNumero > productoSeleccionado.stock) {
      mostrarMensaje("No hay suficiente stock para este pedido.", "error");
      return;
    }

    const nuevoPedido: Pedido = {
      id: Date.now(),
      cliente: cliente.trim(),
      producto: productoSeleccionado.nombre,
      cantidad: cantidadNumero,
      fecha,
      estado: "Pendiente",
    };

    setPedidos((actuales) => [...actuales, nuevoPedido]);

    setProductos((actuales) =>
      actuales.map((producto) =>
        producto.id === productoSeleccionado.id
          ? { ...producto, stock: producto.stock - cantidadNumero }
          : producto
      )
    );

    setCliente("");
    setProductoId("");
    setCantidad("");

    mostrarMensaje("Pedido registrado correctamente.", "exito");
  };

  const cambiarEstado = (id: number, nuevoEstado: EstadoPedido) => {
    setPedidos((actuales) =>
      actuales.map((pedido) =>
        pedido.id === id ? { ...pedido, estado: nuevoEstado } : pedido
      )
    );
  };

  const formatoPrecio = (valor: number) =>
    valor.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  return (
    <main className="contenedor">
      <header className="encabezado">
        <div>
          <span className="etiqueta">GESTIÓN COMERCIAL</span>
          <h1>Tienda Express</h1>
          <p>Administra tus productos y pedidos en un solo lugar.</p>
        </div>
        <div className="icono-tienda">TE</div>
      </header>

      <section className="resumen">
        <article className="tarjeta-resumen">
          <span>Productos registrados</span>
          <strong>{productos.length}</strong>
        </article>
        <article className="tarjeta-resumen">
          <span>Pedidos registrados</span>
          <strong>{pedidos.length}</strong>
        </article>
        <article className="tarjeta-resumen">
          <span>Pedidos pendientes</span>
          <strong>
            {pedidos.filter((pedido) => pedido.estado === "Pendiente").length}
          </strong>
        </article>
      </section>

      {mensaje && (
        <div className={`mensaje ${tipoMensaje}`} role="status">
          {mensaje}
          <button
            type="button"
            className="cerrar-mensaje"
            onClick={() => setMensaje("")}
            aria-label="Cerrar mensaje"
          >
            ×
          </button>
        </div>
      )}

      <section className="paneles">
        <section className="panel">
          <div className="titulo-panel">
            <span className="numero">01</span>
            <div>
              <h2>Registrar producto</h2>
              <p>Agrega artículos al inventario.</p>
            </div>
          </div>

          <form onSubmit={registrarProducto}>
            <label htmlFor="nombre">Nombre del producto</label>
            <input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Arroz"
              required
            />

            <label htmlFor="categoria">Categoría</label>
            <input
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Ej. Alimentos"
              required
            />

            <div className="fila">
              <div>
                <label htmlFor="precio">Precio (COP)</label>
                <input
                  id="precio"
                  type="number"
                  min="0.01"
                  step="any"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="5000"
                  required
                />
              </div>
              <div>
                <label htmlFor="stock">Stock inicial</label>
                <input
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="20"
                  required
                />
              </div>
            </div>

            <button className="boton principal" type="submit">
              + Registrar producto
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="titulo-panel">
            <span className="numero">02</span>
            <div>
              <h2>Registrar pedido</h2>
              <p>Registra una nueva compra de un cliente.</p>
            </div>
          </div>

          <form onSubmit={registrarPedido}>
            <label htmlFor="cliente">Nombre del cliente</label>
            <input
              id="cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Nombre completo"
              required
            />

            <label htmlFor="productoPedido">Producto</label>
            <select
              id="productoPedido"
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
              required
            >
              <option value="">Selecciona un producto</option>
              {productos.map((producto) => (
                <option
                  key={producto.id}
                  value={producto.id}
                  disabled={producto.stock === 0}
                >
                  {producto.nombre} — {formatoPrecio(producto.precio)} — Stock:{" "}
                  {producto.stock}
                </option>
              ))}
            </select>

            <div className="fila">
              <div>
                <label htmlFor="cantidad">Cantidad</label>
                <input
                  id="cantidad"
                  type="number"
                  min="1"
                  step="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  placeholder="1"
                  required
                />
              </div>
              <div>
                <label htmlFor="fecha">Fecha del pedido</label>
                <input
                  id="fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              className="boton principal"
              type="submit"
              disabled={productos.length === 0}
            >
              + Registrar pedido
            </button>
            {productos.length === 0 && (
              <p className="ayuda">Primero debes registrar un producto.</p>
            )}
          </form>
        </section>
      </section>

      <section className="panel listado">
        <div className="titulo-panel">
          <span className="numero">03</span>
          <div>
            <h2>Inventario de productos</h2>
            <p>Productos disponibles en la tienda.</p>
          </div>
        </div>

        {productos.length === 0 ? (
          <p className="vacio">Todavía no hay productos registrados.</p>
        ) : (
          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td className="nombre-tabla">{producto.nombre}</td>
                    <td>{producto.categoria}</td>
                    <td>{formatoPrecio(producto.precio)}</td>
                    <td>
                      <span
                        className={
                          producto.stock === 0 ? "stock agotado" : "stock"
                        }
                      >
                        {producto.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel listado">
        <div className="titulo-panel">
          <span className="numero">04</span>
          <div>
            <h2>Pedidos registrados</h2>
            <p>Consulta cada pedido y actualiza su estado.</p>
          </div>
        </div>

        {pedidos.length === 0 ? (
          <p className="vacio">Todavía no hay pedidos registrados.</p>
        ) : (
          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td className="nombre-tabla">{pedido.cliente}</td>
                    <td>{pedido.producto}</td>
                    <td>{pedido.cantidad}</td>
                    <td>{pedido.fecha}</td>
                    <td>
                      <select
                        className={`selector-estado estado-${pedido.estado
                          .toLowerCase()
                          .replace(" ", "-")}`}
                        value={pedido.estado}
                        onChange={(e) =>
                          cambiarEstado(
                            pedido.id,
                            e.target.value as EstadoPedido
                          )
                        }
                        aria-label={`Estado del pedido de ${pedido.cliente}`}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En proceso">En proceso</option>
                        <option value="Entregado">Entregado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer>
        Tienda Express · Aplicación de gestión de productos y pedidos
      </footer>
    </main>
  );
}

export default App;
