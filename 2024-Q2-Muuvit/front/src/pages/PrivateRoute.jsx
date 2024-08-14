import React from 'react'
import { useLoginData } from '../context/useLoginData'
import { Navigate, Outlet } from 'react-router-dom'

/**
 * PrivateRoute component is used to check if the user is logged in.
 * @returns {Element}
 */


export default function PrivateRoute() {
  const loginData = useLoginData();
  console.log("loginData.userName: ", loginData);

  if (!loginData.userName) {
      return <Navigate to="/login" />;
  }

  return <Outlet />;
}
