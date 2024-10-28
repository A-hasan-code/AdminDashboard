
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "../public/css/tailwind.css";
import { Provider } from 'react-redux';
import store from './Redux/store/Store';
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ToastContainer />
          <App />
        
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
