import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Icon from "../components/Icon";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const navClass = ({ isActive }) =>
  `inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-slate-950 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
  }`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { totals } = useCart();

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
          <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-slate-950 text-white">
            <Icon name="bag" className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-black tracking-normal text-slate-950">
              MyStore
            </span>
            <span className="block text-xs font-medium text-slate-500">
              Modern commerce
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <NavLink to="/cart" className={navClass}>
            Cart
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={navClass}>
              Admin
            </NavLink>
          )}
          {user ? (
            <NavLink to="/account" className={navClass}>
              Account
            </NavLink>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navClass}>
                Register
              </NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 transition hover:border-slate-950"
            title="Cart"
          >
            <Icon name="bag" className="h-5 w-5" />
            {totals.count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-xs font-bold text-white">
                {totals.count}
              </span>
            )}
          </Link>
          {user && (
            <button
              type="button"
              onClick={logout}
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 transition hover:border-slate-950 md:inline-flex"
              title="Logout"
            >
              <Icon name="logout" className="h-5 w-5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 transition hover:border-slate-950 md:hidden"
            title="Menu"
          >
            <Icon name={isOpen ? "x" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            <NavLink to="/" end className={navClass} onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/cart" className={navClass} onClick={closeMenu}>
              Cart
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navClass} onClick={closeMenu}>
                Admin
              </NavLink>
            )}
            {user ? (
              <>
                <NavLink to="/account" className={navClass} onClick={closeMenu}>
                  Account
                </NavLink>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                  className="inline-flex items-center rounded-full px-3 py-2 text-left text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass} onClick={closeMenu}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={navClass}
                  onClick={closeMenu}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
