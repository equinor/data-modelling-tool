Feature: Class generation from schema

  Background: System data source exist

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name   | database | collection   | type     |
      | db   | 27017 | maf      | maf      | false | apps   | local    | applications | mongo-db |

  @skip
  Scenario: There, and back again
    Given data modelling tool templates are imported
    When I create a Python class from the template "system/SIMOS/Blueprint"
    Then it should be able to recreate the template
