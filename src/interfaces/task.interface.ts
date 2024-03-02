export default interface TaskInterface {
  id: number,
  title: string,
  description: string | null,
  end: string | null,
  priority: "high" | "medium" | "low"
  categoriesId: number[]
}