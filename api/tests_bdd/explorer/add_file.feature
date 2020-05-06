Feature: Explorer - Add file

  Background: There are data sources in the system


    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection     |   type    |
      | db   | 27017 | maf      | maf      | false | data-source-name | local    | documents      |  mongo-db |
      | db   | 27017 | maf      | maf      | false | SSR-DataSource   | local    | SSR-DataSource |  mongo-db |
      | db   | 27017 | maf      | maf      | false | system           | local    | system         |  mongo-db |
      | db   | 27017 | maf      | maf      | false | apps             | local    | applications   |  mongo-db |

    Given data modelling tool templates are imported

    Given there are documents for the data source "data-source-name" in collection "documents"
      | uid | parent_uid | name         | description | type               |
      | 1   |            | root_package |             | system/SIMOS/Package |

  Scenario: Add file - not contained
    Given i access the resource url "/api/v2/explorer/data-source-name/add-file"
    When i make a "POST" request
    """
    {
      "name": "new_document",
      "parentId": "1",
      "type": "system/SIMOS/Blueprint",
      "attribute": "content"
    }
    """
    Then the response status should be "OK"
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
          "name":"root_package",
          "type":"system/SIMOS/Package",
          "content":[
            {
              "name":"new_document"
            }
          ],
          "isRoot":true,
          "storageRecipes":[]
       }
    }
    """

  Scenario: Add file with missing parameter name should fail
    Given i access the resource url "/api/v2/explorer/data-source-name/add-root-package"
    When i make a "POST" request
    """
    {
      "parentId": 1,
      "type": "system/SIMOS/Blueprint"
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


  Scenario: Add file to parent that does not exists
    Given i access the resource url "/api/v2/explorer/data-source-name/add-file"
    When i make a "POST" request
    """
    {
      "name": "new_document",
      "parentId": "-1",
      "type": "system/SIMOS/Blueprint",
      "attribute": "documents"
    }
    """
    Then the response status should be "Not Found"
    And the response should equal
    """
    {"type": "RESOURCE_ERROR", "message": "The entity, with id -1 is not found"}
    """
