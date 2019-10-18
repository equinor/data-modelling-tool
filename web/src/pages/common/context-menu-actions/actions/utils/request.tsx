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
  const data = {} as any
  Object.keys(requestData).forEach(key => {
    if (typeof requestData[key] === 'object') {
      const adict = {} as Adict
      for (const item_key in requestData[key]) {
        const value: string = requestData[key][item_key]
        if (item_key in formData) {
          const result = fillTemplate(value, formData)
          adict[item_key] = result
        }
      }
      data[key] = adict
    } else {
      data[key] = fillTemplate(requestData[key], formData)
    }
  })
  return data
}
