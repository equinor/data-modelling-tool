Feature: Class generation from schema

  Scenario: There, and back again
    Given data modelling tool templates are imported
    When I create a Python class from the template "system/SIMOS/Blueprint"
    Then it should be able to recreate the template
