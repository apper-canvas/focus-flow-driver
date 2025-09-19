import mockTasks from "@/services/mockData/tasks.json";

let tasks = [...mockTasks];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const tasksService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id));
    return task ? { ...task } : null;
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      title: taskData.title,
      description: taskData.description || "",
      completed: false,
      priority: taskData.priority || "Medium",
      dueDate: taskData.dueDate || null,
      category: taskData.category || "Personal",
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return null;
    
    const updatedTask = {
      ...tasks[index],
      ...taskData,
      Id: parseInt(id)
    };
    
    // Handle completion status
    if (taskData.completed && !tasks[index].completed) {
      updatedTask.completedAt = new Date().toISOString();
    } else if (!taskData.completed && tasks[index].completed) {
      updatedTask.completedAt = null;
    }
    
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return false;
    
    tasks.splice(index, 1);
    return true;
  }
};

export default tasksService;