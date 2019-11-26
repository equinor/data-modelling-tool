//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { BlueprintEnum } from '../../../../../util/variables'

const fillTemplate = function(templateString: string, templateVars: object) {
  let func = new Function(
    ...Object.keys(templateVars),
    'return `' + templateString + '`;'
  )
  return func(...Object.values(templateVars))
}

interface Adict {
  [key: string]: string
}

export const processFormData = (requestData: any, formData: any) => {
  // Description is optional.
  // TODO: This func should check blueprint for optional/default values
  if (formData.description === undefined) {
    formData.description = ''
  }
  if (formData.name === undefined) {
    NotificationManager.error('Name is required')
    return
  }
  if (
    requestData.type === BlueprintEnum.ENTITY &&
    formData.type === undefined
  ) {
    NotificationManager.error('Type is required')
    return
  }
  const data = {} as any
  Object.keys(requestData).forEach(key => {
    if (key in formData) {
      data[key] = formData[key]
    } else if (typeof requestData[key] === 'object') {
      if (requestData[key] == null) {
        data[key] = null
      } else {
        const adict = {} as Adict
        for (const item_key in requestData[key]) {
          const value: string = requestData[key][item_key]
          if (item_key in formData) {
            const result = fillTemplate(value, formData)
            adict[item_key] = result
          }
        }
        data[key] = adict
      }
    } else {
      data[key] = fillTemplate(requestData[key], formData)
    }
  })
  return data
}
