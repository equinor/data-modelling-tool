Feature: Data Source

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name           | database | collection     | documentType | type     |
      | db   | 27017 | maf      | maf      | false | entities       | local    | documents      | entities     | mongo-db |
      | db   | 27017 | maf      | maf      | false | SSR-DataSource | local    | SSR-DataSource | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | system         | local    | system         | system       | mongo-db |
      | db   | 27017 | maf      | maf      | false | apps           | local    | applications   | applications | mongo-db |

  Scenario: Get data source blueprints
    Given I access the resource url "/api/v2/data-sources?documentType=blueprints"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    [
      {
        "host": "client",
        "name": "Local workspace"
      },
      {
        "host": "db",
        "name": "entities"
      },
      {
        "host": "db",
        "name": "SSR-DataSource"
      }
    ]
    """

  Scenario Outline: Create new data source
    Given i access the resource url "/api/v2/data-sources/myTest-DataSource"
    And data modelling tool templates are imported
    When i make a "POST" request
      """
       {
      "type": "mongo-db",
      "host": "database-server.equinor.com",
      "port": 27017,
      "username": "test",
      "password": "testpassword",
      "tls": false,
      "name": "myTest-DataSource",
      "database": "mariner",
      "collection": "blueprints",
      "documentType": "blueprints"
      }
    """
    Then the response status should be "<status>"
    #And the response should be
    #"""
    #"<name>"
    #"""
    Examples:
      | host     | name     | status |
      | new host | new name | OK     |
      | new host |          | OK     |

