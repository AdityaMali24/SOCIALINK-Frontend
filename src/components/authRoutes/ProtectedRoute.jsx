import React from 'react'
import { Navigate } from 'react-router-dom';
// import AppDrawer from '../AppDrawer';
import Home from '../Home';
import AppDrawer from '../AppDrawer';

const ProtectedRoute = () => {
    const auth = localStorage.getItem('token');
  return (
    <div>
      {
        auth?
        <>
        <AppDrawer/>
        </>
        : <Navigate to='/login'/>
      }
    </div>
    // <>
    //   {auth ? (
    //     <>
    //       <Home />
    //     </>
    //   ) : (
    //     <Navigate to="/login" />
    //   )}
    // </>
  )
}

export default ProtectedRoute