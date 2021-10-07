Feature: Index

  Background: There are data sources in the system

    Given there are basic data sources with repositories
      |   name  |
      | test-DS |
    Given data modelling tool blueprints are imported
    Given there are documents for the data source "test-DS" in collection "documents"
      | _id                                    | parent_uid                           | name          | type                   |
      | 3eea0e71-647d-43b2-975b-0280ca3588d2   |                                      | blueprints    | system/SIMOS/Package   |
      | 1a39b2d1-272c-46d4-9a89-f5e0018a71b4   | 3eea0e71-647d-43b2-975b-0280ca3588d2 | sub_package_1 | system/SIMOS/Package   |
      | 226ee77b-a1a0-4e80-9d25-fe333732e476   | 1a39b2d1-272c-46d4-9a89-f5e0018a71b4 | document_1    | system/SIMOS/Blueprint |

    Given there exist document with id "0f99b692-b980-41d2-bfab-50c4bffe5a6e" in data source "test-DS"
    """
    {
        "_id": "0f99b692-b980-41d2-bfab-50c4bffe5a6e",
        "name": "TurbinePackage",
        "description": "",
        "type": "system/SIMOS/Package",
        "content": [
            {
                "_id": "7def3293-048e-4258-91a2-a7b6dda8a04f",
                "name": "WindTurbine",
                "type": "system/SIMOS/Blueprint"
            },
            {
                "_id": "d047f040-316e-4113-a97c-d9a87909cd0c",
                "name": "MyWindTurbine",
                "type": "test-DS/TurbinePackage/WindTurbine"
            },
            {
                "_id": "837c1c7e-e774-4db9-b9d2-37c231bea54c",
                "name": "Mooring",
                "type": "system/SIMOS/Blueprint"
            }
        ],
        "isRoot": true
    }
    """
    # This is a blueprint which has an optional, not contained complex attribute
    Given there exist document with id "7def3293-048e-4258-91a2-a7b6dda8a04f" in data source "test-DS"
    """
    {
      "_id": "7def3293-048e-4258-91a2-a7b6dda8a04f",
      "name":"WindTurbine",
      "type":"system/SIMOS/Blueprint",
      "extends":["system/SIMOS/NamedEntity"],
      "description":"",
      "attributes":[
        {
          "name":"Mooring",
          "type":"system/SIMOS/BlueprintAttribute",
          "attributeType":"test-DS/TurbinePackage/Mooring",
          "optional":true,
          "contained":false
        }
      ]
    }
    """
    Given there exist document with id "837c1c7e-e774-4db9-b9d2-37c231bea54c" in data source "test-DS"
    """
    {
      "_id": "837c1c7e-e774-4db9-b9d2-37c231bea54c",
      "name":"Mooring",
      "type":"system/SIMOS/Blueprint",
      "extends":["system/SIMOS/NamedEntity"],
      "description":"",
      "attributes":[
        {
          "name":"size",
          "type":"system/SIMOS/BlueprintAttribute",
          "attributeType":"string"
        }
      ]
    }
    """
    Given there exist document with id "d047f040-316e-4113-a97c-d9a87909cd0c" in data source "test-DS"
    """
    {
      "_id": "d047f040-316e-4113-a97c-d9a87909cd0c",
      "name":"MyWindTurbine",
      "type":"test-DS/TurbinePackage/WindTurbine",
      "description":"",
      "Mooring": {}
    }
    """

  Scenario: Get index
    Given I access the resource url "/api/v4/index/test-DS?APPLICATION=DMT"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
       "test-DS":{
          "id":"test-DS",
          "title":"test-DS",
          "nodeType":"document-node",
          "children":[
             "3eea0e71-647d-43b2-975b-0280ca3588d2"
          ]
       }
    }
    """

  Scenario: Index with insert reference
    Given I access the resource url "/api/v4/index/test-DS/0f99b692-b980-41d2-bfab-50c4bffe5a6e/d047f040-316e-4113-a97c-d9a87909cd0c?APPLICATION=DMT"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "d047f040-316e-4113-a97c-d9a87909cd0c": {
        "parentId": "0f99b692-b980-41d2-bfab-50c4bffe5a6e",
        "title": "MyWindTurbine",
        "id": "d047f040-316e-4113-a97c-d9a87909cd0c",
        "children": [],
        "type": "test-DS/TurbinePackage/WindTurbine",
        "meta": {
          "menuItems": [
            {
              "label": "New reference",
              "menuItems": [
                {
                  "label": "Mooring",
                  "action": "INSERT_REFERENCE",
                  "data": "Mooring"
                }
              ]
            }
          ]
        }
      }
    }
    """