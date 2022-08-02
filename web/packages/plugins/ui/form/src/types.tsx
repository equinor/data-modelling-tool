export type FormProps = {
  documentId?: string
  dataSourceId?: string
  type?: string
  formData?: any
  onSubmit?: (data: any) => void
  widgets?: any
  config?: any
  onOpen?: (data: any) => void
}

export type ObjectFieldProps = {
  contained?: boolean
  // plugin: string
  namePath: string
  type: string
  displayLabel?: string
  optional?: boolean
  config?: any
  uiRecipeName?: string
  uiAttribute?: any
}
export type AttributeFieldProps = {
  namePath: string
  attribute: any
  uiAttribute?: any
}

export type StringFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
  optional: boolean
  uiAttribute?: any
}

export type NumberFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
  optional: boolean
  uiAttribute?: any
}

export type BooleanFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
  uiAttribute?: any
}
