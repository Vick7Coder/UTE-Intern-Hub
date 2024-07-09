import React from 'react'
import AppRoutes from './routes/Routes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <>
      <ToastContainer autoClose={3000} closeOnClick={true} pauseOnHover={false} />
      <AppRoutes />
    
    </>

  )
}

export default App