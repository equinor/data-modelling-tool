Feature: Explorer

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | local-blueprints | maf      | documents  | blueprints   | mongo-db |

    Given there are package named "package_1" of "documents"
      | title     | description         | version |
      | package 1 | package description | 1.0.0   |

  Scenario: Add file
    Given i access the resource url "/api/explorer/local-blueprints/add-file"
    When i make a "POST" request
    """
    {
      "parentId": "package_1/1.0.0/package",
      "document": {
        "meta": {
           "name": "new file",
           "templateRef": "",
           "documentType": "file"
        },
        "formData": {

        }
      }
    }
    """
    Then the response status should be "OK"
    And the response should equal
    """
    {
      "id": "package_1/1.0.0/new file",
      "formData":{

      },
      "meta":{
        "name":"new file",
        "templateRef":"",
        "documentType": "file"
      }
    }
    """

  Scenario: Add package
    Given i access the resource url "/api/explorer/local-blueprints/add-package"
    When i make a "POST" request
    """
    {
      "parentId": "package_1/1.0.0/package",
      "document": {
        "meta": {
           "name": "new package",
           "templateRef": "",
           "documentType": "subpackage"
        },
        "formData": {

        }
      }
    }
    """
    Then the response status should be "OK"
    And the response should equal
    """
    {
      "id": "package_1/1.0.0/new package/package",
      "formData":{
        "title": null,
        "description": null,
        "subpackages": [],
        "files": []
      },
      "meta":{
        "name":"new package",
        "templateRef":"",
        "documentType": "subpackage"
      }
    }
    """
