import type { DataItem } from "@/types/data"

// Function to generate random data
export async function getData(): Promise<DataItem[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const statuses = ["New", "In Progress", "Completed", "Archived"]
  const types = ["Research", "Feature", "Bug", "Enhancement", "Documentation"]
  const sources = ["Customer Feedback", "Internal", "Market Research", "User Testing", "Analytics"]
  const personas = [
    ["Developer", "Designer"],
    ["Manager", "Executive"],
    ["Customer", "Support"],
    ["Marketing", "Sales"],
    ["Product Owner"],
  ]
  const journeys = ["Awareness", "Consideration", "Decision", "Retention", "Advocacy"]

  return Array.from({ length: 100 }).map((_, i) => {
    const createdDate = new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000)
    const updatedDate = new Date(createdDate.getTime() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)

    return {
      id: `ITEM-${i + 1000}`,
      title: `Item ${i + 1}: ${types[Math.floor(Math.random() * types.length)]} Project`,
      source: sources[Math.floor(Math.random() * sources.length)],
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      score: Math.floor(Math.random() * 100),
      personas: personas[Math.floor(Math.random() * personas.length)],
      opportunities: Math.floor(Math.random() * 10),
      dateCreated: createdDate,
      dateUpdated: updatedDate,
      journey: journeys[Math.floor(Math.random() * journeys.length)],
    }
  })
}
