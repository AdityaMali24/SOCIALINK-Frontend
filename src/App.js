
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from './components/SignIn/SignUp';
import ProtectedRoute from './components/authRoutes/ProtectedRoute';
import PublicRoute from './components/authRoutes/PublicRoute';
import Home from './components/Home';
import SignIn from './components/SignIn/SignIn';
import EditProfile from './components/Profile/EditProfile';
import BasicGrid from './components/Grid/BasicGrid';
import ViewProfile from './components/ViewProfile';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/" element={<BasicGrid />} index="true" />
            <Route path="/view-profile" element={<ViewProfile/>} />
            <Route path="/edit-profile" element={<EditProfile/>} />
          </Route>

          <Route path="/" element={<PublicRoute />}>
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
