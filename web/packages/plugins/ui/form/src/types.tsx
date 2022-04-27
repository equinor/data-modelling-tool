export interface WidgetProps
  extends Pick<
    React.HTMLAttributes<HTMLElement>,
    Exclude<keyof React.HTMLAttributes<HTMLElement>, 'onBlur' | 'onFocus'>
  > {
  id: string
  [prop: string]: any // Allow for other props
}

export type Widget =
  | React.StatelessComponent<WidgetProps>
  | React.ComponentClass<WidgetProps>

export type FormProps = {
  type?: string
  formData?: any
  onSubmit?: Function
  updateDocument?: Function
  widgets?: { [name: string]: Widget }
  config?: any
}

export type ObjectFieldProps = {
  namePath: string
  type: string
  displayLabel?: string
  optional?: boolean
  config?: any
  uiRecipeName?: string
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
