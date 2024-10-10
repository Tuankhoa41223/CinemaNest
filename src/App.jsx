import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import RouterClients from './routes/ClientRouters';
import AdminDashboard from './pages/admin/shares/AdminDashboard';
// import Dashboard from './pages/admin/Dashboard';
// import Formelements from './pages/admin/Formelements';
// import Chart from './pages/admin/Chart';
// import Table from './pages/admin/Table';
// import Icon from './pages/admin/Icon';
// import User from './pages/admin/User';
// import Header from './layouts/Header';
// import Footer from './layouts/Footer';
// import ItermCarousel from './layouts/ItermCarousel';
// import Home from './pages/client/Home';

function App() {
  return (
    <>
      <AdminDashboard/>  
      {/* <Header/> */}
      {/* <ItermCarousel/> */}
      {/* <Routes>
        {RouterClients.map((page, index) => (
          <Route
            key={index}
            path={page.path}
            element={<page.Component />}
          />
       
        ))}
      </Routes> */}
    </>
  );
}

export default App;
