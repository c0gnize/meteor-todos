import path from "path";
import * as dotenv from "dotenv";

import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { ServiceConfiguration } from "meteor/service-configuration";

import { TasksCollection } from "/imports/db/TasksCollection";
import "/imports/api/tasksMethods";
import "/imports/api/tasksPublications";

dotenv.config({ path: path.resolve(process.cwd(), "../../../../../.env") });

const SEED_USERNAME = "meteorite";
const SEED_PASSWORD = "password";

const insertTask = (taskText: string, user: Meteor.User) => {
  TasksCollection.insert({
    text: taskText,
    createdAt: Date.now(),
    userId: user._id,
    isChecked: false,
  });
};

Meteor.startup(async () => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  const user = Accounts.findUserByUsername(SEED_USERNAME)!;

  if (TasksCollection.find().count() === 0) {
    [
      "First Task",
      "Second Task",
      "Third Task",
      "Fourth Task",
      "Fifth Task",
      "Sixth Task",
      "Seventh Task",
    ].forEach((v) => insertTask(v, user));
  }
});

ServiceConfiguration.configurations.upsert(
  { service: "github" },
  {
    $set: {
      loginStyle: "popup",
      clientId: process.env.GITHUB_CLIENT_ID,
      secret: process.env.GITHUB_SECRET_KEY,
    },
  }
);
