Feature: Explorer

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | local-blueprints | maf      | documents  | blueprints   | mongo-db |

    Given there are root packages in collection "documents"
      | filename  | version |
      | package_1 | 1.0.0   |

    Given there are sub packages in collection "documents"
      | parent_id               | filename      |
      | package_1/1.0.0/package | sub_package_1 |
      | package_1/1.0.0/package | sub_package_2 |

    Given there are documents in collection "documents"
      | parent_id                             | filename   |
      | package_1/1.0.0/sub_package_1/package | document_1 |
      | package_1/1.0.0/sub_package_1/package | document_2 |


  Scenario: Add file
    Given i access the resource url "/api/explorer/local-blueprints/add-file"
    When i make a "POST" request
    """
    {
      "parentId": "package_1/1.0.0/package",
      "filename": "new_file",
      "templateRef": ""
    }
    """
    Then the response status should be "OK"
    And the response should equal
    """
    {
      "id": "package_1/1.0.0/new_file",
      "filename": "new_file",
      "documentType": "file"
    }
    """

  Scenario: Add file to parent that does not exists
    Given i access the resource url "/api/explorer/local-blueprints/add-file"
    When i make a "POST" request
    """
    {
      "parentId": "package_1/3.3.3/package",
      "filename": "new_file",
      "templateRef": ""
    }
    """
    Then the response status should be "System Error"
    And the response should equal
    """
    {
      "type": "SYSTEM_ERROR",
      "message": "Exception: The parent, with id package_1/3.3.3/package, was not found"
    }
    """

  Scenario: Add file with missing parameter = parent id
    Given i access the resource url "/api/explorer/local-blueprints/add-file"
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

  Scenario: Move file
    Given i access the resource url "/api/v2/explorer/move-file"
    When i make a "POST" request
    """
    {
      "source": "local-blueprints/package_1/1.0.0/sub_package_1/document_1",
      "destination": "local-blueprints/package_1/1.0.0/sub_package_1/document_3"
    }
    """
    Then the response status should be "OK"

  Scenario: Remove file
    Given i access the resource url "/api/v2/explorer/local-blueprints/remove-file"
    When i make a "POST" request
    """
    {
      "parentId": "package_1/1.0.0/sub_package_1/package",
      "filename": "package_1/1.0.0/sub_package_1/document_1"
    }
    """
    Then the response status should be "OK"


  Scenario: Add package
    Given i access the resource url "/api/explorer/local-blueprints/add-package"
    When i make a "POST" request
    """
    {
      "parentId": "package_1/1.0.0/package",
      "filename": "new_package",
      "templateRef": ""
    }
    """
    Then the response status should be "OK"
    And the response should equal
    """
    {
      "id": "package_1/1.0.0/new_package/package",
      "filename": "new_package",
      "documentType": "subpackage"
    }
    """

  Scenario: Add package to parent that does not exists
    Given i access the resource url "/api/explorer/local-blueprints/add-package"
    When i make a "POST" request
    """
    {
      "parentId": "package_1/3.3.3/package",
      "filename": "new_file",
      "templateRef": ""
    }
    """
    Then the response status should be "System Error"
    And the response should equal
    """
    {
      "type": "SYSTEM_ERROR",
      "message": "Exception: The parent, with id package_1/3.3.3/package, was not found"
    }
    """

  Scenario: Add package with missing parameter = parent id
    Given i access the resource url "/api/explorer/local-blueprints/add-package"
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

  Scenario: Remove package
    Given i access the resource url "/api/v2/explorer/local-blueprints/remove-package"
    When i make a "POST" request
    """
    {
      "parentId": "package_1/1.0.0/package",
      "filename": "package_1/1.0.0/sub_package_1/package"
    }
    """
    Then the response status should be "OK"
    Given I access the resource url "/api/data-sources/local-blueprints-equinor/package_1/1.0.0/sub_package_1/document_1"
    When I make a "GET" request
    Then the response status should be "Not Found"

  Scenario: Add root package
    Given i access the resource url "/api/explorer/local-blueprints/add-root-package"
    When i make a "POST" request
    """
    {
      "filename": "new_root_package",
      "templateRef": "templates/package-template"
    }
    """
    Then the response status should be "OK"
    And the response should equal
    """
    {
      "id": "new_root_package/1.0.0/package",
      "filename": "new_root_package",
      "documentType": "version"
    }
    """

  Scenario: Add root package with missing filename should fail
    Given i access the resource url "/api/explorer/local-blueprints/add-root-package"
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
