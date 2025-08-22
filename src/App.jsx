import React, { useEffect, useMemo, useState, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";

/**
 * 🔧 Quick setup
 * 1) Adjust API_BASE_URL to your FastAPI server.
 * 2) Endpoints are guesses based on typical FastAPI patterns; tweak in one place below.
 * 3) This is a single-file MVP so you can run/preview instantly, then split into files later.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
    logout: "/auth/logout", // if supported; otherwise we just drop the token
  },
  users: "/users",
  tasks: "/tasks",
  taskHistory: "/task-history",
  moderation: "/tasks/moderation", // e.g. list awaiting approval
};


// --- Shared fetch wrapper with auth token and basic error handling ---
async function apiFetch(path, { method = "GET", body, token, headers = {} } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data?.detail) msg = Array.isArray(data.detail) ? data.detail.map(d => d.msg || d).join("; ") : data.detail;
      if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }
  // Try JSON; if fails return text
  try {
    return await res.json();
  } catch {
    return await res.text();
  }
}

// --- Auth Context ---
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const isAuthed = !!token;

  const saveToken = (t) => {
    setToken(t || "");
    if (t) localStorage.setItem("token", t); else localStorage.removeItem("token");
  };

  const fetchMe = async () => {
    if (!token) { setUser(null); return; }
    try {
      const me = await apiFetch(endpoints.auth.me, { token });
      setUser(me);
    } catch (e) {
      console.warn("/auth/me failed:", e.message);
      setUser(null);
    }
  };

  useEffect(() => { fetchMe(); }, [token]);

  const value = useMemo(() => ({ token, user, isAuthed, setUser, saveToken, fetchMe }), [token, user, isAuthed]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// --- Layout ---
function AppLayout({ children }) {
  const { user, isAuthed, saveToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // If backend supports /auth/logout we can call it, but not required
    try { await apiFetch(endpoints.auth.logout, { method: "POST", token: localStorage.getItem("token") }); } catch {}
    saveToken("");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-semibold tracking-tight">reco syste</Link>
          <nav className="flex items-center gap-3 text-sm">
            <NavLink to="/tasks">Задачи</NavLink>
            <NavLink to="/task-history">История</NavLink>
            <NavLink to="/users">Пользователи</NavLink>
            <NavLink to="/moderation">Модерация</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            {isAuthed ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-600">{user?.email || user?.username || "user"}</span>
                <button onClick={handleLogout} className="rounded-xl border px-3 py-1 text-xs hover:bg-neutral-100">Выйти</button>
              </div>
            ) : (
              <Link to="/login" className="rounded-xl border px-3 py-1 text-xs hover:bg-neutral-100">Войти</Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <footer className="mx-auto mt-10 max-w-7xl px-4 py-8 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} reco syste
      </footer>
    </div>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} className="rounded-lg px-2 py-1 text-neutral-700 hover:bg-neutral-100 hover:text-black">
      {children}
    </Link>
  );
}

// --- Route guard ---
function Protected({ children }) {
  const { isAuthed } = useAuth();
  return isAuthed ? children : <Navigate to="/login" replace />;
}

// --- Pages ---
function HomePage() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card title="Задачи" to="/tasks" subtitle="Создание, просмотр, редактирование"/>
      <Card title="История решений" to="/task-history" subtitle="Результаты пользователей"/>
      <Card title="Пользователи" to="/users" subtitle="Список и управление ролями"/>
    </div>
  );
}

function Card({ title, subtitle, to }) {
  return (
    <Link to={to} className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="text-sm text-neutral-500">Раздел</div>
      <div className="mt-1 text-lg font-medium">{title}</div>
      <div className="mt-1 text-sm text-neutral-500">{subtitle}</div>
    </Link>
  );
}

function LoginPage() {
  const { saveToken, fetchMe } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Many FastAPI backends return { access_token, token_type }
      const data = await apiFetch(endpoints.auth.login, { method: "POST", body: { email, password } });
      const token = data?.access_token || data?.token || data;
      saveToken(token);
      await fetchMe();
      navigate("/");
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 text-2xl font-semibold">Вход</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <Input label="Email" value={email} onChange={setEmail} type="email" />
        <Input label="Пароль" value={password} onChange={setPassword} type="password" />
        {error && <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div>}
        <button className="w-full rounded-xl bg-black px-4 py-2 text-white">Войти</button>
      </form>
      <p className="mt-4 text-sm text-neutral-600">
        Нет аккаунта? <Link className="underline" to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
}

function RegisterPage() {
  const { saveToken, fetchMe } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiFetch(endpoints.auth.register, { method: "POST", body: { email, password, username } });
      // if backend returns token on register
      const token = data?.access_token || data?.token;
      if (token) {
        saveToken(token);
        await fetchMe();
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 text-2xl font-semibold">Регистрация</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <Input label="Email" value={email} onChange={setEmail} type="email" />
        <Input label="Логин" value={username} onChange={setUsername} />
        <Input label="Пароль" value={password} onChange={setPassword} type="password" />
        {error && <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div>}
        <button className="w-full rounded-xl bg-black px-4 py-2 text-white">Зарегистрироваться</button>
      </form>
    </div>
  );
}

function UsersPage() {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try { setData(await apiFetch(endpoints.users, { token })); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Пользователи</h1>
        <button onClick={load} className="rounded-xl border px-3 py-1 text-sm hover:bg-neutral-100">Обновить</button>
      </div>
      {error && <BannerError msg={error} />}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-neutral-50 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Email</th>
              <th className="p-2">Username</th>
              <th className="p-2">Роль</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={4}>Загрузка...</td></tr>
            ) : data?.length ? data.map(u => (
              <tr key={u.id} className="border-b">
                <td className="p-2">{u.id}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.role}</td>
              </tr>
            )) : (
              <tr><td className="p-3" colSpan={4}>Пусто</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TasksPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true); setError("");
    try { setItems(await apiFetch(endpoints.tasks, { token })); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Задачи</h1>
        <div className="flex items-center gap-2">
          <CreateTaskDialog onCreated={load} />
          <button onClick={load} className="rounded-xl border px-3 py-1 text-sm hover:bg-neutral-100">Обновить</button>
        </div>
      </div>
      {error && <BannerError msg={error} />}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="text-sm">Загрузка...</div>
        ) : items?.length ? items.map(t => (
          <TaskCard key={t.id} task={t} token={token} onChanged={load} />
        )) : (
          <div className="text-sm text-neutral-500">Пусто</div>
        )}
      </div>
    </section>
  );
}

function TaskCard({ task, token, onChanged }) {
  const del = async () => {
    if (!confirm("Удалить задачу?")) return;
    try { await apiFetch(`${endpoints.tasks}/${task.id}`, { method: "DELETE", token }); onChanged?.(); }
    catch (e) { alert(e.message); }
  };

  const toggle = async () => {
    try { await apiFetch(`${endpoints.tasks}/${task.id}`, { method: "PATCH", token, body: { is_active: !task.is_active } }); onChanged?.(); }
    catch (e) { alert(e.message); }
  };

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-neutral-500">#{task.id}</div>
          <div className="text-lg font-medium">{task.title || task.name || "Без названия"}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={toggle} className="rounded-xl border px-3 py-1 text-xs hover:bg-neutral-100">
            {task.is_active ? "Деактивировать" : "Активировать"}
          </button>
          <button onClick={del} className="rounded-xl border px-3 py-1 text-xs hover:bg-neutral-100">Удалить</button>
        </div>
      </div>
      {task.description && <p className="mt-2 text-sm text-neutral-600">{task.description}</p>}
      {task.tags?.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {task.tags.map((tag) => (
            <span key={tag} className="rounded-full border px-2 py-0.5 text-xs">{tag}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CreateTaskDialog({ onCreated }) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await apiFetch(endpoints.tasks, { method: "POST", token, body: { title, description } });
      setOpen(false);
      setTitle("");
      setDescription("");
      onCreated?.();
    } catch (e) { setError(e.message); }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-xl border px-3 py-1 text-sm hover:bg-neutral-100">Новая</button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl border bg-white p-4 shadow-xl">
            <div className="mb-2 text-lg font-semibold">Новая задача</div>
            <form onSubmit={submit} className="space-y-3">
              <Input label="Заголовок" value={title} onChange={setTitle} />
              <TextArea label="Описание" value={description} onChange={setDescription} rows={4} />
              {error && <BannerError msg={error} />}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-xl border px-3 py-1 text-sm hover:bg-neutral-100">Отмена</button>
                <button className="rounded-xl bg-black px-4 py-2 text-sm text-white">Создать</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function ModerationPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try { setItems(await apiFetch(endpoints.moderation, { token })); }
    catch (e) { setError(e.message); }
  };
  useEffect(() => { load(); }, []);

  const approve = async (id, approve) => {
    try {
      await apiFetch(`${endpoints.moderation}/${id}`, { method: "POST", token, body: { approve } });
      await load();
    } catch (e) { alert(e.message); }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Модерация</h1>
        <button onClick={load} className="rounded-xl border px-3 py-1 text-sm hover:bg-neutral-100">Обновить</button>
      </div>
      {error && <BannerError msg={error} />}
      <div className="space-y-3">
        {items?.length ? items.map(t => (
          <div key={t.id} className="rounded-2xl border bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-neutral-500">#{t.id}</div>
                <div className="text-lg font-medium">{t.title}</div>
                {t.description && <p className="mt-1 text-sm text-neutral-600">{t.description}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => approve(t.id, true)} className="rounded-xl border px-3 py-1 text-xs hover:bg-neutral-100">Одобрить</button>
                <button onClick={() => approve(t.id, false)} className="rounded-xl border px-3 py-1 text-xs hover:bg-neutral-100">Отклонить</button>
              </div>
            </div>
          </div>
        )) : <div className="text-sm text-neutral-500">Нет задач на модерации</div>}
      </div>
    </section>
  );
}

function TaskHistoryPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try { setRows(await apiFetch(endpoints.taskHistory, { token })); }
    catch (e) { setError(e.message); }
  };
  useEffect(() => { load(); }, []);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">История решений</h1>
        <button onClick={load} className="rounded-xl border px-3 py-1 text-sm hover:bg-neutral-100">Обновить</button>
      </div>
      {error && <BannerError msg={error} />}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-neutral-50 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Пользователь</th>
              <th className="p-2">Задача</th>
              <th className="p-2">Статус</th>
              <th className="p-2">Оценка</th>
              <th className="p-2">Время</th>
            </tr>
          </thead>
          <tbody>
            {rows?.length ? rows.map(r => (
              <tr key={r.id} className="border-b">
                <td className="p-2">{r.id}</td>
                <td className="p-2">{r.user_id ?? r.user?.email}</td>
                <td className="p-2">{r.task_id ?? r.task?.title}</td>
                <td className="p-2">{r.status}</td>
                <td className="p-2">{r.score}</td>
                <td className="p-2">{r.created_at ? new Date(r.created_at).toLocaleString() : ""}</td>
              </tr>
            )) : (
              <tr><td className="p-3" colSpan={6}>Пусто</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// --- UI atoms ---
function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs text-neutral-600">{label}</div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border px-3 py-2 text-sm outline-none ring-black/10 focus:ring"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 3, placeholder }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs text-neutral-600">{label}</div>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border px-3 py-2 text-sm outline-none ring-black/10 focus:ring"
      />
    </label>
  );
}

function BannerError({ msg }) {
  return <div className="rounded-xl border border-red-200 bg-red-50 p-2 text-sm text-red-700">{msg}</div>;
}

// --- App Root ---
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout>
          <Routes>
            <Route index element={<Protected><HomePage /></Protected>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/tasks" element={<Protected><TasksPage /></Protected>} />
            <Route path="/task-history" element={<Protected><TaskHistoryPage /></Protected>} />
            <Route path="/users" element={<Protected><UsersPage /></Protected>} />
            <Route path="/moderation" element={<Protected><ModerationPage /></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}

