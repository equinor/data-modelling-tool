export type FormProps = {
  type?: string
  formData?: any
  onSubmit?: (data: any) => any
}

export type ObjectFieldProps = {
  namePath: string
  type: string
  displayLabel?: string
  optional?: boolean
}

export type AttributeFieldProps = {
  namePath: string
  attribute: any
}

export type StringFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
  optional: boolean
}

export type NumberFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
  optional: boolean
}

export type BooleanFieldProps = {
  namePath: string
  displayLabel: string
  defaultValue: string
}
