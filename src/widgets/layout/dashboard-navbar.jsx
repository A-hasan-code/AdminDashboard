import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { useSelector, useDispatch } from "react-redux";
import {
  setOpenConfigurator,
  setOpenSidenav,
} from "@/Redux/slices/materialTailwindSlice"; // Adjust the import path

export function DashboardNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation
  const { fixedNavbar, openSidenav } = useSelector((state) => state.materialTailwind);
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const { isAuthenticated } = useSelector((state) => state.user); // Get authentication state

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard/profile"); // Navigate to Profile page
    }
  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${fixedNavbar ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5" : "px-0 py-1"}`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs className={`bg-transparent p-0 transition-all ${fixedNavbar ? "mt-1" : ""}`}>
            <Link to={`/${layout}`}>
              <Typography variant="small" color="blue-gray" className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100">
                {layout}
              </Typography>
            </Link>
            <Typography variant="small" color="blue-gray" className="font-normal">
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>
        <div className="flex items-center">
          <div className="mr-auto md:mr-4 md:w-56">
            <Input label="Search" />
          </div>
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => dispatch(setOpenSidenav(!openSidenav))}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
          {isAuthenticated ? (
            <IconButton variant="text" color="blue-gray" onClick={handleProfileClick}>
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
            </IconButton>
          ) : (
            <Link to="/auth/sign-in">
              <Button variant="text" color="blue-gray" className="hidden items-center gap-1 px-4 xl:flex normal-case">
                <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                Sign In
              </Button>
            </Link>
          )}
          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <BellIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </MenuHandler>
            <MenuList className="w-max border-0">
              <MenuItem className="flex items-center gap-3">
                <Avatar src="" alt="item-1" size="sm" variant="circular" />
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-1 font-normal">
                    <strong>New message</strong> from Laur
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="flex items-center gap-1 text-xs font-normal opacity-60">
                    <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/small-logos/logo-spotify.svg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-1 font-normal">
                    <strong>New album</strong> by Travis Scott
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="flex items-center gap-1 text-xs font-normal opacity-60">
                    <ClockIcon className="h-3.5 w-3.5" /> 1 day ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                  <CreditCardIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-1 font-normal">
                    Payment successfully completed
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="flex items-center gap-1 text-xs font-normal opacity-60">
                    <ClockIcon className="h-3.5 w-3.5" /> 2 days ago
                  </Typography>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
          <IconButton variant="text" color="blue-gray" >
            <Cog6ToothIcon to={"/dashboard/Settngs"} className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
