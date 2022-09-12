export type TFormProps = {
  documentId?: string
  dataSourceId?: string
  type?: string
  formData?: any
  onSubmit?: (data: any) => void
  widgets?: any
  config?: any
  onOpen?: (data: any) => void
}

export type TObjectFieldProps = {
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
export type TAttributeFieldProps = {
  namePath: string
  attribute: any
  uiAttribute?: any
}

export type TStringFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
  optional: boolean
  uiAttribute?: any
}

export type TNumberFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
  optional: boolean
  uiAttribute?: any
}

export type TBooleanFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
  uiAttribute?: any
}
