import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PredictionProvider } from "./context/PredictionContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
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