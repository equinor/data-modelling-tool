import { TBlob, TReference } from '@development-framework/dm-core'

export type TSIMAApplicationInput = {
  _id?: string
  name: string
  description?: string
  type: string
  inputType: string
  outputType: string
  input: any
  SIMAComputeConfig?: TBlob
  simaOutputFilePath?: string
  simaInputFilePath?: string
  inputPresetFolder: string
  stask?: TReference
  workflow: string
  workflowTask: string
  resultPath: string
  resultReferenceLocation?: string
}
