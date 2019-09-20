Feature: Document 2

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name                     | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | local-blueprints-equinor | maf      | documents  | blueprints   | mongo-db |

    Given there are package named "package_1" of "documents"
      | title     | description         | version |
      | package 1 | package description | 1.0.0   |

  Scenario: Get document
    Given I access the resource url "/api/documents/local-blueprints-equinor/package_1/1.0.0/package"
    And data modelling tool templates are imported
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "document" : {
        "id": "package_1/1.0.0/package",
        "meta": {
          "documentType": "file",
          "templateRef": "templates/package-template"
        },
        "formData": {
          "title": "package 1",
          "description": "package description"
        }
      },
      "template" : {
         "meta": {

        }
      }
    }
    """

  Scenario: Create document
    Given i access the resource url "/api/documents/local-blueprints-equinor/package_1/1.0.1/package"
    And data modelling tool templates are imported
    When i make a "POST" request
    """
    {
      "meta": {
        "templateRef": "templates/package-template"
      },
      "formData": {
        "title": "package 1",
        "description": "package description"
      }
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "document": {
        "meta": {

        },
        "formData": {
          "title": "package 1",
          "description": "package description"
        }
      },
      "template" : {
         "meta": {

        }
      }
    }
    """

    Scenario: Update document (form data only now)
    Given i access the resource url "/api/documents/local-blueprints-equinor/package_1/1.0.0/package"
    And data modelling tool templates are imported
    When i make a "PUT" request
    """
    {
      "title": "new package title",
      "description": "package description",
      "subpackages": [],
      "files": []
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "document": {
        "meta": {

        },
        "formData": {
          "title": "new package title",
          "description": "package description",
          "subpackages": [],
          "files": []
        }
      },
      "template" : {
         "meta": {

        }
      }
    }
    """
