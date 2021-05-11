Feature: Document service - ????

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection     |   type     |
      | db   | 27017 | maf      | maf      | false | data-source-name | local    | documents      |  mongo-db |
      | db   | 27017 | maf      | maf      | false | SSR-DataSource   | local    | SSR-DataSource |  mongo-db |
      | db   | 27017 | maf      | maf      | false | apps             | local    | applications   |  mongo-db |

    Given data modelling tool blueprints are imported

    Given there are documents for the data source "data-source-name" in collection "documents"
      | uid | parent_uid | name          | description | type                   |
      | 1   |            | blueprints    |             | system/SIMOS/Package   |
      | 2   | 1          | sub_package_1 |             | system/SIMOS/Package   |
      | 3   | 2          | document_1    |             | system/SIMOS/Blueprint |


    Given there exist document with id "4" in data source "data-source-name"
    """
    {
        "_id": "4",
        "name": "TurbinePackage",
        "description": "",
        "type": "system/SIMOS/Package",
        "content": [
            {
                "_id": "5",
                "name": "WindTurbine",
                "type": "system/SIMOS/Blueprint"
            },
            {
                "_id": "6",
                "name": "MyWindTurbine",
                "type": "data-source-name/TurbinePackage/WindTurbine"
            },
            {
                "_id": "7",
                "name": "Mooring",
                "type": "system/SIMOS/Blueprint"
            }
        ],
        "isRoot": true
    }
    """
    # This is a blueprint which has an optional, not contained complex attribute
    Given there exist document with id "5" in data source "data-source-name"
    """
    {
      "_id": "5",
      "name":"WindTurbine",
      "type":"system/SIMOS/Blueprint",
      "extends":["system/SIMOS/NamedEntity"],
      "description":"",
      "attributes":[
        {
          "name":"Mooring",
          "type":"system/SIMOS/BlueprintAttribute",
          "attributeType":"data-source-name/TurbinePackage/Mooring",
          "optional":true,
          "contained":false
        }
      ]
    }
    """
    Given there exist document with id "7" in data source "data-source-name"
    """
    {
      "_id": "7",
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
    Given there exist document with id "6" in data source "data-source-name"
    """
    {
      "_id": "6",
      "name":"MyWindTurbine",
      "type":"data-source-name/TurbinePackage/WindTurbine",
      "description":"",
      "Mooring": {}
    }
    """

  Scenario: export package
    Given i create a document service
    And i export document with id "4" in data source "data-source-name"
