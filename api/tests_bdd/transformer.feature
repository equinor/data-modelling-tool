Feature: Transform blueprints to json schema

  Scenario: Transform blueprint to json schema
    Given i access the resource url "/api/transformer/json-schema"
    When i make a "POST" request
    """
    {
      "attributes": [
      {
        "type": "integer",
        "value": "",
        "name": "attribute_1"
      },
      {
        "type": "string",
        "value": "2",
        "name": "attribute_2",
        "dimensions": ["*"]
      }
    ]
    }
    """
    Then the response status should be "OK"
    And the response should equal
    """
    {
      "properties" : {
         "attribute_1": {
           "type": "integer"
         },
         "attribute_2": {
           "type": "array",
           "items": {
             "type": "string"
           }
         }
      }
    }
    """
