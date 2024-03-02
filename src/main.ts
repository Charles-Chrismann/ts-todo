import taskDataInterface from './interfaces/taskData.interface'
import appService from './services/app.service'
import './style.css'
(async () => {
  await appService.getCategories()
  await appService.getTasks()
  
  const createTaskForm = document.querySelector<HTMLFormElement>('#taskForm')!
  const searchInput = document.querySelector<HTMLInputElement>('#searchInput')!
  const filterForm = document.querySelector<HTMLFormElement>('#filterForm')!
  const popupGroup = document.querySelector<HTMLDivElement>('.popup')!
  
  createTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(createTaskForm)
    const taskData = {
      title: formData.get('taskTitle'),
      description: formData.get('taskTitle') ?? null,
      end: formData.get('taskDueDate') ?? null,
      priority: formData.get('taskPriority')
    } as taskDataInterface
    if(await appService.postTask(taskData)) createTaskForm.reset()
  })
  
  searchInput.addEventListener('input', (e: Event) => {
    const inputElement = e.target as HTMLInputElement;
    const value = inputElement.value;
    appService.search(
      value ? (task) => task.title.includes(value) || (task.description ? task.description.includes(value) : false) : null
      )
  })
  
  filterForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(filterForm)
    appService.setPriorityCondition(formData.get('filterPriority') as taskDataInterface['priority'] | "all")
    const dateInputValue = formData.get('filterDate') as string
    appService.setDueCondition(dateInputValue === "" ? "" : new Date(dateInputValue))
    appService.displayTasks()
  })
  
  document.querySelector('#create-category-btn')!
  .addEventListener('click', () => {
    const categoryName = (document.querySelector('#category-name')! as HTMLInputElement).value
    appService.postCategory(categoryName)
  })
  
  document.querySelector('.overlay')!
  .addEventListener('click', () => {
    popupGroup.classList.add('hide')
  })
})()
