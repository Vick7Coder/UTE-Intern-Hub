import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import { store } from "./redux/store.jsx";
import { Provider } from "react-redux";
import { ChatForm } from './components';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ChatForm />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
