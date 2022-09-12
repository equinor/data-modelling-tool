---
title: Blueprints
sidebar_position: 1
---

The data modelling tool is a tool that can be used for modelling complex domain models.

## What is a Blueprint?

A domain model is called for blueprint.

An instances of a blueprint is called entitiy.

Below is a short version of a blueprint for a Car.


```json
{
  "type": "system/SIMOS/Blueprint",
  "name": "Car",
  "description": "This describes how a car looks like",
  "attributes": [
    {
      "attributeType": "string",
      "type": "system/SIMOS/BlueprintAttribute",
      "name": "name"
    },
    {
      "attributeType": "string",
      "type": "system/SIMOS/BlueprintAttribute",
      "name": "description"
    }
}
```

It says that a Car can have an attribute `name` and `description`.

So an instance of a Car can look like.

```json
{
   "name": "Volvo",
   "description": "This is an typically car type used in Norway"
}
```

#### Blueprint attributes

Any blueprint can be understood by simply looking at its attributes. Each attribute has several options, some are required and other are optional.

| Attribute | Type        | Description |
|----| ----------- |-------------|
|name|string|Name of the attribute|
|attributeType|string|Type of the attribute. Can be a reference to another blueprint, or a primitive type.
|extends|string|A reference to another blueprint. The blueprint will inherit attributes from referenced blueprint.
|contained|boolean|Describes the conceptual belonging of one entity to another. In other words, if an entity must always be considered in the context of it's "parent" (true), or the entity has meaning on it's own (false).
|dimensions|string|Degree of dimensions. Format; A list of integers, each integer defines the size of a dimension. "*"(wildcard) has the special meaning of "unfixed size|
|optional|boolean|If the attribute is optional or required in the entity|
|default|any json|Default value for the attribute. Same type as the attribute itself|
|enumType|string|A reference to an Enum entity. Value should hold the chosen enum value in the entity|
|inherit|boolean|Property is required in the entity|
