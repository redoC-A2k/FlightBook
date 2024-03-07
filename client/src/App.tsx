import { Routes, Route, useNavigate } from 'react-router-dom'
import Signin from './Screens/Signin';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast'
import Signup from './Screens/Signup';
import Home from './Screens/Home';
import Bookings from './Screens/Bookings';
import AdminSignin from './Screens/Admin/Signin';
import AdminHome from './Screens/Admin/Home';
import AddFlight from './Screens/Admin/AddFlight';

function App() {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true" ? true : false)

  useEffect(() => {
    if (isAdmin === false) {
      console.log(token)
      console.log(`${process.env.REACT_APP_FRONTEND}/signin`)
      console.log(
        window.location.href === `${process.env.REACT_APP_FRONTEND}/signin` ||
        window.location.href === `${process.env.REACT_APP_FRONTEND}/signup`)
      if (token &&
        (window.location.href === `${process.env.REACT_APP_FRONTEND}/signin` ||
          window.location.href === `${process.env.REACT_APP_FRONTEND}/signup`)) {
        navigate('/')
      } else if(!token) navigate('/signin')
    } else {
      console.log(
        window.location.href === `${process.env.REACT_APP_FRONTEND}/signin` ||
        window.location.href === `${process.env.REACT_APP_FRONTEND}/signup`)
      if (token &&
        (window.location.href === `${process.env.REACT_APP_FRONTEND}/admin/signin` ||
          window.location.href === `${process.env.REACT_APP_FRONTEND}/admin/signup`)) {
        navigate('/')
      } else if(!token) navigate('/signin')
    }
  }, [token, isAdmin])




  return (
    <>
      <Toaster
        toastOptions={{
          success: {
            style: {
              padding: '10px',
              marginTop: "1rem"
            },
            // duration: 500
          },
        }} />
      <Routes>
        <Route path="/signin" element={<Signin token={token} setToken={setToken} />} />
        <Route path="/signup" element={<Signup token={token} setToken={setToken} />} />
        <Route path="/bookings" element={<Bookings token={token} />} />
        <Route path='/admin/signin' element={<AdminSignin token={token} setToken={setToken} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />} />
        {isAdmin ?
          <>
            <Route path='/admin/flight/add' element={<AddFlight token={token} setToken={setToken} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />} />
            <Route path='/' element={<AdminHome token={token} setToken={setToken} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />} />
          </>
          :
          <Route path='/' element={<Home token={token} setToken={setToken} />} />}
      </Routes>
    </>
  );
}

export default App;
