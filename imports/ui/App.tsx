import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { TasksCollection } from "/imports/db/TasksCollection";
import { Task } from "./Task";
import { TaskForm } from "./TaskForm";
import { TaskI } from "/definition/Task";
import { LoginForm } from "./LoginForm";

const COMPLETED_FILTER = { isChecked: { $ne: true } };

type TasksTracker = {
  tasks: TaskI[];
  pendingTasksCount: number;
  isLoading?: boolean;
};

export const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false);

  const user: Meteor.User | null = useTracker(() => Meteor.user());

  const userFilter = user ? { userId: user._id } : {};

  const { tasks, pendingTasksCount, isLoading }: TasksTracker = useTracker(
    (): TasksTracker => {
      const noDataAvailable = { tasks: [], pendingTasksCount: 0 };

      if (!Meteor.user()) {
        return noDataAvailable;
      }

      const handler = Meteor.subscribe("tasks");

      if (!handler.ready()) {
        return { ...noDataAvailable, isLoading: true };
      }

      const tasks = TasksCollection.find(
        { ...userFilter, ...(hideCompleted ? COMPLETED_FILTER : {}) },
        { sort: { createdAt: -1 } }
      ).fetch();

      const pendingTasksCount = TasksCollection.find(COMPLETED_FILTER).count();

      return { tasks, pendingTasksCount };
    }
  );

  const toggleChecked = ({ _id, isChecked }: TaskI) => {
    Meteor.call("tasks.setIsChecked", _id, !isChecked);
  };

  const deleteTask = ({ _id }: TaskI) => {
    Meteor.call("tasks.remove", _id);
  };

  const logout = () => Meteor.logout();

  const pendingTasksTitle = `${
    pendingTasksCount ? ` (${pendingTasksCount})` : ""
  }`;

  return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div className="app-header">
            <h1>📝️ To Do List {pendingTasksTitle}</h1>
          </div>
        </div>
      </header>
      <div className="main">
        {user ? (
          <>
            <div className="user" onClick={logout}>
              {user.username ?? (user.profile as any).name}
            </div>

            <TaskForm />

            <div className="filter">
              <button onClick={() => setHideCompleted(!hideCompleted)}>
                {hideCompleted ? "Show All" : "Hide Completed"}
              </button>
            </div>

            {isLoading && <div className="loading">loading...</div>}

            <ul className="tasks">
              {tasks.map((task) => (
                <Task
                  key={task._id}
                  task={task}
                  onCheckboxClick={toggleChecked}
                  onDeleteClick={deleteTask}
                />
              ))}
            </ul>
          </>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
};
