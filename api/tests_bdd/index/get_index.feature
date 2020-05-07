Feature: Index

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection     | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name | local      | documents      | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | SSR-DataSource   | local      | SSR-DataSource | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | system           | local      | system         | blueprints   | mongo-db |

    Given data modelling tool templates are imported

    Given there are documents for the data source "data-source-name" in collection "documents"
      | uid | parent_uid | name          | description | type                   |
      | 1   |            | blueprints    |             | system/SIMOS/Package     |
      | 2   | 1          | sub_package_1 |             | system/SIMOS/Package     |
      | 3   | 2          | document_1    |             | system/SIMOS/Blueprint |

  Scenario: Get index
    Given I access the resource url "/api/v4/index/data-source-name"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
       "data-source-name":{
          "id":"data-source-name",
          "title":"data-source-name",
          "nodeType":"document-node",
          "children":[
             "1"
          ]
       }
    }
    """
