import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store";
import App from "./App"; 
import "./index.css";

// Mount the React app into the root DOM node from index.html.
ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode enables extra development checks for safer React code.
  <React.StrictMode>
    {/* Provider makes the Redux store available to all components. */}
    <Provider store={store}>
      {/* BrowserRouter enables route-based navigation using the URL. */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);