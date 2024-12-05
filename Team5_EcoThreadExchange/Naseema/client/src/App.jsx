import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Home from './Components/Home';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';
import DashBoard from './Components/DashBoard';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/home" element={<Home></Home>}></Route>
        <Route path="/forgotPassword" element={<ForgotPassword/>}></Route>
        <Route path="/resetPassword/:token" element={<ResetPassword/>}></Route>
        <Route path="/dashboard" element={<DashBoard/>}></Route>
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;
