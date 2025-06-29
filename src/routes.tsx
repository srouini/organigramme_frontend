import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaseLayout from './layouts/BaseLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Dashboard/Settings/Index';
import LoginPage from "./pages/Login/Index"
import ProtectedRoute from './components/_ProtectedRoute';
import NotFoundPage from "./pages/NotFoundPage/Index"
import GradesPage from './pages/Grades/index';
import PositionsPage from './pages/Positions/index';
import OrganigrammesPage from './pages/Organigramme/index';



const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<ProtectedRoute ><BaseLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/grades" element={<GradesPage />} />
        <Route path="/positions" element={<PositionsPage />} />
        <Route path="/organigrammes" element={<OrganigrammesPage />} />
        <Route path="/organigrammes/:id" element={<OrganigrammesPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
