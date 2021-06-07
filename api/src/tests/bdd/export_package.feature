Feature: Exporting root packages

    Background: There are data sources in the system
    Given there are basic data sources with repositories
      |   name  |
      | test-DS |

    Given data modelling tool blueprints are imported

    Given there are documents for the data source "test-DS" in collection "test-DS"
      | uid                                  | parent_uid                           | name          | type                   |
      | 67bb4044-5d88-4d72-9a02-6dda63ded6e7 |                                      | blueprints    | system/SIMOS/Package   |
      | 9e8480d5-c74b-4dd1-b43e-ce486a460658 | 67bb4044-5d88-4d72-9a02-6dda63ded6e7 | sub_package_1 | system/SIMOS/Package   |
      | e1a9243d-84df-4e9b-8438-013f8f2de24e | 9e8480d5-c74b-4dd1-b43e-ce486a460658 | document_1    | system/SIMOS/Blueprint |


  Scenario: A user want's to export a root package
    Given I access the resource url "/api/v2/explorer/test-DS/export/67bb4044-5d88-4d72-9a02-6dda63ded6e7"
    When I make a "GET" request
    Then the response status should be "OK"
    And response node should not be empty

