Feature: Explorer - Remove file

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name            | database | collection     | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name| maf      | documents      | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | SSR-DataSource  | dmt      | SSR-DataSource | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | system          | dmt      | system         | blueprints   | mongo-db |

    Given there are documents for the data source "data-source-name" in collection "documents"
      | uid | parent_uid | name          | description | type                      |
      | 1   |            | blueprints    |             | system/DMT/Package     |
      | 2   | 1          | sub_package_1 |             | system/DMT/Package     |
      | 3   | 2          | document_1    |             | system/SIMOS/Blueprint |

  Scenario: Remove root package
    Given i access the resource url "/api/v2/explorer/data-source-name/remove-file"
    And data modelling tool templates are imported
    When i make a "POST" request
  """
  {
    "documentId": "1",
    "parentId": null,
    "attribute": null
  }
  """
    Then the response status should be "OK"
    Given I access the resource url "/api/v2/documents/data-source-name/1"
    When I make a "GET" request
    Then the response status should be "System Error"
    And the response should equal
  """
  {
    "type": "SYSTEM_ERROR",
    "message": "EntityNotFoundException: 'The entity, with id 1 is not found'"
  }
  """
    Given I access the resource url "/api/v2/documents/data-source-name/2"
    When I make a "GET" request
    Then the response status should be "System Error"
    And the response should equal
  """
  {
    "type": "SYSTEM_ERROR",
    "message": "EntityNotFoundException: 'The entity, with id 2 is not found'"
  }
  """
    Given I access the resource url "/api/v2/documents/data-source-name/3"
    When I make a "GET" request
    Then the response status should be "System Error"
    And the response should equal
  """
  {
    "type": "SYSTEM_ERROR",
    "message": "EntityNotFoundException: 'The entity, with id 3 is not found'"
  }
  """

  Scenario: Remove file with no children
    Given i access the resource url "/api/v2/explorer/data-source-name/remove-file"
    And data modelling tool templates are imported
    When i make a "POST" request
    """
    {
      "parentId": "2",
      "documentId": "3",
      "attribute": "content"
    }
    """
    Then the response status should be "OK"
    Given I access the resource url "/api/v2/documents/data-source-name/3"
    When I make a "GET" request
    Then the response status should be "System Error"
    And the response should equal
    """
    {
      "type": "SYSTEM_ERROR",
      "message": "EntityNotFoundException: 'The entity, with id 3 is not found'"
    }
    """

  Scenario: Remove file with children
    Given i access the resource url "/api/v2/explorer/data-source-name/remove-file"
    And data modelling tool templates are imported
    When i make a "POST" request
  """
  {
    "parentId": "1",
    "documentId": "2",
    "attribute": "content"
  }
  """
    Then the response status should be "OK"
    Given I access the resource url "/api/v2/documents/data-source-name/2"
    When I make a "GET" request
    Then the response status should be "System Error"
    And the response should equal
  """
  {
    "type": "SYSTEM_ERROR",
    "message": "EntityNotFoundException: 'The entity, with id 2 is not found'"
  }
  """
    Given I access the resource url "/api/v2/documents/data-source-name/3"
    When I make a "GET" request
    Then the response status should be "System Error"
    And the response should equal
  """
  {
    "type": "SYSTEM_ERROR",
    "message": "EntityNotFoundException: 'The entity, with id 3 is not found'"
  }
  """

