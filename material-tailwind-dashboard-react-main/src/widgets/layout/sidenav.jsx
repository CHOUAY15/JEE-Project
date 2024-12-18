import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav, setCollapsedSidenav } from "@/context";
import { useState } from "react";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav, collapsedSidenav } = controller;
  
  // Manage collapse state locally using useState
  const [isCollapsed, setIsCollapsed] = useState(collapsedSidenav);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed); // Toggle local collapse state
    setCollapsedSidenav(dispatch, !isCollapsed); // Update context
  };

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] ${
        isCollapsed ? "w-20" : "w-72"
      } rounded-xl transition-all duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className="relative">
        <Link to="/" className="py-6 px-8 text-center">
          <Typography
            variant="h6"
            color={sidenavType === "dark" ? "white" : "blue-gray"}
            className={`transition-all duration-300 ${isCollapsed ? "text-sm" : ""}`}
          >
            {isCollapsed ? brandName.charAt(0) : brandName}
          </Typography>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && !isCollapsed && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}
       {pages.map(({ icon, name, path, hidden }) => (
  !hidden && (
    <li key={name}>
      <NavLink to={`/${layout}${path}`}>
        {({ isActive }) => (
          <Button
            variant={isActive ? "gradient" : "text"}
            color={
              isActive
                ? sidenavColor
                : sidenavType === "dark"
                ? "white"
                : "blue-gray"
            }
            className={`flex items-center gap-4 ${
              isCollapsed ? "px-2 justify-center" : "px-4"
            } capitalize`}
            fullWidth
          >
            {icon}
            {!isCollapsed && (
              <Typography color="inherit" className="font-medium capitalize">
                {name}
              </Typography>
            )}
          </Button>
        )}
      </NavLink>
    </li>
  )
))}
          </ul>
        ))}
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <Button
          variant="text"
          color={sidenavType === "dark" ? "white" : "blue-gray"}
          className="flex items-center justify-center w-full"
          onClick={handleCollapse}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "Gestion de Surveillance",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
