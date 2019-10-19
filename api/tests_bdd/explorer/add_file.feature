Feature: Explorer - Add file

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name | maf      | documents  | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | templates        | dmt      | template   | blueprints   | mongo-db |

    Given there are documents for the data source "data-source-name" in collection "documents"
      | uid | parent_uid | name         | description | type                  |
      | 1   |            | root_package |             | templates/DMT/Package |

  Scenario: Add file - contained
    Given i access the resource url "/api/v2/explorer/data-source-name/add-file"
    And data modelling tool templates are imported
    When i make a "POST" request
    """
    {
      "name": "new_document",
      "parentId": "1",
      "type": "templates/SIMOS/Blueprint",
      "attribute": "documents"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
        "data":{
           "name":"new_document",
           "type":"templates/SIMOS/Blueprint",
           "storageRecipes":[]
        }
    }
    """
    Given I access the resource url "/api/v2/documents/data-source-name/1"
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
          "name":"root_package",
          "description":"",
          "type":"templates/DMT/Package",
          "documents":[
            {
              "name":"new_document"
            }
          ],
          "dependencies":[],
          "packages":[],
          "isRoot":false,
          "storageRecipes":[]
       }
    }
    """

  Scenario: Add file with missing parameter name should fail
    Given i access the resource url "/api/v2/explorer/data-source-name/add-root-package"
    And data modelling tool templates are imported
    When i make a "POST" request
    """
    {
      "parentId": 1,
      "type": "templates/SIMOS/Blueprint"
    }
    """
    Then the response status should be "Bad Request"
    And the response should equal
    """
    {
      "type": "PARAMETERS_ERROR",
      "message": "name: is missing"
    }
    """

  Scenario: Add file with missing parameters should fail
    Given i access the resource url "/api/v2/explorer/data-source-name/add-file"
    When i make a "POST" request
    """
    {}
    """
    Then the response status should be "Bad Request"
    And the response should equal
    """
    {
      "type": "PARAMETERS_ERROR",
      "message": "parentId: is missing\nname: is missing\ntype: is missing\nattribute: is missing"
    }
    """

  Scenario: Add file to parent that does not exists
    Given i access the resource url "/api/v2/explorer/data-source-name/add-file"
    When i make a "POST" request
    """
    {
      "name": "new_document",
      "parentId": "-1",
      "type": "templates/SIMOS/Blueprint",
      "attribute": "documents"
    }
    """
    Then the response status should be "System Error"
    And the response should equal
    """
    {
      "type": "SYSTEM_ERROR",
      "message": "EntityNotFoundException: 'The entity, with id -1 is not found'"
    }
    """


