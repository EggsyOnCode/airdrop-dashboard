import { Provider } from "react-redux";
import store from "./store/store";
import "./App.css";
import ConfigPage from "./pages/SetConfig";
import DashboardPage from "./pages/Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ConfigPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
