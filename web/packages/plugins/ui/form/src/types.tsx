export type FormProps = {
  type?: string
  formData?: any
  onSubmit?: (data: any) => any
}

export type ObjectFieldProps = {
  namePath: string
  type: string
  formData?: any
}

export type AttributeFieldProps = {
  namePath: string
  attribute: any
  formData?: any
}

export type StringFieldProps = {
  namePath: string
  label: string
  name: string
  defaultValue: string
}

export type BooleanFieldProps = {
  namePath: string
  label: string
  name: string
  defaultValue: string
}
