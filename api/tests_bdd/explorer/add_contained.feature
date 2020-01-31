Feature: Explorer - Add contained node

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name       | database | collection     | documentType | type     |
      | db   | 27017 | maf      | maf      | false | blueprints | local    | blueprints     | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | entities   | local    | entities       | entities     | mongo-db |
      | db   | 27017 | maf      | maf      | false | system     | local    | system         | blueprints   | mongo-db |

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
                "name": "RecursiveBlueprint",
                "type": "system/SIMOS/Blueprint"
            }
        ]
    }
    """
    Given there exist document with id "2" in data source "blueprints"
    """
    {
      "type": "system/SIMOS/Blueprint",
      "name": "RecursiveBlueprint",
      "description": "This describes a blueprint that has a list of itself",
      "attributes": [
        {
          "attributeType": "string",
          "type": "system/SIMOS/BlueprintAttribute",
          "name": "name",
          "optional": false
        },
        {
          "attributeType": "string",
          "type": "system/SIMOS/BlueprintAttribute",
          "name": "description",
          "optional": false
        },
        {
          "attributeType": "string",
          "type": "system/SIMOS/BlueprintAttribute",
          "name": "type",
          "optional": false,
          "default": "blueprints/root_package/RecursiveBlueprint"
        },
        {
          "name": "meAgain",
          "attributeType": "blueprints/root_package/RecursiveBlueprint",
          "type": "system/SIMOS/BlueprintAttribute",
          "default": "[]",
          "dimensions": "*"
        }
      ]
    }
    """
    Given there exist document with id "1" in data source "entities"
    """
    {
      "name": "recursiveTest",
      "description": "",
      "type": "blueprints/root_package/RecursiveBlueprint",
      "meAgain": [
        {
            "name": "level1-index0",
            "description": "",
            "type": "blueprints/root_package/RecursiveBlueprint",
            "diameter": 120,
            "pressure": 0,
            "meAgain": []
        },
        {
            "name": "level1-index1",
            "description": "",
            "type": "blueprints/root_package/RecursiveBlueprint",
            "diameter": 120,
            "pressure": 0,
            "meAgain": []
        }
      ]
    }
    """

  Scenario: Add nested contained node
    Given i access the resource url "/api/v2/explorer/entities/add-file"
    And data modelling tool templates are imported
    When i make a "POST" request
    """
    {
      "name": "level2",
      "parentId": "1",
      "type": "blueprints/root_package/RecursiveBlueprint",
      "attribute": "meAgain.1.meAgain"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {"uid": "1.meAgain.1.meAgain.0"}
    """
    Given I access the resource url "/api/v4/index/entities/1.meAgain.1/1.meAgain.1.meAgain"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
       "1.meAgain.1.meAgain": {
          "parentId": "1.meAgain.1",
          "title": "meAgain",
          "id": "1.meAgain.1.meAgain",
          "nodeType": "document-node",
          "children": [ ],
          "type": "blueprints/root_package/RecursiveBlueprint"
       }
    }
    """
