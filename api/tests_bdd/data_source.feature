Feature: Data Source

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host     | port | username | password | tls  | name           | database   | collection | documentType | type    |
      | hostname | 1234 | user     | secret   | true | equinor-models | database_1 | blueprints | blueprints   | mongo-db|

  Scenario: Get data source blueprints
    Given I access the resource url "/api/data-sources?documentType=blueprints"
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
        "host": "hostname",
        "name": "equinor-models"
      }
    ]
    """

  Scenario Outline: Create new data source
    Given i access the resource url "/api/data-sources/myTest-DataSource"
    And data modelling tool templates are imported
    When i make a "POST" request
      """
       {
      "type": "mongodb",
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


  Scenario: Update data source
    Given i access the resource url "/api/data-sources/equinor-models"
    And data modelling tool templates are imported
    When i make a "PUT" request
      """
        {
          "type": "mongodb",
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
    Then the response should be
    """
    True
    """

  Scenario: Delete data source
    Given i access the resource url "/api/data-sources/equinor-models"
    When i make a "DELETE" request
    Given I access the resource url "/api/data-sources?documentType=blueprints"
    When I make a "GET" request
    Then the response should contain
    """
    []
    """

