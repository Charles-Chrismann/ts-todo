export default interface taskDataInterface {
  title: string;
  description: string | null;
  end: string | null;
  priority: "high" | "medium" | "low"
}
