import CategoryInterface from "../interfaces/categorie.interface";
import Record from "./record.model";

export default class Category extends Record implements CategoryInterface {
  id: number
  name: string
  color: string

  constructor(data: CategoryInterface) {
    super()
    this.id = data.id
    this.name = data.name
    this.color = this.getRandomColor()
  }

  private getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  public getHTMLFragment() {
    const parent = document.createElement('li')
    parent.classList.add('category')
    parent.style.backgroundColor = this.color
    parent.textContent = this.name

    return parent
  }
}