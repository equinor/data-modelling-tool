Feature: Templates

  Scenario Outline: Get blueprint template
    Given I access the resource url "/api/templates/<template>"
    And init import is done
    When I make a "GET" request
    Then the response should contain
    """
    {
      "_id": "<template>"
    }
    """
    Examples:
      | template              |
      | blueprint.json        |
      | package.json          |
      | create-blueprint.json |
      | subpackage.json       |

