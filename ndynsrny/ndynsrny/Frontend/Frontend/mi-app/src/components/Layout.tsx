import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Layout() {
  const { usuario, logout } = useAuth();

  return (
    <>
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-lg py-sm max-w-container-max mx-auto bg-surface-container-low/80 backdrop-blur-xl border-b border-outline-variant/10 shadow-[0_0_20px_rgba(0,219,233,0.15)]" style={{ maxWidth: "1280px", left: "50%", transform: "translateX(-50%)" }}>
        <Link to="/" className="font-display-lg text-display-lg font-bold tracking-tighter text-primary-container no-underline">
          NEOVIX DYSON
        </Link>
        <nav className="hidden md:flex gap-xl items-center">
          <Link to="/" className="font-body-md text-body-md text-primary-container border-b-2 border-primary-container pb-1 no-underline">
            Inicio
          </Link>
          <Link to="/catalogo" className="font-body-md text-body-md text-on-surface-variant hover:text-primary-container transition-colors no-underline">
            Catálogo
          </Link>
          <Link to="/configurador" className="font-body-md text-body-md text-on-surface-variant hover:text-primary-container transition-colors no-underline">
            Configurador
          </Link>
        </nav>
        <div className="flex items-center gap-md">
          {usuario?.rol === "admin" && (
            <Link to="/admin" className="font-label-sm text-label-sm text-primary-container no-underline">
              Panel Admin
            </Link>
          )}
          <Link to="/carrito" className="p-sm text-on-surface-variant hover:bg-surface-container-highest/50 transition-all duration-300 rounded-lg no-underline">
            <span className="material-symbols-outlined">shopping_cart</span>
          </Link>
          {usuario ? (
            <div className="flex items-center gap-md">
              <span className="font-label-sm text-label-sm text-on-surface-variant">{usuario.nombre}</span>
              <button onClick={logout} className="p-sm text-on-surface-variant hover:bg-surface-container-highest/50 transition-all duration-300 rounded-lg">
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="p-sm text-on-surface-variant hover:bg-surface-container-highest/50 transition-all duration-300 rounded-lg no-underline">
              <span className="material-symbols-outlined">person</span>
            </Link>
          )}
        </div>
      </header>

      <main className="pt-2xl" style={{ paddingTop: "80px" }}>
        <Outlet />
      </main>

      <footer className="w-full py-xl px-lg grid grid-cols-1 md:grid-cols-4 gap-lg bg-surface-dim border-t border-outline-variant/20">
        <div className="col-span-1 md:col-span-1 flex flex-col gap-md">
          <div className="font-headline-md text-headline-md text-on-surface">NEOVIX DYSON</div>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            Engineering the next epoch of computational hardware with mathematical precision.
          </p>
          <div className="font-label-sm text-label-sm text-primary-fixed mt-lg">
            &copy; 2024 NEOVIX DYSON | ENGINEERING PRECISION
          </div>
        </div>
        <div className="flex flex-col gap-sm">
          <h5 className="font-label-md text-label-md text-on-surface mb-sm">HARDWARE</h5>
          <Link to="/catalogo" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors no-underline">Procesadores</Link>
          <Link to="/catalogo" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors no-underline">Tarjetas Gráficas</Link>
          <Link to="/catalogo" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors no-underline">Memoria RAM</Link>
          <Link to="/catalogo" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors no-underline">Placas Madre</Link>
        </div>
        <div className="flex flex-col gap-sm">
          <h5 className="font-label-md text-label-md text-on-surface mb-sm">SOPORTE</h5>
          <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors no-underline">Soporte Técnico</a>
          <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors no-underline">RMA Portal</a>
          <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors no-underline">Envíos Globales</a>
          <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors no-underline">FAQ</a>
        </div>
        <div className="flex flex-col gap-sm">
          <h5 className="font-label-md text-label-md text-on-surface mb-sm">RECURSOS</h5>
          <Link to="/configurador" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors no-underline">Configurador PC</Link>
          <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors no-underline">Newsletter</a>
          <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors no-underline">Portal Desarrollador</a>
          <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors no-underline">Sostenibilidad</a>
        </div>
      </footer>
    </>
  );
}
