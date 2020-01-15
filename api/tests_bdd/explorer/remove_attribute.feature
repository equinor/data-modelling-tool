Feature: Explorer - Remove file

  Background: There are data sources in the system

    Given  there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection     | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name | local    | documents      | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | SSR-DataSource   | local    | SSR-DataSource | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | system           | local    | system         | blueprints   | mongo-db |

    Given there exist document with id "1" in data source "data-source-name"
    """
    {
        "name": "TestData",
        "description": "",
        "type": "system/DMT/Package",
        "content": [
            {
                "_id": "2",
                "type": "data-source-name/TestData/TestContainer",
                "name": "TestContainer"
            },
            {
                "_id": "3",
                "type": "data-source-name/TestData/ItemType",
                "name": "ItemType"
            },
            {
                "_id": "4",
                "type": "data-source-name/TestData/ItemTypeTwo",
                "name": "ItemTypeTwo"
            },
            {
                "_id": "5",
                "type": "data-source-name/TestData/ItemTypeThree",
                "name": "ItemTypeThree"
            },
            {
                "_id": "6",
                "type": "data-source-name/TestData/TestContainer",
                "name": "container"
            },
            {
                "_id": "7",
                "type": "data-source-name/TestData/ItemTypeThree",
                "name": "three"
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
          "type": "system/SIMOS/BlueprintAttribute",
          "attributeType": "data-source-name/TestData/ItemType",
          "name": "item"
        }
      ],
      "storageRecipes": [],
      "uiRecipes": [
        {
          "type": "system/SIMOS/UiRecipe",
          "name": "EDIT",
          "description": "",
          "attributes": []
        },
        {
          "type": "system/SIMOS/UiRecipe",
          "name": "INDEX",
          "description": "",
          "attributes": []
        }
      ]
    }
    """

    Given there exist document with id "3" in data source "data-source-name"
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
        },
        {
          "type": "system/SIMOS/BlueprintAttribute",
          "attributeType": "data-source-name/TestData/ItemTypeTwo",
          "name": "itemTwo"
        }
      ],
      "storageRecipes": [],
      "uiRecipes": []
    }
    """

    Given there exist document with id "4" in data source "data-source-name"
    """
    {
      "type": "system/SIMOS/Blueprint",
      "name": "ItemTypeTwo",
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
          "type": "system/SIMOS/BlueprintAttribute",
          "attributeType": "data-source-name/TestData/ItemTypeThree",
          "name": "itemThree"
        }
      ],
      "storageRecipes": [
      {
          "name": "DefaultStorageRecipe",
          "type": "system/SIMOS/StorageRecipe",
          "description": "",
          "attributes": [
            {
              "name": "itemThree",
              "type": "system/SIMOS/StorageAttribute",
              "contained": false
            }
          ]
        }
      ],
      "uiRecipes": []
    }
    """

    Given there exist document with id "5" in data source "data-source-name"
    """
    {
      "type": "system/SIMOS/Blueprint",
      "name": "ItemTypeThree",
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

    Given there exist document with id "6" in data source "data-source-name"
    """
    {
       "type":"data-source-name/TestData/TestContainer",
       "name":"container",
       "description":"",
       "item":{
          "name":"one",
          "type":"data-source-name/TestData/ItemType",
          "itemTwo":{
             "type":"data-source-name/TestData/ItemTypeTwo",
             "name":"two",
             "itemThree":{
                "type":"data-source-name/TestData/ItemTypeThree",
                "_id":"7",
                "name":"three"
             }
          }
       }
    }
    """

    Given there exist document with id "7" in data source "data-source-name"
    """
    {
       "type":"data-source-name/TestData/ItemTypeThree",
       "name":"three",
       "description":""
    }
    """

  Scenario: Remove attribute - the index ui recipe
    Given i access the resource url "/api/v2/explorer/data-source-name/remove-attribute"
    And data modelling tool templates are imported
    When i make a "POST" request
  """
  {
    "parentId": "2",
    "attribute": "uiRecipes.1"
  }
  """
    Then the response status should be "OK"
    Given I access the resource url "/api/v2/documents/data-source-name/2"
    When I make a "GET" request
    Then the response should contain
  """
  {
    "document": {
      "type": "system/SIMOS/Blueprint",
      "name": "TestContainer",
      "description": "",
      "attributes": [],
      "storageRecipes": [],
      "uiRecipes": [
        {
          "type": "system/SIMOS/UiRecipe",
          "name": "EDIT",
          "description": "",
          "attributes": []
        }
      ]
    }
  }
  """

  Scenario: Remove attribute - the item and all its children
    Given i access the resource url "/api/v2/explorer/data-source-name/remove-attribute"
    And data modelling tool templates are imported
    When i make a "POST" request
  """
  {
    "parentId": "6",
    "attribute": "item"
  }
  """
    Then the response status should be "OK"
    Given I access the resource url "/api/v2/documents/data-source-name/6"
    When I make a "GET" request
    Then the response should contain
  """
  {
    "document": {
      "type": "data-source-name/TestData/TestContainer",
      "name": "container",
      "description": "",
      "item": {}
    }
  }
  """
 Given I access the resource url "/api/v2/documents/data-source-name/7"
    When I make a "GET" request
    Then the response status should be "System Error"
    And the response should equal
  """
  {
    "type": "SYSTEM_ERROR",
    "message": "EntityNotFoundException: 'The entity, with id 7 is not found'"
  }
  """
