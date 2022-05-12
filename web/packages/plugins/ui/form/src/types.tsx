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
  documentId?: string
  dataSourceId?: string
  type?: string
  formData?: any
  onSubmit?: Function
  onChange?: Function
  updateDocument?: Function
  widgets?: any
  config?: any
  onOpen?: Function
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
