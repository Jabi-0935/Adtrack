import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PredictionProvider } from "./context/PredictionContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Methodology from "./pages/Methodology";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <Methodology /> },
      { path: "/methodology", element: <Methodology /> },
      { path: "/resources", element: <Resources /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    <PredictionProvider>
      <RouterProvider router={router} />
    </PredictionProvider>
  );
}

export default App;