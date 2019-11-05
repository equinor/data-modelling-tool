#### Data modelling tool - DMT
The purpose of this document is to get a high level understanding of the core concept. 
It should minimize the risk of misunderstandings between stakeholders.

#### Introduction
The data modelling tool is a tool for models (blueprints and entities), 
which are based on a framework for language and library agnostic type system. 
Models can be used for creating applications, 
libraries, code generators and even the DMT itself.
This is achieved by controlling the boundaries and expressiveness of the models. 
This makes it possible to create a recursive typebound system.


#### Definitions
- Document: A container for a entity and optionally a blueprint, is recursive if it has a blueprint. 
- Blueprint: A collection of attributes
- Entity: A collection attributes value


#### A basic blueprint example
Below is a short version of a BlueprintAttribute document.  
* The entity is the root key value pairs. (type, name, description and attributes)
* The blueprint is the set of attributes in the attributes property of the entity.


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


#### Keywords
Keywords is property metadata. Keywords and types are the building blocks. 

|Keyword|type|Description|
|---|-----|---|
|name|string|Name of the property, the key in the key, value pair in the entity|
|value|any json|Value of the property, the value in the key, value pair in the entity|
|type|string|Type of the entity, a string reference to blueprint. Has the format datasource/documentId|
|contained|boolean|The value of the property is an entity, or a reference to an entity. In both cases, the property has a blueprint reference in the blueprint|
|dimensions|string|degree of dimensions, the set of dimensions is arbitrary strings, controlled by environment where the type is used. e.g '*' is array in DMT.|
|optional|boolean|The property is optional or required in the blueprint|
|default|any json|Default value for the property. Same type as the property itself|
|enumType|string|A reference to an enum. Value should hold the chosen enum value in the entity|
|inherit|boolean|Property is required in the entity|

We aim to avoid typical reserved keywords in programming languages (enum, default, extends etc) 

#### Contained
Contained: The value in the entity is a an entity.
```
@todo add example
```
Not contained: The value in the entity is a reference on the format "datasource/documentId"
```
@todo add example
```


#### Validation of documents
Any document can be validated by simply looking at the attributes (blueprint) of the document's type, 
and check if all properties in the entity of the document match the blueprint. 
Non keywords may be added to keywords or added to the type's attributes (new property in attributes list in the parent)

#### Recipes

DMT have a main concept of types in a model. To express how a model is stored and presented, we use a concept of recipes. A recipe is a blueprint. 
A recipe may add metadata optionally to all properties in a blueprint, or on every blueprint in a model. When recipes are omitted, 
default values in the models should be used. Like contained = true, and required (optional = false). 

The recipe blueprints itself has a type (another blueprint) which makes it typebound. This opens up a lot of possibilities.
Its possible to build libraries with an interfaces, with input and output types. Libraries, plugins and services become easy to replace. 

We have two kind of recipes in the DMT:
* StorageRecipes. Recipe for how to store data. Not contained is preferred for all types, 
which makes it useful for document and relational storage. Contained means the value is inPlace, 
in general, primitives should be stored with default contained property.
* UiRecipe. Recipe for how to present data. 