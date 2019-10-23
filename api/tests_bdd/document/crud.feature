Feature: Document 2

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name | maf      | documents  | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | test-source-name | dmt      | test       | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | system           | dmt      | system     | system       | mongo-db |

    Given there exist document with id "1" in data source "test"
    """
    {
        "name": "TestData",
        "description": "",
        "type": "system/DMT/Package",
        "content": [
            {
                "_id": "3",
                "name": "TestContainer"
            },
            {
                "_id": "2",
                "name": "ItemType"
            }
        ],
        "dependencies": [],
        "isRoot": true,
        "storageRecipes": [],
        "applications": []
    }
    """

    Given there exist document with id "2" in data source "test"
    """
    {
      "type": "system/SIMOS/Blueprint",
      "name": "ItemType",
      "description": "",
      "attributes": [
        {
          "type": "string",
          "name": "name"
        },
        {
          "type": "string",
          "name": "description"
        },
        {
          "type": "string",
          "name": "extra"
        }
      ]
    }
    """

    Given there exist document with id "3" in data source "test"
    """
    {
      "type": "system/SIMOS/Blueprint",
      "name": "TestContainer",
      "description": "",
      "attributes": [
        {
          "type": "string",
          "name": "name"
        },
        {
          "type": "string",
          "name": "description"
        },
        {
          "type": "test-source-name/TestData/ItemType",
          "name": "itemNotContained"
        },
        {
          "type": "test-source-name/TestData/ItemType",
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
              "contained": false
            },
            {
              "name": "itemsNotContained",
              "contained": false
            }
          ]
        }
      ],
      "uiRecipes": []
    }
    """

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
    And data modelling tool templates are imported
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
          "description":"",
          "type":"system/DMT/Package",
          "dependencies":[],
          "content":[
             {
                "name":"sub_package_1"
             },
             {
                "name":"sub_package_2"
             }
          ],
          "isRoot":false,
          "storageRecipes":[]
       }
    }
    """

  Scenario: Create document
    Given i access the resource url "/api/v2/documents/data-source-name"
    And data modelling tool templates are imported
    When i make a "POST" request
    """
    {
       "name": "new_document",
       "type": "system/SIMOS/Blueprint"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "data": {
        "name": "new_document",
        "type": "system/SIMOS/Blueprint",
        "storageRecipes":[]
      }
    }
    """

  Scenario: Update document (only contained)
    Given i access the resource url "/api/v2/documents/data-source-name/1"
    And data modelling tool templates are imported
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
    And data modelling tool templates are imported
    When i make a "PUT" request
    """
    {
      "name": "new_name",
      "type": "test-source-name/TestData/TestContainer",
      "description": "some description",
      "itemNotContained": {
          "name": "item_single"
      },
      "itemsNotContained": [
        {
          "name": "item_1"
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
        "itemNotContained": {
            "name": "item_single"
        }
      }
    }
    """

    Scenario: Update document (attribute and not contained)
    Given i access the resource url "/api/v2/documents/data-source-name/6/itemNotContained"
    And data modelling tool templates are imported
    When i make a "PUT" request
    """
    {
      "name": "item_single"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "data": {
        "type": "test-source-name/TestData/TestContainer",
        "itemNotContained": {
            "name": "item_single"
        }
      }
    }
    """
