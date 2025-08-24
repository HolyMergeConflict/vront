import React from "react";
import Button from "../ui/Button";
import { TaskBase } from "../../types/api";
export default function TaskCard({
  task,
  onDelete,
  onToggle,
}: {
  task: TaskBase;
  onDelete: () => void;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-neutral-500">#{task.id}</div>
          <div className="text-lg font-medium">
            {task.title || "Без названия"}
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={onToggle}>
            {task.status === "APPROVED" ? "Скрыть" : "Активировать"}
          </Button>
          <Button onClick={onDelete}>Удалить</Button>
        </div>
      </div>
      {task.description && (
        <p className="mt-2 text-sm text-neutral-600">{task.description}</p>
      )}
    </div>
  );
}
