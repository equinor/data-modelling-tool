import { TBlob } from '@dmt/common'

export type TSIMAApplicationInput = {
  _id?: string
  name: string
  description?: string
  type: string
  inputType: string
  outputType: string
  input: any
  SIMAComputeConfig?: TBlob
  stask?: TBlob
  workflow: string
  workflowTask: string
  resultPath: string
  resultReferenceLocation?: string
}
