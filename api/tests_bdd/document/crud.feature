Feature: Document 2

  Background: There are data sources in the system

     Given there are mongodb data sources
      | host | port  | username | password | tls   | name            | database | collection     | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name| maf      | documents      | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | SSR-DataSource  | dmt      | SSR-DataSource | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | system          | dmt      | system         | blueprints   | mongo-db |

    Given there are documents for the data source "data-source-name" in collection "documents"
      | uid | parent_uid | name          | description | type                   |
      | 1   |            | package_1     |             | system/DMT/Package   |
      | 2   | 1          | sub_package_1 |             | system/DMT/Package   |
      | 3   | 1          | sub_package_2 |             | system/DMT/Package   |
      | 4   | 2          | document_1    |             | system/DMT/Package   |
      | 5   | 2          | document_2    |             | system/SIMOS/Blueprint |


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
          "documents":[],
          "dependencies":[],
          "packages":[
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

  Scenario: Update document
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
