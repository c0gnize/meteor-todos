import { Mongo } from "meteor/mongo";
import { TaskI } from "/definition/Task";

export const TasksCollection = new Mongo.Collection<TaskI>("tasks");
