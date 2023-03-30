import React from "react";
import { TaskI } from "/definition/Task";

export const Task = ({
  task,
  onCheckboxClick,
  onDeleteClick,
}: {
  task: TaskI;
  onCheckboxClick: (task: TaskI) => void;
  onDeleteClick: (task: TaskI) => void;
}) => {
  return (
    <li>
      <input
        type="checkbox"
        checked={!!task.isChecked}
        onClick={() => onCheckboxClick(task)}
        readOnly
      />
      <span>{task.text}</span>
      <button onClick={() => onDeleteClick(task)}>&times;</button>
    </li>
  );
};
