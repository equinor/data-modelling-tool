@skip
Feature: Explorer

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | local-blueprints | maf      | documents  | blueprints   | mongo-db |

    Given there are documents in collection "documents"
      | uid | path                     | name          | description | type                   |
      | 1   | /                        | package_1     |             | templates/v2/package   |
      | 2   | /package_1               | sub_package_1 |             | templates/v2/package   |
      | 3   | /package_1               | sub_package_2 |             | templates/v2/package   |
      | 4   | /package_1/sub_package_1 | document_1    |             | templates/v2/blueprint |
      | 5   | /package_1/sub_package_1 | document_2    |             | templates/v2/blueprint |


  Scenario: Add file to root
    Given i access the resource url "/api/v2/explorer/local-blueprints/add-file"
    When i make a "POST" request
    """
    {
      "parentId": "1",
      "filename": "new_file",
      "templateRef": ""
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "filename": "new_file",
      "documentType": "file",
      "path": "/package_1"
    }
    """

  Scenario: Add file to subpackage
    Given i access the resource url "/api/v2/explorer/local-blueprints/add-file"
    When i make a "POST" request
    """
    {
      "parentId": "2",
      "filename": "new_file",
      "templateRef": ""
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "filename": "new_file",
      "documentType": "file",
      "path": "/package_1/sub_package_1"
    }
    """

  Scenario: Add file to parent that does not exists
    Given i access the resource url "/api/v2/explorer/local-blueprints/add-file"
    When i make a "POST" request
    """
    {
      "parentId": "10",
      "filename": "new_file",
      "templateRef": ""
    }
    """
    Then the response status should be "System Error"
    And the response should equal
    """
    {
      "type": "SYSTEM_ERROR",
      "message": "Exception: The parent, with id 10, was not found"
    }
    """

  Scenario: Add file with missing parameter = parent id
    Given i access the resource url "/api/v2/explorer/local-blueprints/add-file"
    When i make a "POST" request
    """
    {
      "filename": "new_file",
      "templateRef": ""
    }
    """
    Then the response status should be "Bad Request"
    And the response should equal
    """
    {
      "type": "PARAMETERS_ERROR",
      "message": "parentId: is missing"
    }
    """

  Scenario: Move file (renaming)
    Given i access the resource url "/api/v2/explorer/move-file"
    And data modelling tool templates are imported
    When i make a "POST" request
    """
    {
      "source": "local-blueprints/package_1/sub_package_1/document_1",
      "destination": "local-blueprints/package_1/sub_package_1/document_3"
    }
    """
    Then the response status should be "OK"
    Given I access the resource url "/api/v2/documents/local-blueprints/4"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "document" : {
        "uid": "4",
        "path": "/package_1/sub_package_1",
        "filename": "document_3",
        "type": "file",
        "formData": {

        }
      }
    }
    """

  Scenario: Remove file
    Given i access the resource url "/api/v2/explorer/local-blueprints/remove-file"
    When i make a "POST" request
    """
    {
      "filename": "package_1/sub_package_1/document_1"
    }
    """
    Then the response status should be "OK"
    Given I access the resource url "/api/v2/documents/local-blueprints/4"
    When I make a "GET" request
    Then the response status should be "System Error"
    And the response should equal
    """
    {
      "type": "SYSTEM_ERROR",
      "message": "EntityNotFoundException: 'The entity, with id 4 is not found'"
    }
    """

  Scenario: Add package to root
    Given i access the resource url "/api/v2/explorer/local-blueprints/add-package"
    When i make a "POST" request
    """
    {
      "parentId": "1",
      "filename": "new_folder",
      "templateRef": ""
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "filename": "new_folder",
      "documentType": "folder",
      "path": "/package_1"
    }
    """

  Scenario: Add package to subpackage
    Given i access the resource url "/api/v2/explorer/local-blueprints/add-package"
    When i make a "POST" request
    """
    {
      "parentId": "2",
      "filename": "new_folder",
      "templateRef": ""
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "filename": "new_folder",
      "documentType": "folder",
      "path": "/package_1/sub_package_1"
    }
    """

  Scenario: Add package to parent that does not exists
    Given i access the resource url "/api/v2/explorer/local-blueprints/add-package"
    When i make a "POST" request
    """
    {
      "parentId": "10",
      "filename": "new_folder",
      "templateRef": ""
    }
    """
    Then the response status should be "System Error"
    And the response should equal
    """
    {
      "type": "SYSTEM_ERROR",
      "message": "Exception: The parent, with id 10, was not found"
    }
    """

  Scenario: Add package with missing parameter = parent id
    Given i access the resource url "/api/v2/explorer/local-blueprints/add-package"
    When i make a "POST" request
    """
    {
      "filename": "new_folder",
      "templateRef": ""
    }
    """
    Then the response status should be "Bad Request"
    And the response should equal
    """
    {
      "type": "PARAMETERS_ERROR",
      "message": "parentId: is missing"
    }
    """

  Scenario: Remove package
    Given i access the resource url "/api/v2/explorer/local-blueprints/remove-package"
    When i make a "POST" request
    """
    {
      "filename": "package_1/sub_package_1"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "removedChildren": ["4", "5"]
    }
    """
    Given I access the resource url "/api/v2/documents/local-blueprints/2"
    When I make a "GET" request
    Then the response status should be "System Error"
    And the response should equal
    """
    {
      "type": "SYSTEM_ERROR",
      "message": "EntityNotFoundException: 'The entity, with id 2 is not found'"
    }
    """

  Scenario: Move package (rename)
    Given i access the resource url "/api/v2/explorer/move-package"
    And data modelling tool templates are imported
    When i make a "POST" request
    """
    {
      "source": "local-blueprints/package_1/sub_package_1",
      "destination": "local-blueprints/package_1/sub_package_3"
    }
    """
    Then the response status should be "OK"
    Given I access the resource url "/api/v2/documents/local-blueprints/2"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "document" : {
        "uid": "2",
        "path": "/package_1",
        "filename": "sub_package_3",
        "type": "folder",
        "formData": {

        }
      }
    }
   """

  Scenario: Add root package
    Given i access the resource url "/api/v2/explorer/local-blueprints/add-root-package"
    When i make a "POST" request
    """
    {
      "filename": "new_root",
      "templateRef": ""
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "filename": "new_root",
      "documentType": "folder",
      "path": "/"
    }
    """

  Scenario: Add root package with missing filename should fail
    Given i access the resource url "/api/v2/explorer/local-blueprints/add-root-package"
    When i make a "POST" request
    """
    {
      "templateRef": "templates/package-template"
    }
    """
    Then the response status should be "Bad Request"
    And the response should equal
    """
    {
      "type": "PARAMETERS_ERROR",
      "message": "filename: is missing"
    }
    """

  Scenario: Remove root package
    Given i access the resource url "/api/v2/explorer/local-blueprints/remove-root-package"
    When i make a "POST" request
    """
    {
      "filename": "package_1"
    }
    """
    Then the response status should be "OK"
    Given I access the resource url "/api/v2/documents/local-blueprints/1"
    When I make a "GET" request
    Then the response status should be "System Error"
    And the response should equal
    """
    {
      "type": "SYSTEM_ERROR",
      "message": "EntityNotFoundException: 'The entity, with id 1 is not found'"
    }
    """

  Scenario: Move root package
    Given i access the resource url "/api/v2/explorer/move-root-package"
    When i make a "POST" request
    """
    {
       "source": "local-blueprints/package_1",
       "destination": "local-blueprints/package_2"
    }
    """
    Then the response status should be "OK"
