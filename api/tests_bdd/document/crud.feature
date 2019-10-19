Feature: Document 2

  Background: There are data sources in the system

     Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name | maf      | documents  | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | templates        | dmt      | templates  | blueprints   | mongo-db |

    Given there are documents for the data source "data-source-name" in collection "documents"
      | uid | parent_uid | name          | description | type                   |
      | 1   |            | package_1     |             | templates/DMT/Package   |
      | 2   | 1          | sub_package_1 |             | templates/DMT/Package   |
      | 3   | 1          | sub_package_2 |             | templates/DMT/Package   |
      | 4   | 2          | document_1    |             | templates/DMT/Package   |
      | 5   | 2          | document_2    |             | templates/SIMOS/Blueprint |


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
          "type":"templates/SIMOS/Blueprint"
       },
       "document":{
          "name":"package_1",
          "description":"",
          "type":"templates/DMT/Package",
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
       "type": "templates/SIMOS/Blueprint"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "data": {
        "name": "new_document",
        "type": "templates/SIMOS/Blueprint",
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
      "type": "templates/DMT/Package",
      "description": "new description"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "data": {
        "name": "package_1",
        "type": "templates/DMT/Package",
        "description": "new description"
      }
    }
    """
