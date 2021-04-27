Feature: Document - Generate JSON Schema

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection     |   type     |
      | db   | 27017 | maf      | maf      | False | data-source-name | local    | documents      |  mongo-db |
      | db   | 27017 | maf      | maf      | False | SSR-DataSource   | local    | SSR-DataSource |  mongo-db |
      | db   | 27017 | maf      | maf      | False | apps             | local    | applications   |  mongo-db |

  Scenario: Generate Blueprint
    Given i access the resource url "/api/v2/json-schema/system/SIMOS/Blueprint"
    And data modelling tool blueprints are imported
    When i make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
        "schema": {},
        "uiSchema": {}
    }
    """

  Scenario: Generate Application
    Given i access the resource url "/api/v2/json-schema/system/SIMOS/Application"
    And data modelling tool blueprints are imported
    When i make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
    "schema": {
      "properties": {
        "description": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "type": {
          "default": "",
          "type": "string"
        }
      },
      "type": "object"
    },
    "uiSchema": {}
    }
    """
