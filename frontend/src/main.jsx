import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store from "./redux/store/store.js";
import { persistor } from "./redux/store/store.js";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            className="w-full max-w-md"
            toastClassName={() =>
              "relative flex p-4 min-h-16 rounded-lg justify-between overflow-hidden cursor-pointer bg-neutral-900 text-white mb-3"
            }
            bodyClassName={() => "text-sm font-medium block flex-grow"}
            progressClassName={() =>
              "Toastify__progress-bar--animated Toastify__progress-bar--dark absolute bottom-0 left-0 right-0 h-1 bg-green-500"
            }
          />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
