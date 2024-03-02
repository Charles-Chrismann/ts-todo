import TaskInterface from "../interfaces/task.interface";
import { appService } from "../services";
import Record from "./record.model";

export default class Task extends Record implements TaskInterface {
  id: number
  title: string
  description: string | null
  end: string | null
  priority: "high" | "medium" | "low"
  categoriesId: number[]
  constructor(data: TaskInterface) {
    super()
    this.id = data.id
    this.title = data.title
    this.description = data.description
    this.end = data.end
    this.priority = data.priority
    this.categoriesId = data.categoriesId ?? []
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

    const p = document.createElement('p')
    if(this.end) {
      p.textContent = `Date d'échéance: ${this.end}`
      parent.appendChild(p)
    }

    const p2 = document.createElement('p')
    if(this.description) {
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

    const titleAndPrioContainer = document.createElement('div')
    const titleInput = document.createElement('input')
    titleInput.value = this.title
    titleAndPrioContainer.appendChild(titleInput)

    const prioritySelect = document.createElement('select')
    const opt1 = document.createElement('option')
    opt1.textContent = 'Faible'
    opt1.value = 'low'
    const opt2 = document.createElement('option')
    opt2.textContent = 'Moyenne'
    opt2.value = 'medium'
    const opt3 = document.createElement('option')
    opt3.textContent = 'Forte'
    opt3.value = 'high'
    prioritySelect.appendChild(opt1)
    prioritySelect.appendChild(opt2)
    prioritySelect.appendChild(opt3)
    prioritySelect.value = this.priority
    titleAndPrioContainer.appendChild(prioritySelect)

    const endInput = document.createElement('input')
    endInput.type = "date"
    endInput.value = this.end ?? ""
    
    const endInputStrContainer = document.createElement('p')
    endInputStrContainer.textContent = "Date d'échéance: "
    endInputStrContainer.appendChild(endInput)
    // endInputStrContainer.appendChild()
    // parent.textContent = ''
    
    const descriptionInput = document.createElement('textarea')
    descriptionInput.style.width = "50%"
    descriptionInput.value = this.description ?? ""

    const validateBtn = document.createElement('button')
    validateBtn.classList.add("edit-btn")
    validateBtn.textContent = "Valider"
    validateBtn.addEventListener('click', () => {
      appService.updateTask(this, {
        title: titleInput.value,
        priority: prioritySelect.value,
        end: endInput.value,
        description: descriptionInput.value
      })
    })

    const cancelBtn = document.createElement('button')
    cancelBtn.type = "button"
    cancelBtn.textContent = "Annuler"
    cancelBtn.addEventListener('click', () => {
      appService.displayTasks()
    })

    updateBtn.addEventListener('click', () => {
      while(parent.firstChild) parent.firstChild.remove()

      parent.appendChild(titleAndPrioContainer)
      parent.appendChild(endInputStrContainer)
      parent.appendChild(descriptionInput)
      parent.appendChild(validateBtn)
      parent.appendChild(cancelBtn)
    })

    parent.appendChild(updateBtn)

    const categoryContainer = document.createElement('div')
    categoryContainer.classList.add('categoryContainer')
    const categories = document.createElement('ul')
    categories.classList.add('categories')
    categoryContainer.appendChild(categories)

    for(const categorieId of this.categoriesId) {
      const c = appService.categories.find(x => x.id === categorieId)
      categories.appendChild(c!.getHTMLFragment())
    }

    const addCategoryBtn = document.createElement('button')
    addCategoryBtn.textContent = "+"
    addCategoryBtn.addEventListener('click', () => {
      appService.openModal(this)
    })
    categoryContainer.appendChild(addCategoryBtn)
    parent.appendChild(categoryContainer)
    return parent
  }
}