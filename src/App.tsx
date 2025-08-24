import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppLayout from "./components/layout/AppLayout";
import { Protected } from "./app/guards";
import { AnimatePresence, motion } from "framer-motion";

// страницы
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TasksPage from "./pages/TasksPage";
import TaskHistoryPage from "./pages/TaskHistoryPage";
import UsersPage from "./pages/UsersPage";
import ModerationPage from "./pages/ModerationPage";
import MePage from "./pages/MePage";

export default function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <AppLayout>
        {/* AnimatePresence будет ловить смену маршрутов */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Домашняя открыта для всех */}
            <Route
              index
              element={
                <PageTransition>
                  <HomePage />
                </PageTransition>
              }
            />

            {/* Аутентификация */}
            <Route
              path="/login"
              element={
                <PageTransition>
                  <LoginPage />
                </PageTransition>
              }
            />
            <Route
              path="/register"
              element={
                <PageTransition>
                  <RegisterPage />
                </PageTransition>
              }
            />

            {/* Закрытые разделы */}
            <Route
              path="/tasks"
              element={
                <Protected>
                  <PageTransition>
                    <TasksPage />
                  </PageTransition>
                </Protected>
              }
            />
            <Route
              path="/task-history"
              element={
                <Protected>
                  <PageTransition>
                    <TaskHistoryPage />
                  </PageTransition>
                </Protected>
              }
            />
            <Route
              path="/users"
              element={
                <Protected>
                  <PageTransition>
                    <UsersPage />
                  </PageTransition>
                </Protected>
              }
            />
            <Route
              path="/moderation"
              element={
                <Protected>
                  <PageTransition>
                    <ModerationPage />
                  </PageTransition>
                </Protected>
              }
            />
            <Route
              path="/me"
              element={
                <PageTransition>
                  <MePage />
                </PageTransition>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </AppLayout>
    </AuthProvider>
  );
}

// обёртка для плавного появления/исчезновения
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
