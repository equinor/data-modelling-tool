Feature: Document 2

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name | local    | documents  | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | test-source-name | local    | test       | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | system           | local    | system     | system       | mongo-db |

    Given there exist document with id "1" in data source "test-source-name"
    """
    {
        "name": "TestData",
        "description": "",
        "type": "system/DMT/Package",
        "content": [
            {
                "_id": "3",
                "name": "TestContainer",
                "type": "test-source-name/TestData/TestContainer"
            },
            {
                "_id": "2",
                "name": "ItemType",
                "type": "test-source-name/TestData/ItemType"
            },
            {
                "_id": "4",
                "name": "ItemTypeTwo",
                "type": "test-source-name/TestData/ItemTypeTwo"
            }

        ],
        "isRoot": true,
        "storageRecipes":[],
        "uiRecipes":[]
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
          "attributeType": "string", "type": "system/SIMOS/BlueprintAttribute",
          "name": "name"
        },
        {
          "attributeType": "string", "type": "system/SIMOS/BlueprintAttribute",
          "optional": true,
          "default": "",
          "name": "description"
        },
        {
          "attributeType": "string",
          "type": "system/SIMOS/BlueprintAttribute",
          "name": "type"
        },
        {
          "attributeType": "string",
          "type": "system/SIMOS/BlueprintAttribute",
          "optional": true,
          "name": "extra"
        },
        {
          "attributeType": "string",
          "type": "system/SIMOS/BlueprintAttribute",
          "optional": true,
          "name": "list"
        },
        {
          "attributeType": "test-source-name/TestData/ItemTypeTwo",
          "type": "system/SIMOS/BlueprintAttribute",
          "optional": true,
          "name": "complexList",
          "dimensions" : "*"
        }
      ],
      "storageRecipes":[],
      "uiRecipes":[]
    }
    """

    Given there exist document with id "4" in data source "test-source-name"
    """
    {
      "type": "system/SIMOS/Blueprint",
      "name": "ItemTypeTwo",
      "description": "",
      "attributes": [
        {
          "attributeType": "string", "type": "system/SIMOS/BlueprintAttribute",
          "name": "name"
        },
        {
          "attributeType": "string", "type": "system/SIMOS/BlueprintAttribute",
          "optional": true,
          "default": "",
          "name": "description"
        },
        {
          "attributeType": "string",
          "type": "system/SIMOS/BlueprintAttribute",
          "name": "type"
        },
        {
          "attributeType": "string",
          "type": "system/SIMOS/BlueprintAttribute",
          "optional": true,
          "name": "extra"
        }
      ],
      "storageRecipes":[],
      "uiRecipes":[]
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
          "name": "type"
        },
        {
          "attributeType": "string",
          "type": "system/SIMOS/BlueprintAttribute",
          "name": "description"
        },
        {
          "attributeType": "test-source-name/TestData/ItemType",
          "type": "system/SIMOS/BlueprintAttribute",
          "optional": true,
          "name": "itemContained"
        },
        {
          "attributeType": "test-source-name/TestData/ItemType",
          "type": "system/SIMOS/BlueprintAttribute",
          "optional": true,
          "dimensions": "*",
          "name": "itemsContained"
        },
        {
          "attributeType": "test-source-name/TestData/ItemType",
          "type": "system/SIMOS/BlueprintAttribute",
          "optional": false,
          "name": "itemNotContained"
        },
        {
          "attributeType": "test-source-name/TestData/ItemType",
          "type": "system/SIMOS/BlueprintAttribute",
          "optional": true,
          "dimensions": "*",
          "name": "itemsNotContained"
        }
      ],
      "storageRecipes": [
        {
          "name": "DefaultStorageRecipe",
          "type": "system/SIMOS/StorageRecipe",
          "description": "",
          "attributes": [
            {
              "name": "itemNotContained",
              "type": "test-source-name/TestData/ItemType",
              "contained": false
            },
            {
              "name": "itemsNotContained",
              "type": "test-source-name/TestData/ItemType",
              "contained": false
            }
          ]
        }
      ],
      "uiRecipes":[]
    }
    """

    Given data modelling tool templates are imported

    Given there are documents for the data source "data-source-name" in collection "documents"
      | uid | parent_uid | name          | description | type                                    |
      | 1   |            | package_1     |             | system/DMT/Package                      |
      | 2   | 1          | sub_package_1 |             | system/DMT/Package                      |
      | 3   | 1          | sub_package_2 |             | system/DMT/Package                      |
      | 4   | 2          | document_1    |             | system/DMT/Package                      |
      | 5   | 2          | document_2    |             | system/SIMOS/Blueprint                  |
      | 6   | 3          | container_1   |             | test-source-name/TestData/TestContainer |


  Scenario: Get document
    Given I access the resource url "/api/v2/documents/data-source-name/1"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
       "blueprint":{
          "name":"Package",
          "type":"system/SIMOS/Blueprint"
       },
       "document":{
          "name":"package_1",
          "type":"system/DMT/Package",
          "content":[
             {
                "name":"sub_package_1"
             },
             {
                "name":"sub_package_2"
             }
          ],
          "isRoot":true,
          "storageRecipes":[],
          "uiRecipes":[]
       }
    }
    """

  Scenario: Get attribute
    Given I access the resource url "/api/v2/documents/test-source-name/1?attribute=content.0"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
       "blueprint":{
          "name":"Blueprint",
          "type":"system/SIMOS/Blueprint"
       },
       "document":{
          "type": "system/SIMOS/Blueprint",
          "name": "TestContainer"
       }
    }
    """

  Scenario: Update document (only contained)
    Given i access the resource url "/api/v2/documents/data-source-name/1"
    When i make a "PUT" request
    """
    {
      "name": "package_1",
      "type": "system/DMT/Package",
      "description": "new description"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "data": {
        "name": "package_1",
        "type": "system/DMT/Package",
        "description": "new description"
      }
    }
    """

  Scenario: Update document (both contained and not contained)
    Given i access the resource url "/api/v2/documents/data-source-name/6"
    When i make a "PUT" request
    """
    {
      "name": "new_name",
      "type": "test-source-name/TestData/TestContainer",
      "description": "some description",
      "itemContained": {
          "name": "item_contained",
          "type": "test-source-name/TestData/ItemType",
           "extra": "extra_1"
      },
      "itemsContained": [
        {
          "name": "item_1_contained",
          "type": "test-source-name/TestData/ItemType",
          "list": ["a", "b", "c"],
          "complexList": [
              {
                "name": "item_1_contained",
                "type": "test-source-name/TestData/ItemTypeTwo",
                "extra": "extra_1"
              }
            ]
        }
      ],
      "itemNotContained": {
          "name": "item_single",
          "type": "test-source-name/TestData/ItemType",
           "extra": "extra_1"
      },
      "itemsNotContained": [
        {
          "name": "item_1",
          "type": "test-source-name/TestData/ItemType",
          "list": ["a", "b"],
          "complexList": [
              {
                "name": "item_1",
                "type": "test-source-name/TestData/ItemTypeTwo",
                "extra": "extra_1"
              }
            ]
        }
      ]
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "data": {
        "name": "new_name",
        "type": "test-source-name/TestData/TestContainer",
        "description": "some description",
        "itemContained": {
          "name": "item_contained",
          "type": "test-source-name/TestData/ItemType",
           "extra": "extra_1"
        },
        "itemsContained": [
        {
            "name": "item_1_contained",
            "type": "test-source-name/TestData/ItemType",
            "list": ["a", "b", "c"],
            "complexList": [
                {
                  "name": "item_1_contained",
                  "type": "test-source-name/TestData/ItemTypeTwo",
                  "extra": "extra_1"
                }
              ]
          }
        ],
        "itemNotContained": {
            "name": "item_single",
            "type": "test-source-name/TestData/ItemType",
            "extra": "extra_1"
        },
        "itemsNotContained": [
          {
            "name": "item_1",
            "type": "test-source-name/TestData/ItemType",
            "list": ["a", "b"],
            "complexList": [
              {
                "name": "item_1",
                "type": "test-source-name/TestData/ItemTypeTwo",
                "extra": "extra_1"
              }
            ]
          }
        ]
      }
    }
    """

  Scenario: Update document (attribute and not contained)
    Given i access the resource url "/api/v2/documents/data-source-name/6?attribute=itemNotContained"
    And data modelling tool templates are imported
    When i make a "PUT" request
    """
    {
      "name": "item_single",
      "type": "test-source-name/TestData/ItemType"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "data": {
        "name": "item_single",
        "type": "test-source-name/TestData/ItemType"
      }
    }
    """
