## Plugins Specification in DMT
Plugins make it possible to build components of the a application. 
The plugin should be an instance of the PluginInput blueprint, with a blueprint describing the plugin itself. 

A PluginInput blueprint makes it possible to replace entire plugins which can wrap libraries and core components of an application. 
When all parts of an applications is a plugin, the application itself can be a plugin. If DMT was a plugin, a DMT application blueprint 
would have property api, an Api blueprint with list of endpoints where each endpoint would have a request and response blueprint. 

### Requirements    
A plugin needs three set of blueprints (collection of attributes, storageRecipes and uiRecipes):
- Type of the blueprint
- The blueprint
- Children blueprints: a list of blueprints that the blueprint consumes.
With these parts, a plugin gets all data to present a two level nested blueprint. 
- Settings of a plugin: Stored in recipes.  

### Plugin Blueprint
A initial draft of the PluginInput blueprint. An PluginOutput will look similar.

```
{
  "type": "system/SIMOS/blueprint",
  "description": "
    Inputs to a plugin.
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
  "type": "system/SIMOS/InputPlugin",
  "name": "PlotPlugin",
  "description": "
    A plugin for plots. Types of plot are provided by the plugin.
  ",
  "blueprint": "templates/CarsDemo/Car",
  "children": [
    "templates/CarsDemo/Wheel",
    "templates/CarsDemo/subdir/Engine"
  ],
}
```