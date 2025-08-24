import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import BannerError from "../components/ui/BannerError";
import authService from "../services/authService";

export default function LoginPage() {
  const { saveToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const t = await authService.login({ username, password });
      saveToken(t);
      nav("/");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 text-2xl font-semibold">Вход</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <Input
          label="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <BannerError msg={error} />
        <button className="w-full rounded-xl bg-black px-4 py-2 text-white">
          Войти
        </button>
      </form>
      <p className="mt-4 text-sm text-neutral-600">
        Нет аккаунта?{" "}
        <Link className="underline" to="/register">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
