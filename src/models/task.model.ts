import TaskInterface from "../interfaces/task.interface";
import { appService } from "../services";

export default class Task implements TaskInterface {
  id: number
  title: string
  description: string | null
  end: string | null
  priority: "high" | "medium" | "low"
  categorieIds: string[]
  constructor(data: TaskInterface) {
    this.id = data.id
    this.title = data.title
    this.description = data.description
    this.end = data.end
    this.priority = data.priority
    this.categorieIds = []
  }

  public getHTMLFragment() {
    const parent = document.createElement('div')
    parent.classList.add('task', this.priority)
    const h3 = document.createElement('h3')
    const trad = {
      high: 'Haute',
      medium: 'Moyenne',
      low: 'Basse'
    }
    h3.textContent = this.title
    const span = document.createElement('span')
    span.textContent = `- Priorité ${trad[this.priority]}`
    h3.appendChild(span)
    parent.appendChild(h3)

    if(this.end) {
      const p = document.createElement('p')
      p.textContent = `Date d'échéance: ${this.end}`
      parent.appendChild(p)
    }

    if(this.description) {
      const p2 = document.createElement('p')
      p2.textContent = this.description
      parent.appendChild(p2)
    }

    const deleteBtn = document.createElement('button')
    deleteBtn.type = "button"
    deleteBtn.textContent = "Supprimer"
    deleteBtn.addEventListener('click', () => {
      appService.removeTask(this)
    })
    parent.appendChild(deleteBtn)

    const updateBtn = document.createElement('button')
    updateBtn.classList.add("edit-btn")
    updateBtn.textContent = "Modifier"
    parent.appendChild(updateBtn)

    // parent.appendChild(h3)
    return parent
  }
}