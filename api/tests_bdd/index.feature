Feature: Index

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name                     | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name         | maf      | documents  | blueprints   | mongo-db |

    Given there are documents in collection "documents"
      | uid | path                     | filename      | type   |
      | 1   | /                        | package_1     | folder |
      | 2   | /package_1               | sub_package_1 | folder |
      | 3   | /package_1               | sub_package_2 | folder |
      | 4   | /package_1/sub_package_1 | document_1    | file   |
      | 5   | /package_1/sub_package_1 | document_2    | file   |

  Scenario: Get index
    Given I access the resource url "/api/v3/index/data-source-name"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should equal
    """
    {
       "data-source-name": {
          "id": "data-source-name",
          "title": "data-source-name",
          "nodeType": "datasource",
          "children": ["data-source-name/1"]
       },
       "data-source-name/1":{
          "id":"data-source-name/1",
          "title":"package_1",
          "children":["data-source-name/2", "data-source-name/3"],
          "nodeType":"subpackage"
       },
       "data-source-name/2":{
          "id":"data-source-name/2",
          "title":"sub_package_1",
          "children":["data-source-name/4", "data-source-name/5"],
          "nodeType":"subpackage"
       },
       "data-source-name/3":{
          "id":"data-source-name/3",
          "title":"sub_package_2",
          "children":[],
          "nodeType":"subpackage"
       },
       "data-source-name/4":{
          "id":"data-source-name/4",
          "title":"document_1",
          "children":[],
          "nodeType":"file"
       },
       "data-source-name/5":{
          "id":"data-source-name/5",
          "title":"document_2",
          "children":[],
          "nodeType":"file"
       }
    }
    """
