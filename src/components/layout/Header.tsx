import { Link, useLocation } from "react-router-dom";
import NavLink from "./NavLink";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, isAuthed, logout } = useAuth();
  const { pathname } = useLocation();

  const role = user?.role;
  const isAdmin = role === "ADMIN";
  const isModerator = role === "MODERATOR";

  const initials = (user?.username || user?.email || "U")
    .split(/[.@\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur dark:bg-neutral-900/70 dark:border-neutral-800 overflow-x-clip">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        <Link to="/" className="font-semibold tracking-tight">
          reco system
        </Link>

        {/* роль-базирующая навигация */}
        <nav className="hidden sm:flex items-center gap-2 text-sm">
          {isAuthed && (
            <>
              <NavLink to="/tasks">Задачи</NavLink>
              <NavLink to="/task-history">История</NavLink>
              {(isModerator || isAdmin) && (
                <NavLink to="/moderation">Модерация</NavLink>
              )}
              {isAdmin && <NavLink to="/users">Пользователи</NavLink>}
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthed ? (
            <div className="flex items-center gap-3">
              {/* ссылка в профиль */}
              <Link
                to="/me"
                className="group flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <span
                  aria-hidden
                  className="grid h-6 w-6 place-items-center rounded-full border text-[10px] font-medium text-neutral-700 dark:text-neutral-200 dark:border-neutral-700"
                  title="Профиль"
                >
                  {initials || "U"}
                </span>
                <span className="text-xs text-neutral-700 group-hover:underline dark:text-neutral-300">
                  {user?.email || user?.username || "Профиль"}
                </span>
              </Link>

              <button
                onClick={logout}
                className="rounded-xl border px-3 py-1 text-xs hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Выйти
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-xl border px-3 py-1 text-xs hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
