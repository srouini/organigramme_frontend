import "./App.css"
import ProtectedRoute from './components/ProtectedRoute';
import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import LoginPage from './pages/Login/Index';
import BaseLayout from './layouts/BaseLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Dashboard/Settings';
import NotFoundPage from "./pages/NotFoundPage/Index";
import GradesPage from './pages/Grades/index';
import PositionsPage from './pages/Positions/index';
import OrganigrammesPage from './pages/Structure/index';
import OrganigrammesDetailsPage from './pages/Structure/StructureDetails/index';
const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 10,
        },
      }}
    >
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <BaseLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />

          {/* Rotation Routes */}
          <Route path="/rotations/mrns" element={<GradesPage />} />
          <Route path="/grades" element={<GradesPage />} />
          <Route path="/positions" element={<PositionsPage />} />
          <Route path="/structures" element={<OrganigrammesPage />} />
          <Route path="/structures/:id" element={<OrganigrammesDetailsPage />} />
          
        </Route>



        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ConfigProvider>
  );
};

export default App;