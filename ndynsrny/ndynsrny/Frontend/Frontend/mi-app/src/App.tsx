import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Catalogo } from "./pages/Catalogo";
import { DetalleProducto } from "./pages/DetalleProducto";
import { CarritoPage } from "./pages/CarritoPage";
import { ConfiguradorPC } from "./pages/ConfiguradorPC";
import { LoginRegister } from "./pages/LoginRegister";
import { PanelAdmin } from "./pages/PanelAdmin";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/producto/:id" element={<DetalleProducto />} />
            <Route path="/carrito" element={<CarritoPage />} />
            <Route path="/configurador" element={<ConfiguradorPC />} />
            <Route path="/login" element={<LoginRegister />} />
            <Route path="/admin" element={<PanelAdmin />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
