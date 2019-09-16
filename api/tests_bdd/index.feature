Feature: Index

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name                     | database | collection | documentType | type   |
      | db   | 27017 | maf      | maf      | false | local-blueprints-equinor | maf      | documents  | blueprints   |mongo-db|

    Given there are package named "package_1" of "documents"
      | title     | description         | version |
      | package 1 | package description | 1.0.0   |

  Scenario: Get index
    Given I access the resource url "/api/index/local-blueprints-equinor"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should equal
    """
    {
       "local-blueprints-equinor/package_1/1.0.0/package":{
          "title":"package 1",
          "children":[],
          "nodeType":"folder",
          "isRoot":true,
          "id":"local-blueprints-equinor/package_1/1.0.0/package"
       }
    }
    """
