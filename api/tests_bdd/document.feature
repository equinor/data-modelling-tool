@skip
Feature: Document 2

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name                     | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | local-blueprints-equinor | maf      | documents  | blueprints   | mongo-db |

    Given there are documents in collection "documents"
      | uid | path                     | name          | description | type                   |
      | 1   | /                        | package_1     |             | templates/v2/package   |
      | 2   | /package_1               | sub_package_1 |             | templates/v2/package   |
      | 3   | /package_1               | sub_package_2 |             | templates/v2/package   |
      | 4   | /package_1/sub_package_1 | document_1    |             | templates/v2/blueprint |
      | 5   | /package_1/sub_package_1 | document_2    |             | templates/v2/blueprint |



  Scenario: Get document
    Given I access the resource url "/api/v2/documents/local-blueprints-equinor/1"
    And data modelling tool templates are imported
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "document" : {
        "uid": "1",
        "path": "/",
        "filename": "package_1",
        "type": "folder",
        "formData": {

        }
      },
      "template" : {
         "meta": {

        }
      }
    }
    """

  Scenario: Create document
    Given i access the resource url "/api/v2/documents/local-blueprints-equinor"
    And data modelling tool templates are imported
    When i make a "POST" request
    """
    {
      "uid": "2",
      "path": "/",
      "filename": "new_folder",
      "type": "folder",
      "templateRef": "templates/package-template",
      "formData": {

      }
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "document": {
        "uid": "2",
        "path": "/",
        "filename": "new_folder",
        "type": "folder",
        "templateRef": "templates/package-template",
         "formData": {

         }
      },
      "template" : {
         "meta": {

        }
      }
    }
    """

    Scenario: Update document (form data only now)
    Given i access the resource url "/api/v2/documents/local-blueprints-equinor/1"
    And data modelling tool templates are imported
    When i make a "PUT" request
    """
    {
      "description": "package description"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "document": {
        "uid": "1",
        "path": "/",
        "filename": "package_1",
        "type": "folder",
        "formData": {
          "description": "package description"
        }
      },
      "template" : {
         "meta": {

        }
      }
    }
    """
