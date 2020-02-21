Feature: Document - Generate JSON Schema

  Background: There are data sources in the system
    Given data modelling tool templates are imported
    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | blueprints| local    | documents  | blueprints   | mongo-db |

    Given there exist document with id "1" in data source "blueprints"
    """
    {
        "name": "root_package",
        "description": "",
        "type": "system/DMT/Package",
        "isRoot": true,
        "content": [
            {
                "_id": "2",
                "name": "ParentBlueprint",
                "type": "system/SIMOS/Blueprint"
            },
            {
                "_id": "3",
                "name": "ChildBlueprint",
                "type": "system/SIMOS/Blueprint"
            }
        ]
    }
    """

    Given there exist document with id "2" in data source "blueprints"
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

    Given there exist document with id "3" in data source "blueprints"
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
    Given i access the resource url "/api/blueprints/blueprints/root_package/ParentBlueprint"
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