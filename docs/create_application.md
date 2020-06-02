# Create Applications

1. Unzip the downloaded file(e.g `unzip application.zip` )
2. Run `docker-compose up`
3. Visit [http://localhost:9000] in your web browser (Internet Explorer is not supported)

## Adding custom actions

An application has an attribute with a list of `system/SIMOS/Action`'s.  

Actions™ are a way of calling custom JavaScript functions with an entity as input. Useful for calling external systems to do some analysis on an entity.

The object passed to these custom functions looks like this;

```typescript
      type Input = {
        blueprint: any
        entity: any
        path: string
        id: string
      }

      type Output = {
        blueprint: any
        entity: any
        dataSource: string
        id: string
        notify?: Boolean
      }

      updateDocument(output: Output): Function

      createEntity(type: string): Function
```

'Input' is the entity the action is being called on, and contains the actual data.

'Output' is where to store the result, and should be passed to `updateDocument()`.

'`updateDocument()`' is a callBack function that takes the 'output' object with a modified `output.entity` value, and saves it.  
If `output.notify` is true when passed to `updateDocument()`, the web application will produce a notification on success.

'`createEntity()`' is a helper function that takes a reference to a blueprint, and returns a default entity of that type.

The `system/SIMOS/Action`-type has four special attributes;  

* ActionType  
  
    An enum of the values `["separateResultFile","resultInEntity"]`.  
    Decides if the user should be prompt to create a new file that will be passed as the output object to the action, or if the output object should be the same as the input entity.

* Input

    A reference to the type that should be used as input to the action.  
    Any entity of this type will have a "Run --> <action_name>" in it's context menu. And a small "play-icon", indicating that is has custom Actions.

* Output

    A reference to the type that should be used for the output entity.

* Method

    The name of the custom function to call within `actions.js` for this action.

### Current limitations and caveats

* updateDocument is a callBack. That means that if the web-browser get's interrupted (refresh,closed, etc.) the callBack is lost.
* DMSS uses a strict type system, so if the output entity does NOT match the output blueprint, that attribute will not be updated.
* The output object must be left intact, and posted on every updateDocument call. Everything besides the output.entity object should be considered "read-only".
  
### Example of `actions.js`

```javascript
function sleep(seconds) {
    const ms = seconds * 1000
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function run({ input, output, updateDocument, createEntity }) {
  let entity = {
    ...input.entity,
    // This is an invalid attribute. Will not be saved.
    hallo: 'Hey',
  }
  updateDocument({ ...output, entity })

  // If the browser is interrupted during this sleep, the rest of the function will NOT be executed.
  await sleep(10)
  entity.description = 'a'
  updateDocument({ ...output, entity })

  await sleep(5)
  // Using the passed "createEntity" function, we can get an empty, in-memory entity, of any type.
  let newWheel = await createEntity('SSR-DataSource/CarPackage/Wheel')
  newWheel.diameter = 155
  newWheel.name = 'MyWheel'
  entity['wheels'] = [newWheel]
  output.notify = true
  updateDocument({ ...output, entity })
}

const runnableMethods = {
  run,
}

export default runnableMethods
```
