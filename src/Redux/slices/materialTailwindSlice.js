// materialTailwindSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    openSidenav: false,
    sidenavColor: "dark",
    sidenavType: "white",
    transparentNavbar: true,
    fixedNavbar: false,
    openConfigurator: false,
    bodyColor: "light",
    navbarColor: "dark",
};

const materialTailwindSlice = createSlice({
    name: 'materialTailwind',
    initialState,
    reducers: {
        setOpenSidenav(state, action) {
            state.openSidenav = action.payload;
        },
        setSidenavType(state, action) {
            state.sidenavType = action.payload;
        },
        setSidenavColor(state, action) {
            state.sidenavColor = action.payload;
        },
        setTransparentNavbar(state, action) {
            state.transparentNavbar = action.payload;
        },
        setFixedNavbar(state, action) {
            state.fixedNavbar = action.payload;
        },
        setOpenConfigurator(state, action) {
            state.openConfigurator = action.payload;
        },
        setBodyColor(state, action) {
            state.bodyColor = action.payload;
        },
        setNavbarColor(state, action) {
            state.navbarColor = action.payload;
        },
    },
});

export const {
    setOpenSidenav,
    setSidenavType,
    setSidenavColor,
    setTransparentNavbar,
    setFixedNavbar,
    setOpenConfigurator,
    setBodyColor,
    setNavbarColor,
} = materialTailwindSlice.actions;

export default materialTailwindSlice.reducer;
