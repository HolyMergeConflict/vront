import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-white/70 dark:bg-neutral-900/60 dark:border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 py-8 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-medium text-neutral-800 dark:text-neutral-200">
              reco syste
            </div>
            <div className="mt-1">
              Мини‑платформа с задачами, модерацией и рекомендациями.
            </div>
          </div>
          <nav className="flex gap-4">
            <Link className="hover:underline" to="/">
              О проекте
            </Link>
            <Link className="hover:underline" to="/tasks">
              Задачи
            </Link>
            <Link className="hover:underline" to="/users">
              Пользователи
            </Link>
          </nav>
        </div>
        <div className="mt-6 text-center sm:text-right">
          © {new Date().getFullYear()} reco syste
        </div>
      </div>
    </footer>
  );
}
