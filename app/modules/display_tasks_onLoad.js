import displayTask from "./diplay.js";
import { tasks } from "./taskArr.js";

const displayOnAdd = () => {
  document.addEventListener("DOMContentLoaded", () => {
    tasks.forEach((task) => {
      displayTask(task);
    });
  });
};

export default displayOnAdd;
