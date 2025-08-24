import React, { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import BannerError from "../ui/BannerError";
import { TaskCreate } from "../../types/api";

export default function CreateTaskDialog({
  onCreated,
}: {
  onCreated: (payload: TaskCreate) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [answer, setAnswer] = useState("");
  const [difficulty, setDifficulty] = useState<number>(1);
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await onCreated({ title, description, answer, difficulty, subject });
      setOpen(false);
      setTitle("");
      setDescription("");
      setAnswer("");
      setDifficulty(1);
      setSubject("");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Новая</Button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl border bg-white p-4 shadow-xl">
            <div className="mb-2 text-lg font-semibold">Новая задача</div>
            <form onSubmit={submit} className="space-y-3">
              <Input
                label="Заголовок"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextArea
                label="Описание"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
              <TextArea
                label="Ответ"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={3}
              />
              <Input
                label="Сложность (1..5)"
                type="number"
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
              />
              <Input
                label="Предмет"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <BannerError msg={error} />
              <div className="flex justify-end gap-2">
                <Button type="button" onClick={() => setOpen(false)}>
                  Отмена
                </Button>
                <button className="rounded-xl bg-black px-4 py-2 text-sm text-white">
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
