import TaskInterface from "../interfaces/task.interface"
import taskDataInterface from "../interfaces/taskData.interface"
import { Task } from "../models"
import Category from "../models/category.model"
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

  private _categories: Category[] = []
  set categories(categories) {
    this._categories = categories
    this.displayCategories()
  }
  get categories() {
    return this._categories
  }

  private taskContainer = document.querySelector('#tasks > #tasks')!
  private categoryContainer = document.querySelector('#categories')!
  private _displayConditions: (((arg0: Task) => boolean)| null)[] = [null, null, null]
  set displayConditions(displayConditions) {
    this._displayConditions = displayConditions
    this.displayTasks()
  }
  get displayConditions() {
    return this._displayConditions
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

  public async updateTask(taskToUpdate: Task, rowsToUpdate: Record<string, any>) {
    try {
      const updatedTask = await ApiService.updateTaskById(taskToUpdate.id, rowsToUpdate)
      const taskIndex = this._tasks.findIndex(task => task.id === taskToUpdate.id)
      this.tasks = [...this.tasks.slice(0, taskIndex), new Task(updatedTask), ...this.tasks.slice(taskIndex + 1, this.tasks.length)]
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

  public displayCategories() {
    while(this.categoryContainer.firstChild) this.categoryContainer.firstChild.remove()
    for(const category of this.categories) this.categoryContainer.appendChild(category.getHTMLFragment())
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

  public async getCategories() {
    try {
      if(this.categories.length) return this.categories
      for(const category of await ApiService.getCategories()) {
        this.categories = [...this.categories, new Category(category)]
      }
      return this._tasks
    } catch (e) {
      console.log(e)
    }
  }

  public async postCategory(categoryName: string) {
    try {
      if(this.categories.find(category => category.name === categoryName)) return
      const newCategory = new Category(await ApiService.postCategory(categoryName))
      this.categories = [...this.categories, newCategory]
    } catch (e) {
      console.log(e)
    }
  }

  public openModal(task: Task) {
    document.querySelector('.popup')!.classList.remove('hide')
    const selectedCategories = [] as number[]
    const toSelect = this.categories.filter(categorie => !task.categoriesId.includes(categorie.id))
    const categoriesEl = document.querySelector('.card .categories')!
    while(categoriesEl.firstChild) categoriesEl!.firstChild?.remove()
    document.querySelector('.popup button')!.remove()
    for(const cateId of toSelect) {
      const htmlEl = cateId.getHTMLFragment()
      htmlEl.addEventListener('click', () => {
        if(htmlEl.classList.contains('toggled')) {
          selectedCategories.splice(selectedCategories.findIndex(id => id === cateId.id), 1)
          htmlEl.classList.remove('toggled')
        } else {
          selectedCategories.push(cateId.id)
          htmlEl.classList.add('toggled')
        }
        console.log(selectedCategories)
      })
      categoriesEl.appendChild(htmlEl)
    }
    const validateBtn = document.createElement('button')
    validateBtn.textContent = "Valider"
    validateBtn.addEventListener('click', () => {
      this.addCategorieToTask(task, selectedCategories)
      document.querySelector('.popup')!.classList.add('hide')
    })
    document.querySelector('.card')!.appendChild(validateBtn)
  }

  async addCategorieToTask(task: Task, selectedCategories: number[]) {
    task.categoriesId = task.categoriesId.concat(selectedCategories)
    await ApiService.updateTaskById(task.id, { categoriesId: task.categoriesId })
    this.displayTasks()
  }
}

export default new AppService()