Feature: Index

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name | maf      | documents  | blueprints   | mongo-db |

    Given there are documents for the data source "data-source-name" in collection "documents"
      | uid | parent_uid | name          | description | type                      |
      | 1   |            | blueprints    |             | templates/DMT/Package     |
      | 2   | 1          | sub_package_1 |             | templates/DMT/Package     |
      | 3   | 2          | document_1    |             | templates/SIMOS/Blueprint |

   Scenario: Get index
    Given I access the resource url "/api/v3/index/data-source-name"
    And data modelling tool templates are imported
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {

    }
    """
