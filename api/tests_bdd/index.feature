Feature: Index

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name                     | database | collection | documentType |
      | db   | 27017 | maf      | maf      | false | local-blueprints-equinor | maf      | documents  | blueprints   |

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
       "package_1":{
          "title":"package 1",
          "description":"package description",
          "latestVersion":"package_1/1.0.0/package.json",
          "versions":[
             "package_1/1.0.0/package.json"
          ],
          "children":[

          ],
          "nodeType":"folder",
          "isRoot":true,
          "id":"package_1"
       },
       "package_1/1.0.0/package.json":{
          "title":"package 1",
          "description":"package description",
          "documentType":"version",
          "subpackages":[

          ],
          "files":[

          ],
          "id":"package_1/1.0.0/package.json"
       }
    }
    """
