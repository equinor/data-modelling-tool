Feature: Document

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name                     | database | collection | documentType |
      | db   | 27017 | maf      | maf      | false | local-blueprints-equinor | maf      | documents  | blueprints   |

    Given there are package named "package_1" of "documents"
      | title     | description         | version |
      | package 1 | package description | 1.0.0   |

  Scenario: Get document
    Given I access the resource url "/api/data-sources/local-blueprints-equinor/package_1/1.0.0/package.json"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should equal
    """
    {
      "_id": "package_1/1.0.0/package.json",
      "title": "package 1",
      "description": "package description",
      "documentType": "version",
      "subpackages": [],
      "files": []
    }
    """

  Scenario: Create document
    Given i access the resource url "/api/data-sources/local-blueprints-equinor/package_1/1.0.1/package.json"
    When i make a "POST" request
    """
    {
      "_id": "package_1/1.0.1/package.json",
      "title": "package 1",
      "description": "package description",
      "documentType": "version",
      "subpackages": [],
      "files": []
    }
    """
    Then the response status should be "OK"
    And the response should be
    """
    package_1/1.0.1/package.json
    """

  Scenario: Update document
    Given i access the resource url "/api/data-sources/local-blueprints-equinor/package_1/1.0.0/package.json"
    When i make a "PUT" request
    """
    {
      "_id": "package_1/1.0.0/package.json",
      "title": "new package title",
      "description": "package description",
      "documentType": "version",
      "subpackages": [],
      "files": []
    }
    """
    Then the response status should be "OK"


