Feature: Index

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name | maf      | documents  | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | system           | dmt      | system     | blueprints   | mongo-db |

    Given there are documents for the data source "data-source-name" in collection "documents"
      | uid | parent_uid | name          | description | type                   |
      | 1   |            | blueprints    |             | system/DMT/Package     |
      | 2   | 1          | sub_package_1 |             | system/DMT/Package     |
      | 3   | 2          | document_1    |             | system/SIMOS/Blueprint |


  Scenario: Get index for single document of type system/SIMOS/Blueprint
    Given I access the resource url "/api/v3/index/data-source-name/3"
    And data modelling tool templates are imported
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
       "3":{
          "parentId": null,
          "filename":"document_1",
          "title":"document_1",
          "id":"3",
          "nodeType":"document-node",
          "children":[],
          "type":"system/SIMOS/Blueprint"
       }
    }
    """

  Scenario: Get index for single document of type system/DMT/Package
    Given I access the resource url "/api/v3/index/data-source-name/2"
    And data modelling tool templates are imported
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
       "2":{
          "filename":"sub_package_1",
          "title":"sub_package_1",
          "id":"2",
          "nodeType":"document-node",
          "children":[],
          "type":"system/DMT/Package"
       }
    }
    """
