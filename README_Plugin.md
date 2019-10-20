## Plugins Specification in DMT
Plugins make it possible to build components of the a application. 
The plugin should be an instance of the PluginInput blueprint, with a blueprint describing the plugin itself. 

A PluginInput blueprint makes it possible to replace entire plugins which can wrap libraries and core components of an application. 
When all parts of an applications is a plugin, the application itself can be a plugin. If DMT was a plugin, a DMT application blueprint 
would have property api, an Api blueprint with list of endpoints where each endpoint would have a request and response blueprint. 

### Requirements    
A plugin needs two things: 
- A blueprint: (data, storageRecipes and uiRecipes)
- Children blueprints: a list of (data, storageRecipes and uiRecipes)
With these parts, a plugin have all data to present a two level nested blueprint. 

### Plugin Blueprint
A initial draft of the PluginInput blueprint. An PluginOutput will look similar.

```
{
  "type": "templates/SIMOS/blueprint",
  "description": "
    Inputs to a plugin. A plugin will use the fields in the entity to process output.  
    The plugin can itself have plugins or widget. These are set in the uiRecipe for 
    the blueprint which is input to the plugin
 ",
  "name": "BasicPluginInput",
  "attributes": [
    {
      "type": "string",
      "name": "name",
      "description": "Name of the plugin."
    }, {
      "type": "string",
      "name": "description",
      "description": "Description of the plugin."
    }, {
      "type": "string",
      "name": "type",
      "description": "Type of the blueprint -> PluginBlueprint"
    }, {
      "type": "string",
      "name": "blueprint",
      "description": "blueprint type is a input to a plugin"
    }, {
      "type": "string",
      "name": "children",
      "dimension": "*",
      "description": "A list of types that are direct children of the blueprint"
    }, {
      "type": "boolean",
      "name": "inPlace",
      "description": "
        If the instance should replace blueprint types with the blueprint data. 
        Only children is replaced, while grandchildren will still have 
        references (type as string) to other blueprints. 
        If inPlace is false, recursive code is probably necessary.
      "
    }
  ]
}
```
Output in this context is a generated form, plot, tables etc. 
IndexNodes and TreeView with lazy loading is also suitable as a plugin, 
where only the first two levels are generated. 

### Example PluginInput
```
{
  "type": "templates/SIMOS/InputPlugin",
  "name": "PlotPlugin",
  "description": "
    A plugin for plots. Types of plot are provided by the plugin, 
    which itself may support plugins or widget. These are set in the 
    uiRecipe for the blueprint.
  ",
  "blueprint": "templates/CarsDemo/Car",
  "children": [
    "templates/CarsDemo/Wheel",
    "templates/CarsDemo/subdir/Engine"
  ],
  "inPlace": true
}
```