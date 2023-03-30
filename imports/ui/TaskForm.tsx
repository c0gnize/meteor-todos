import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { TasksCollection } from "../api/TasksCollection";

export const TaskForm = ({ user }: { user: Meteor.User }) => {
  const [text, setText] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const value = text.trim();

    if (!value) return;

    TasksCollection.insert({
      text: value,
      createdAt: new Date(),
      userId: user._id,
    });

    setText("");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type to add new tasks"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button type="submit">Add Task</button>
    </form>
  );
};
