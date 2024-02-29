import TaskInterface from "../interfaces/task.interface"
import taskDataInterface from "../interfaces/taskData.interface"
import { Task } from "../models"
import ApiService from "./api.service"

class AppService {
  private _tasks: Task[] = []
  set tasks(tasks) {
    this._tasks = tasks
    this.displayTasks()
  }
  get tasks() {
    return this._tasks
  }
  private taskContainer: HTMLDivElement
  private _displayConditions: (((arg0: Task) => boolean)| null)[] = [null, null, null]
  set displayConditions(displayConditions) {
    this._displayConditions = displayConditions
    console.log('update condfiitog')
    this.displayTasks()
  }
  get displayConditions() {
    return this._displayConditions
  }

  constructor() {
    this.taskContainer = document.querySelector('#tasks > #tasks')!
  }

  public async getTasks() {
    if(this._tasks.length) return this._tasks
    try {
      for(const task of await ApiService.getTasks()) {
        this.tasks = [...this._tasks, new Task(task)]
      }
      return this._tasks
    } catch (e) {
      console.log(e)
      return []
    }
  }

  public async postTask(taskData: taskDataInterface) {
    try {
      const newTask = await ApiService.postTask(taskData)
      this.tasks = [...this.tasks, new Task(newTask)]
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  public async removeTask(taskToDelete: Task) {
    try {
      ApiService.deleteTaskById(taskToDelete.id)
      const taskIndex = this._tasks.findIndex(task => task.id === taskToDelete.id)
      if(taskIndex === -1) return
      this.tasks = this.tasks.filter((_task, i) => i!== taskIndex)
    } catch (e) {
      console.log(e)
    }
  }

  public displayTasks() {
    while (this.taskContainer.firstChild) this.taskContainer.firstChild.remove()
    const [searchCondtion, priorityCondtion, dueCondition] = this.displayConditions
    const tasks = this.tasks.filter(
      task => (searchCondtion ? searchCondtion(task) : true )
      && (priorityCondtion ? priorityCondtion(task) : true )
      && (dueCondition ? dueCondition(task) : true )
    )
    for(const task of tasks) {
      this.taskContainer.appendChild(task.getHTMLFragment())
    }
  }

  public search(displayCondition: ((arg0: Task) => boolean) | null) {
    this.displayConditions[0] = displayCondition
    this.displayTasks()
  }

  public setPriorityCondition(priority: TaskInterface['priority'] | "all") {
    if(priority === "all") this.displayConditions[1] = () => true
    else this.displayConditions[1] = (task) => task.priority === priority
    this.displayTasks()
  }

  public setDueCondition(date: Date | "") {
    if(date === "") this.displayConditions[2] = null
    else {
      const dateStr = String(date.getFullYear()).padStart(4, "0") + "-" + String(date.getDate()).padStart(2, "0") + "-" + String(date.getMonth() + 1).padStart(2, "0")
      this.displayConditions[2] = (task) => task.end === dateStr
    }
    this.displayTasks()
  }
}

export default new AppService()