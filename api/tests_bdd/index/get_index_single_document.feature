Feature: Index

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name | local      | documents  | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | system           | local      | system     | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | test-source-name | local      | test       | blueprints   | mongo-db |

    Given data modelling tool templates are imported

    Given there are documents for the data source "data-source-name" in collection "documents"
      | uid | parent_uid | name          | description | type                                    |
      | 1   |            | blueprints    |             | system/DMT/Package                      |
      | 2   | 1          | sub_package_1 |             | system/DMT/Package                      |
      | 3   | 2          | document_1    |             | system/SIMOS/Blueprint                  |

  Scenario: Get index for single document (Root Package)
    Given I access the resource url "/api/v4/index/data-source-name/1/1"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
       "1":{
          "parentId": null,
          "title":"blueprints",
          "id":"1",
          "nodeType":"document-node",
          "children":["2"],
          "type":"system/DMT/Package"
       }
    }
    """

  Scenario: Get index for single document (Package)
    Given I access the resource url "/api/v4/index/data-source-name/1/2"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
       "2": {
         "id": "2",
         "children": [
           "3"
         ],
         "nodeType": "document-node",
         "title": "sub_package_1",
         "type": "system/DMT/Package"
       }
    }
    """

  Scenario: Get index for single document (Blueprint)
    Given I access the resource url "/api/v4/index/data-source-name/2/3"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
       "3":{
          "parentId": null,
          "title":"document_1",
          "id":"3",
          "nodeType":"document-node",
          "children":[],
          "type":"system/SIMOS/Blueprint"
       }
    }
    """
