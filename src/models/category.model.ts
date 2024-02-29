import CategoryInterface from "../interfaces/categorie.interface";

export default class Category implements CategoryInterface {
  id: string
  name: string

  constructor(data: CategoryInterface) {
    this.id = data.id
    this.name = data.name
  }
}