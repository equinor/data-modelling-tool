Feature: Explorer - Remove file

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection     | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name | local    | documents      | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | SSR-DataSource   | local    | SSR-DataSource | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | system           | local    | system         | blueprints   | mongo-db |

    Given there are documents for the data source "data-source-name" in collection "documents"
      | uid | parent_uid | name          | description | type                   |
      | 1   |            | blueprints    |             | system/DMT/Package     |
      | 2   | 1          | sub_package_1 |             | system/DMT/Package     |
      | 3   | 2          | document_1    |             | system/SIMOS/Blueprint |

    Given there exist document with id "4" in data source "data-source-name"
    """
    {
        "name": "TestData",
        "description": "",
        "type": "system/DMT/Package",
        "content": [
            {
                "_id": "5",
                "type": "test-source-name/TestData/TestContainer",
                "name": "TestContainer"
            }
        ],
        "isRoot": true,
        "storageRecipes": [],
        "uiRecipes": []
    }
    """

    Given there exist document with id "5" in data source "data-source-name"
    """
    {
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

  Scenario: Remove attribute (the index ui recipe)
    Given i access the resource url "/api/v2/explorer/data-source-name/remove-attribute"
    And data modelling tool templates are imported
    When i make a "POST" request
  """
  {
    "parentId": "5",
    "attribute": "uiRecipes.1"
  }
  """
    Then the response status should be "OK"
    Given I access the resource url "/api/v2/documents/data-source-name/5"
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
