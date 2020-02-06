#### Data modelling tool - DMT
The purpose of this document is to get a high level understanding of the core concepts. 
It should minimize the risk of misunderstandings between stakeholders.

#### Introduction
The data modelling tool is a tool for models (blueprints and entities), 
which are based on a framework for language and library agnostic type system. 
Models can be used for creating applications, 
libraries, code generators and even the DMT itself.
This is achieved by controlling the boundaries and expressiveness of the models. 
This makes it possible to create a recursive type bound system.


#### Definitions
- Document: A container for an entity and optionally a blueprint, is recursive if it has a blueprint. 
- Blueprint: A description of one or several attributes
- Entity: A collection of attribute values


#### A basic blueprint example
Below is a short version of a BlueprintAttribute document.  


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
|name|string|Name of the attribute, the key in the key value pair of the entity|
|type|string|Type of the attribute or document, a string reference to a blueprint, or a string that is the name of a primitive type.|
|contained|boolean|Describes the conceptual belonging of one entity to another. In other words, if an entity must always be considered in the context of it's "parent"(true), or the entity has meaning on it's own(false).  |
|dimensions|string|Degree of dimensions. Format; A list of integers, each integer defines the size of a dimension. "*"(wildcard) has the special meaning of "unfixed size".|
|optional|boolean|If the attribute is optional or required in the entity|
|default|any json|Default value for the attribute. Same type as the attribute itself|
|enumType|string|A reference to an Enum entity. Value should hold the chosen enum value in the entity|
|inherit|boolean|Property is required in the entity|

We aim to avoid typical reserved keywords in programming languages (enum, default, extends etc) 


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