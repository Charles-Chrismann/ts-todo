export default abstract class Record {
  abstract id: number
  abstract getHTMLFragment(): HTMLElement
}