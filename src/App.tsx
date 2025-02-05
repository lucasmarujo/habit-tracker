import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { HabitsProvider } from './contexts/HabitsContext';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Auth from './pages/Auth';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-emerald-600 dark:text-emerald-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HabitsProvider>
          <Router>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/*"
                element={
                  <PrivateRoute>
                    <div className="min-h-screen bg-emerald-50 dark:bg-gray-900 transition-colors">
                      <Sidebar />
                      <div className="lg:ml-64">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/calendar" element={<Calendar />} />
                        </Routes>
                      </div>
                    </div>
                  </PrivateRoute>
                }
              />
            </Routes>
          </Router>
        </HabitsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App