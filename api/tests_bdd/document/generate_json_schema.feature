Feature: Document - Generate JSON Schema

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name | maf      | documents  | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | templates        | dmt      | templates  | blueprints   | mongo-db |

  Scenario: Generate Blueprint
    Given i access the resource url "/api/v2/json-schema/templates/SIMOS/Blueprint"
    And data modelling tool templates are imported
    When i make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
        "schema": {},
        "uiSchema": {}
    }
    """
