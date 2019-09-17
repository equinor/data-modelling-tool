Feature: Templates

  Scenario Outline: Get blueprint template
    Given I access the resource url "/api/templates/<template>"
    And data modelling tool templates are imported
    When I make a "GET" request
    Then the response should contain
    """
    {
      "_id": "<template>"
    }
    """
    Examples:
      | template           |
      | blueprint          |
      | package-template   |
      | create-blueprint   |
      | subpackage-template|

