import { Link } from "@tanstack/react-router";

const Navbar = () => {
  return (
    <nav className="navbar bg-base-100 px-10 shadow-sm">
      <div className="flex-1">
        <Link to="/">Dashboard</Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/products">商品列表</Link>
          </li>
          <li>
            <Link to="/products/create">建立商品</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
