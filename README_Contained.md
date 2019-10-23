#### Contained
Definition: Contained in the data model (blueprint and entity instances, in other words: all documents) means:
```
contained: if the property is present in the model or not. Contained = false means that the property is omitted in the instance.
```

An example of the context of contained. 
Primitive types are in general contained.
Types are in general contained.

```
[
  {
    "type": "Blueprint",
    "name": "WavesBlueprint",
    "attributes": [
      {
        "type": "string",
        "name": "maxLength",
        "default": "2.5",
        "contained": true
      },
      {
        "type": "WeatherConditionBlueprint",
        "name": "weatherCondition",
        "description": "Weather conditions at the given timestamp",
        "contained": true
      },
      {
        "type": "wave",
        "name": "waves",
        "description": "stream of waves",
        "dimensions": "*",
        "contained": false
        //fetchType: "stream" example of new keyword.
      },
      {
        "type": "string",
        "name": "wavesFetchType",
        "default": "stream",
        "description": "example of adding a property instead of introducing a new keyword.",
        "contained": true
      }
    ]
  },
  {
    "type": "wave",
    "name": "WaveBlueprint",
    "attributes": [
      {
        "type": "number",
        "name": "speed",
        "dimensions": "*",
        "contained": true
      },
      {
        "type":  "number",
        "name": "amplitude",
        "dimensions": "*",
        "contained": true,
      }
    ]
  },
  {
    "type": "WaveBlueprint",
    "name": "WaveEntity"
    // code consuming wave entity need to use storageRecipe to populate waves property in WavesEntity.
    // waves are not contained, e.g not present in the model.
  }
}
```