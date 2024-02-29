import { Routes, Route, useNavigate } from 'react-router-dom'
import Signin from './Screens/Signin';
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate()

  useEffect(()=>{

  },[])


  return (
    <>
      <Routes>
        <Route path="/login" element={<Signin />} />
      </Routes>
    </>
  );
}

export default App;
