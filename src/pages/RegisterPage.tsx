import React, { useState } from "react";
import Input from "../components/ui/Input";
import BannerError from "../components/ui/BannerError";
import authService from "../services/authService";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await authService.register({ email, password, username });
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 text-2xl font-semibold">Регистрация</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}
