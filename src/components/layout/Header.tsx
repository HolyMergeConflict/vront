import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, isAuthed, logout } = useAuth();
  const { pathname } = useLocation();
  const isActive = (to: string) =>
    pathname === to
      ? "font-medium"
      : "text-neutral-600 hover:text-black dark:text-neutral-300 dark:hover:text-white";

  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur dark:bg-neutral-900/70 dark:border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 py-2">
        <div className="grid grid-cols-3 items-center">
          {/* LEFT: минимальная навигация */}
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/tasks"
              title="Задачи"
              className={`rounded-lg px-2 py-1 ${isActive("/tasks")}`}
            >
              Задачи
            </Link>
            <Link
              to="/task-history"
              title="История"
              className={`rounded-lg px-2 py-1 ${isActive("/task-history")}`}
            >
              История
            </Link>
            <Link
              to="/users"
              title="Пользователи"
              className={`rounded-lg px-2 py-1 ${isActive("/users")}`}
            >
              Пользователи
            </Link>
          </nav>

          {/* CENTER: заголовок окна/приложения */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-block rounded-lg px-2 py-1 text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
            >
              reco syste
            </Link>
          </div>

          {/* RIGHT: аккаунт/меню */}
          <div className="flex items-center justify-end gap-2">
            {isAuthed ? (
              <div className="flex items-center gap-3">
                <span
                  className="text-xs text-neutral-600 dark:text-neutral-400"
                  title="Текущий пользователь"
                >
                  {user?.email || user?.username || "user"}
                </span>
                <button
                  onClick={logout}
                  title="Выйти"
                  className="rounded-xl border px-3 py-1 text-xs hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                title="Войти"
                className="rounded-xl border px-3 py-1 text-xs hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Войти
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
