import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Reveal, containerStagger, fadeUp } from "../utils/motion";

export default function HomePage() {
  const features = [
    {
      title: "Задачи",
      text: "Создание, редактирование и удаление задач. Поля: заголовок, описание, ответ, сложность, предмет.",
    },
    {
      title: "Модерация",
      text: "Новые задачи проверяет модератор → статус (APPROVED/REJECTED).",
    },
    {
      title: "История решений",
      text: "Сохраняем ответы, статусы, баллы и фидбек.",
    },
    {
      title: "Пользователи и роли",
      text: "Админ, модератор, студент. Доступ по ролям.",
    },
    {
      title: "API FastAPI",
      text: "Маршруты: /auth, /users, /tasks, /task-history, /moderation.",
    },
    {
      title: "Рекомендации",
      text: "Дальше — модель, предлагающая похожие задачи.",
    },
  ];

  return (
    <section className="space-y-10">
      {/* Hero */}
      <Reveal
        className="rounded-3xl border bg-white p-8 md:p-12 shadow-sm"
        variants={fadeUp}
      >
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            reco syste — платформа задач с рекомендациями
          </h1>
          <p className="mt-3 text-neutral-600 text-base md:text-lg">
            Этот проект объединяет банк задач, модерацию, историю решений и
            основу для рекомендательной системы. Бэкэнд — FastAPI, БД —
            SQLAlchemy (async), роли и пайплайн модерации уже реализованы.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/tasks"
              className="rounded-xl bg-black px-4 py-2 text-white text-sm"
            >
              Перейти к задачам
            </Link>
            <Link
              to="/task-history"
              className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-100"
            >
              Моя история
            </Link>
          </div>
        </div>
      </Reveal>

      {/* Features */}
      <Reveal variants={containerStagger}>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="rounded-2xl border bg-white p-5 shadow-sm"
              variants={fadeUp}
            >
              <div className="text-sm text-neutral-500">Функция</div>
              <div className="mt-1 text-lg font-medium">{f.title}</div>
              <p className="mt-1 text-sm text-neutral-600">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </Reveal>

      {/* How to */}
      <Reveal className="rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-medium">Как пользоваться</h2>
        <ol className="mt-2 list-decimal pl-5 text-sm text-neutral-700 space-y-1">
          <li>Залогиньтесь или зарегистрируйтесь.</li>
          <li>Откройте раздел «Задачи» — создавайте и управляйте контентом.</li>
          <li>
            Если у вас права модератора — проверяйте новые задачи в «Модерации».
          </li>
          <li>Смотрите «Историю решений» для анализа прогресса.</li>
        </ol>
      </Reveal>
    </section>
  );
}
