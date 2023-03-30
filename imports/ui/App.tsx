import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { TasksCollection } from "/imports/api/TasksCollection";
import { Task } from "./Task";
import { TaskForm } from "./TaskForm";
import { TaskI } from "/definition/Task";
import { LoginForm } from "./LoginForm";

const COMPLETED_FILTER = { isChecked: { $ne: true } };

export const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false);

  const user = useTracker(() => Meteor.user());

  const userFilter = user ? { userId: user._id } : {};

  const tasks: TaskI[] = useTracker(() =>
    TasksCollection.find(
      { ...userFilter, ...(hideCompleted ? COMPLETED_FILTER : {}) },
      { sort: { createdAt: -1 } }
    ).fetch()
  );

  const pendingTasksCount = useTracker(() => {
    if (!user) return 0;
    TasksCollection.find({ ...COMPLETED_FILTER, ...userFilter }).count();
  });

  const toggleChecked = ({ _id, isChecked }: TaskI) => {
    TasksCollection.update(_id, {
      $set: {
        isChecked: !isChecked,
      },
    });
  };

  const deleteTask = ({ _id }: TaskI) => {
    TasksCollection.remove(_id);
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
            <h1>
              📝️ To Do List
              {pendingTasksTitle}
            </h1>
          </div>
        </div>
      </header>
      <div className="main">
        {user ? (
          <>
            <div className="user" onClick={logout}>
              {user.username} 🚪
            </div>
            <TaskForm user={user} />
            <div className="filter">
              <button onClick={() => setHideCompleted(!hideCompleted)}>
                {hideCompleted ? "Show All" : "Hide Completed"}
              </button>
            </div>
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
