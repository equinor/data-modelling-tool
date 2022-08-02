Feature: Get all related blueprints

  Background: There are data sources in the system
    Given there are basic data sources with repositories
      |   name  |
      | blueprints |
    Given data modelling tool blueprints are imported
    Given there exist document with id "a55fe052-1c85-438a-8882-31f98529b623" in data source "blueprints"
    """
    {
        "name": "root_package",
        "description": "",
        "type": "system/SIMOS/Package",
        "isRoot": true,
        "content": [
            {
                "_id": "a5a2183d-8fc6-45c6-baa4-d60290367d00",
                "name": "ParentBlueprint",
                "type": "system/SIMOS/Blueprint"
            },
            {
                "_id": "5286dc90-9136-43ab-b00c-6395df54bf62",
                "name": "ChildBlueprint",
                "type": "system/SIMOS/Blueprint"
            }
        ]
    }
    """

    Given there exist document with id "a5a2183d-8fc6-45c6-baa4-d60290367d00" in data source "blueprints"
    """
    {
      "type": "system/SIMOS/Blueprint",
      "name": "ParentBlueprint",
      "description": "",
      "attributes": [
        {
          "attributeType": "string",
          "type": "system/SIMOS/BlueprintAttribute",
          "name": "name"
        },
        {
          "attributeType": "string",
          "type": "system/SIMOS/BlueprintAttribute",
          "name": "type"
        },
        {
          "attributeType": "string",
          "type": "system/SIMOS/BlueprintAttribute",
          "name": "description"
        },
        {
          "attributeType": "blueprints/root_package/ChildBlueprint",
          "type": "system/SIMOS/BlueprintAttribute",
          "name": "complexChild",
          "dimensions": "*"
        }
      ]
    }
    """

    Given there exist document with id "5286dc90-9136-43ab-b00c-6395df54bf62" in data source "blueprints"
    """
    {
      "type": "system/SIMOS/Blueprint",
      "name": "ChildBlueprint",
      "description": "",
      "attributes": [
        {
          "attributeType": "string",
          "type": "system/SIMOS/BlueprintAttribute",
          "name": "name"
        },
        {
          "attributeType": "string",
          "type": "system/SIMOS/BlueprintAttribute",
          "name": "type"
        },
        {
          "attributeType": "string",
          "type": "system/SIMOS/BlueprintAttribute",
          "name": "description"
        }
      ]
    }
    """

  Scenario: Get all connected blueprints
    Given i access the resource url "/api/v1/blueprints/blueprints/root_package/ParentBlueprint"
    When i make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "blueprints/root_package/ParentBlueprint": {},
      "blueprints/root_package/ChildBlueprint": {},
      "system/SIMOS/BlueprintAttribute": {},
      "system/SIMOS/Blueprint": {}
    }
    """
