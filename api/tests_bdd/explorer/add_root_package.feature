Feature: Explorer - Add Root Package

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name            | database | collection     | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name| maf      | documents      | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | SSR-DataSource  | dmt      | SSR-DataSource | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | system          | dmt      | system         | blueprints   | mongo-db |

  Scenario: Add root package
    Given i access the resource url "/api/v2/explorer/data-source-name/add-root-package"
    And data modelling tool templates are imported
    When i make a "POST" request
    """
    {
      "name": "new_root_package"
    }
    """
    Then the response status should be "OK"
    And the response should contain
    """
    {
        "data":{
           "name":"new_root_package",
           "description":null,
           "type":"system/DMT/Package",
           "documents":[],
           "dependencies":[],
           "packages":[],
           "isRoot":true,
           "storageRecipes":[]
        }
    }
    """

  Scenario: Add root package with missing parameter name should fail
    Given i access the resource url "/api/v2/explorer/data-source-name/add-root-package"
    And data modelling tool templates are imported
    When i make a "POST" request
    """
    {
    }
    """
    Then the response status should be "Bad Request"
    And the response should equal
    """
    {
      "type": "PARAMETERS_ERROR",
      "message": "name: is missing"
    }
    """
