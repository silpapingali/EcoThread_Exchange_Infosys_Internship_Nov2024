import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Home from './Components/Home';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';
import DashBoard from './Components/DashBoard';
import Items from './Components/Items';
import Trades from './Components/Trades';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/items" element={<Items />} />
        <Route path="/trades" element={<Trades />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
