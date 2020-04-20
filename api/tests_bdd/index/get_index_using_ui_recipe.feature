Feature: UI Recipe

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name | local    | documents  | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | system           | local    | system     | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | test-source-name | local    | test       | blueprints   | mongo-db |

    Given there exist document with id "1" in data source "test-source-name"
    """
    {
        "name": "TestPackage",
        "description": "",
        "type": "system/DMT/Package",
        "content": [
            {
                "_id": "4",
                "name": "TestContainerMixContained"
            },
            {
                "_id": "3",
                "name": "TestContainer"
            },
            {
                "_id": "2",
                "name": "ItemType"
            }
        ],
        "isRoot": true,
        "storageRecipes": [],
        "uiRecipes": []
    }
    """

    Given there exist document with id "2" in data source "test-source-name"
    """
    {
      "type": "system/SIMOS/Blueprint",
      "name": "ItemType",
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
          "name": "description"
        },
        {
          "attributeType": "string",
          "type": "system/SIMOS/BlueprintAttribute",
          "name": "type"
        }
      ],
      "storageRecipes": [],
      "uiRecipes": []
    }
    """

    Given there exist document with id "3" in data source "test-source-name"
    """
    {
      "type": "system/SIMOS/Blueprint",
      "name": "TestContainer",
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
          "name": "description"
        },
        {
          "attributeType": "string",
          "type": "system/SIMOS/BlueprintAttribute",
          "name": "type"
        },
        {
          "attributeType": "test-source-name/TestPackage/ItemType",
          "type": "system/SIMOS/BlueprintAttribute",
          "name": "itemContained"
        },
        {
          "attributeType": "test-source-name/TestPackage/ItemType",
          "type": "system/SIMOS/BlueprintAttribute",
          "dimensions": "*",
          "name": "itemsContained"
        },
        {
          "attributeType": "test-source-name/TestPackage/ItemType",
          "type": "system/SIMOS/BlueprintAttribute",
         "name": "itemNotContained"
        },
        {
          "attributeType": "test-source-name/TestPackage/ItemType",
          "type": "system/SIMOS/BlueprintAttribute",
          "dimensions": "*",
          "name": "itemsNotContained"
        }
      ],
      "storageRecipes": [],
      "uiRecipes": [
        {
          "type": "system/SIMOS/UiRecipe",
          "name": "INDEX",
          "description": "",
          "plugin": "INDEX",
          "options": [],
          "attributes": [
           {
              "name": "itemContained",
              "type": "system/SIMOS/UiAttribute",
              "attributeType": "system/SIMOS/BlueprintAttribute",
              "contained": true
            },
            {
              "name": "itemsContained",
              "type": "system/SIMOS/UiAttribute",
              "attributeType": "system/SIMOS/BlueprintAttribute",
              "contained": true
            },
            {
              "name": "itemNotContained",
              "type": "system/SIMOS/UiAttribute",
              "attributeType": "system/SIMOS/BlueprintAttribute",
              "contained": false
            },
            {
              "name": "itemsNotContained",
              "type": "system/SIMOS/UiAttribute",
              "attributeType": "system/SIMOS/BlueprintAttribute",
              "contained": false
            }
          ]
        }
      ]
    }
    """
    Given there exist document with id "4" in data source "test-source-name"
    """
    {
      "type": "system/SIMOS/Blueprint",
      "name": "TestContainerMixContained",
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
          "name": "description"
        },
        {
          "attributeType": "string",
          "type": "system/SIMOS/BlueprintAttribute",
          "name": "type"
        },
        {
          "attributeType": "test-source-name/TestPackage/ItemType",
          "type": "system/SIMOS/BlueprintAttribute",
          "name": "itemModelNotContained",
          "contained": false
        },
        {
          "attributeType": "test-source-name/TestPackage/ItemType",
          "type": "system/SIMOS/BlueprintAttribute",
          "name": "itemStorageNotContained"
        }
      ],
      "storageRecipes": [
        {
          "type": "system/SIMOS/StorageRecipe",
          "name": "DEFAULT",
          "description": "",
          "attributes": [
            {
              "name": "itemStorageNotContained",
              "contained": false,
              "type": "system/SIMOS/StorageAttribute"
            }
          ]
        }
      ],
      "uiRecipes": []
    }
    """

    Given there exist document with id "1" in data source "data-source-name"
    """
    {
        "name": "Package",
        "description": "",
        "type": "system/DMT/Package",
        "content": [
            {
                "_id": "2",
                "type": "test-source-name/TestPackage/TestContainer",
                "name": "TestContainer"
            },
            {
                "_id": "3",
                "type": "test-source-name/TestPackage/TestContainerMixContained",
                "name": "MixContained"
            },
            {
              "_id": "4"
            }
        ],
        "isRoot": true,
        "storageRecipes": [],
        "uiRecipes": []
    }
    """

    Given there exist document with id "2" in data source "data-source-name"
    """
    {
        "name": "Container",
        "description": "",
        "type": "test-source-name/TestPackage/TestContainer",
        "itemContained": {
           "name": "Contained Item",
           "type": "test-source-name/TestPackage/ItemType",
           "description": ""
        },
        "itemsContained": [
          {
             "name": "Contained Item 1",
             "type": "test-source-name/TestPackage/ItemType",
             "description": ""
          }
        ],
        "itemNotContained": {
           "name": "Not Contained Item",
           "type": "test-source-name/TestPackage/ItemType",
           "description": ""
        },
        "itemsNotContained": [
          {
             "name": "Not Contained Item 1",
             "type": "test-source-name/TestPackage/ItemType",
             "description": ""
          }
        ],
        "storageRecipes": [],
        "uiRecipes": []
    }
    """

    Given there exist document with id "3" in data source "data-source-name"
    """
    {
        "name": "MixContained",
        "description": "",
        "type": "test-source-name/TestPackage/TestContainerMixContained",
        "itemModelNotContained": {
           "name": "Contained Item",
           "type": "test-source-name/TestPackage/ItemType",
           "description": ""
        },
        "itemStorageNotContained": {
             "name": "Contained Item 1",
             "type": "test-source-name/TestPackage/ItemType",
             "_id": "4"
        }
    }
    """

    Given there exist document with id "4" in data source "data-source-name"
    """
    {
      "_id": "4",
      "name": "Contained Item 1",
      "type": "test-source-name/TestPackage/ItemType",
      "description": ""
    }
    """
  Scenario: Get index for single document (Document)
    Given I access the resource url "/api/v4/index/data-source-name/1/2"
    And data modelling tool templates are imported
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
       "2":{
         "id":"2",
         "parentId": "1",
         "type":"test-source-name/TestPackage/TestContainer",
         "title":"Container",
         "nodeType":"document-node",
         "children":[
            "2.itemContained",
            "2.itemsContained"
         ]
       }
    }
    """
    And the array at 2.children should be of length 2

  Scenario: Get index for single document (model- and storage-NOT-contained)
    Given I access the resource url "/api/v4/index/data-source-name/1/3"
    And data modelling tool templates are imported
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
       "3":{
         "id":"3",
         "parentId": "1",
         "type":"test-source-name/TestPackage/TestContainerMixContained",
         "title":"MixContained",
         "nodeType":"document-node",
         "children":[
            "3.itemModelNotContained",
            "4"
         ]
       }
    }
    """
    And the array at 3.children should be of length 2
