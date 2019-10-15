export const getProperty = (o: any, prop: string, defaultValue: any) => {
  if (o === undefined) return defaultValue
  if (o[prop] !== undefined) return o[prop]
  else return defaultValue
}
