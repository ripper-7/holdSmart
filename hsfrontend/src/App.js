import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './Components/RootLayout';
import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Portfolio from './Components/Portfolio';
import AddStock from './Components/AddStock';
import PrivateRoute from './Components/PrivateRoute';
import { ToastContainer } from "react-toastify";
 
function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />, 
      children: [
        { path: '/', element: <Home /> },
        { path: '/login', element: <Login /> },
        { path: '/signup', element: <Signup /> },
        { 
          path: '/portfolio', 
          element: (
            <PrivateRoute>
              <Portfolio />
            </PrivateRoute>
          ) 
        },
        { 
          path: '/addStock', 
          element: (
            <PrivateRoute>
              <AddStock />
            </PrivateRoute>
          ) 
        },
      ],
    },
  ]);

  return (
  <>
    <RouterProvider router={router} />
    <ToastContainer />
  </>);
}

export default App;
