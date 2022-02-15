export type TAnalysis = {
  _id: string
  name: string
  description: string
  created: string
  updated: string
  label?: string
  creator: string
  schedule: string
  task: any
}

export type TTask = {
  name: string
  description: string
}
