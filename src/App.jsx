import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PredictionProvider } from "./context/PredictionContext";
import { ConfigProvider } from "./context/ConfigContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Methodology from "./pages/Methodology";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <Methodology /> },
      { path: "/methodology", element: <Methodology /> },
      { path: "/resources", element: <Resources /> },
      { path: "/admin", element: <Admin /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    <ConfigProvider>
      <PredictionProvider>
        <RouterProvider router={router} />
      </PredictionProvider>
    </ConfigProvider>
  );
}

export default App;