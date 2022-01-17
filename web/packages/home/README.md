[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Web

## Action Hooks
The _ApplicationSettings_ file has 'actions', they look like this;
```json
{
  "name": "Calculate",
  "description": "Simulate 80kmh concrete crash. Fiat panda 2011.",
  "input": "SSR-DataSource/CarPackage/Car",
  "output": "SSR-DataSource/CarPackage/Result",
  "method": "run"
}
```
    

This action will be available on any entity of the type _"SSR-DataSource/CarPackage/Car"_(input).  
The name given in _"method"_ must be the name of a function in the _"actions.js"_ file, as well as being in the _"runnableMethods"_ object at the end of the _actions.js_ file.  
The main use case for this custom function is to call SIMOS calculations, and update result objects.
The properties that are passed to the function looks like this;
```typescript
type Input = {
    blueprint: string
    entity: any
    path: string
    id: string
}

type Output = {
    blueprint: string
    entity: any
    path: string
    dataSource: string
    id: string
}

updateDocument(output: Output): Function

createEntity (type: string): Function

```
      

Current limitations and caveats;
* The functions are callBacks. That means that if the web-browser get's interrupted(refresh,closed, etc.) the callBack is lost.
* The API uses a strict type system, so if the output entity does NOT match the output blueprint, that attribute will not be updated.
* The output object must be left intact, and posted on every updateDocument call. Everything besides the output.entity object should be considered "read-only".

### Example
```javascript
async function run({ input, output, updateDocument, createEntity }) {
  let entity = {
    ...output.entity,
    // This is an invalid attribute. Will not get written to database.
    hallo: 'Hey',
  }
  updateDocument({ ...output, entity })

  // Using the passed "createEntity" function, we can get an empty, in-memory entity, of any type.
  let newWheel = await createEntity('SSR-DataSource/CarPackage/Wheel')

  // If the browser is interrupted during this sleep, the rest of the function will NOT be executed.
  await sleep(10000)
  entity.description = 'a'
  updateDocument({ ...output, entity })
}
```
