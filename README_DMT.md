#### Data modelling tool - DMT
The purpose of this document is to get a high level understanding of the core concept. 
It should minimize the risk of misunderstandings between stakeholders.

#### Introduction
The data modelling tool is a tool for models, e.g templates, blueprints and entities. Entities can be used for creating applications, 
libraries, code generators and even the DMT itself.
This is achieved by controlling the boundaries and expressiveness of the models. 
This makes it possible to create a recursive typebound system.


#### Definitions

- Template: Acts as a toplevel blueprint in DMT. The Blueprint type is the parent of all templates, including itself (template is an instance 
of a template)
- Blueprint: Instance of a template, or a template to a entity. A blueprint defines new type with a collection of properties.
- Entity: Instance of a blueprint. Values of the properties defined in a blueprint
- Document: Any valid type (template, blueprint and entity are all types based on another type, the parent)

It gets confusing quickly when talking about templates, blueprints and entities since a blueprint may be a template, blueprint or entity based 
on the context. Thinking in terms of type and instance is beneficial.


#### A basic blueprint example
When looking at a blueprint or template, it is helpful to look at the type. 
Below is a short version of a BlueprintAttribute, which in this context becomes a blueprint of type BlueprintAttribute, 
based on a Blueprint template.
```
{
  "type": "system/SIMOS/Blueprint",
  "name": "BlueprintAttribute",
  "description": "This describes a blueprint attribute",
  "attributes": [
    {
      "name": "title",
      "type": "string"
    }
}
``` 
The only valid instance of type BlueprintAttribute is:
```
{
    title: "World" 
}
```

This example doesn't make much sense, but the key point is to understand that the instance can only have one property, which is defined in the 
attributes list in the parent. In other words, all properties are defined by the type of the instance.

It become more complex when we add a property with name attributes in the parent, making blueprints recursive. 
To add more expressiveness to the blueprints, we should introduce the concept of keywords in DMT, in the next section.

#### Keywords
Keywords is property metadata. Keywords and types are the building blocks. 

- name: All properties must have name. The name of the field. 
- type: All properties must have type, either a primitive type, or a blueprint type.
- description: All properties may have a description, which acts as documentation on the property. Description in this context 
should not be confused with a property with name description. Its just metadata to a property.
- dimensions: degree of dimensions, the set of dimensions is arbitrary strings, controlled by environment where the type is used. 
e.g '*' is array in DMT.
- contained: [Definition](README_Contained.md) A boolean flag express if a property is contained or not. A document cannot have a property with contained = false.  
If a property is not contained, it's the same as it did not exist, because the instance dont contain the property. 
The keyword contains is necessary to express behavior in non model blueprints, like recipes.
- optional: A property may be optional, default is false, which means all properties are required by default. For any valid model, 
a required property cannot be omitted as a property in an instance of the blueprint.
- value: The value of the property, restricted by the 'type', referenced to by the keyword 'name'
- enum: reference to an instance of Enum type. Value holding the chosen enum value. 


#### Validation of documents
Any document can be validated by simply looking at the attributes of the type, and make sure all required properties are present in the blueprint. 
Non keywords may be added to keywords or added to the type's attributes (new property in attributes list in the parent)

#### Recipes

DMT have a main concept of types in a model. To express how a model is stored and presented, we use a concept of recipes. A recipe is a blueprint. 
A recipe may add metadata optionally to all properties in a blueprint, or on every blueprint in a model. When recipes are omitted, 
default values in the models should be used. Like contained = true, and required (optional = false). 

The recipe blueprints itself has a type (another blueprint) which makes it typebound. This opens up a lot of possibilities.
Its possible to build libraries with an interfaces, with input and output types. Libraries, plugins and services become easy to replace. 

We have two kind of recipes in the DMT:
* StorageRecipes. Recipe for how to store data. Not contained is preferred for all types, which makes it useful for document and relational storage. Contained means the value is inPlace, in general, primitives should be stored with default contained property.
* UiRecipe. Recipe for how to present data. 