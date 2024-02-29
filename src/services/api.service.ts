import TaskInterface from "../interfaces/task.interface"
import taskDataInterface from "../interfaces/taskData.interface"

class ApiService {
  private static baseUrl = 'http://localhost:3000'

  public static async getTasks(): Promise<TaskInterface[]> {
    return await (await fetch(this.baseUrl + '/tasks')).json()
  }

  public static async postTask(task: taskDataInterface) {
    console.log(task)
    return await (await fetch(this.baseUrl + '/tasks', { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(task) })).json()
  }

  public static async deleteTaskById(id: number) {
    return await (await fetch(this.baseUrl + '/tasks/' + id, { method: 'DELETE' })).json()
  }

  public static async getCategories() {
    return await (await fetch(this.baseUrl + '/categories')).json()
  }
}

export default ApiService