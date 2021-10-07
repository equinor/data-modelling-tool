Feature: Index

  Background: There are data sources in the system
    Given there are basic data sources with repositories
      |   name           |
      | data-source-name |
      | entities-DS     |

    Given data modelling tool blueprints are imported

    Given there are documents for the data source "data-source-name" in collection "documents"
      | _id                                  | parent_uid                           | name          | type                   |
      | e1a9243d-84df-4e9b-8438-013f8f2de24e |                                      | blueprints    | system/SIMOS/Package   |
      | ab11c047-0bb8-4e92-ae45-cc9c6473bf3a | e1a9243d-84df-4e9b-8438-013f8f2de24e | sub_package_1 | system/SIMOS/Package   |
      | 773cef3e-6854-4117-8548-b7edf13d179d | ab11c047-0bb8-4e92-ae45-cc9c6473bf3a | document_1    | system/SIMOS/Blueprint |

    Given there are documents for the data source "entities-DS" in collection "test"
      | _id                                  | parent_uid | name   | type                 |
      | aff2a29e-cd2f-4e80-8785-740667b5e99a |            | entity | system/SIMOS/Package |

  Scenario: Get index for single document (Root Package)
    Given I access the resource url "/api/v4/index/data-source-name/data-source-name/e1a9243d-84df-4e9b-8438-013f8f2de24e?APPLICATION=DMT"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
       "e1a9243d-84df-4e9b-8438-013f8f2de24e":{
          "parentId": "data-source-name",
          "title":"blueprints",
          "id":"e1a9243d-84df-4e9b-8438-013f8f2de24e",
          "nodeType":"system/SIMOS/Package",
          "children":["ab11c047-0bb8-4e92-ae45-cc9c6473bf3a"],
          "type":"system/SIMOS/Package"
       }
    }
    """

  Scenario: Get index for single Package (DMT-Entities)
    Given I access the resource url "/api/v4/index/data-source-name/e1a9243d-84df-4e9b-8438-013f8f2de24e/ab11c047-0bb8-4e92-ae45-cc9c6473bf3a?APPLICATION=DMT"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "ab11c047-0bb8-4e92-ae45-cc9c6473bf3a": {
        "id": "ab11c047-0bb8-4e92-ae45-cc9c6473bf3a",
        "children": [
          "773cef3e-6854-4117-8548-b7edf13d179d"
        ],
        "nodeType": "system/SIMOS/Package",
        "title": "sub_package_1",
        "type": "system/SIMOS/Package",
        "meta": {
          "menuItems": [
            {
              "label":"New",
              "menuItems":[
                {
                  "label":"Package",
                  "action":"CREATE"
                },
                {
                  "label":"Blueprint",
                  "action":"CREATE",
                  "data":{
                  "url":"/dmss/api/v1/explorer/data-source-name/ab11c047-0bb8-4e92-ae45-cc9c6473bf3a.content",
                  "nodeUrl":"/api/v4/index/data-source-name/ab11c047-0bb8-4e92-ae45-cc9c6473bf3a",
                  "request":{
                    "type":"system/SIMOS/Blueprint",
                    "name":"${name}",
                    "description":"${description}"
                    }
                  }
                }
            ]
          }]
        }
      }
    }
    """

  Scenario: Get index for single Package (Data Modelling)
    Given I access the resource url "/api/v4/index/data-source-name/e1a9243d-84df-4e9b-8438-013f8f2de24e/ab11c047-0bb8-4e92-ae45-cc9c6473bf3a?APPLICATION=DMT"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "ab11c047-0bb8-4e92-ae45-cc9c6473bf3a": {
        "id": "ab11c047-0bb8-4e92-ae45-cc9c6473bf3a",
        "children": [
          "773cef3e-6854-4117-8548-b7edf13d179d"
        ],
        "nodeType": "system/SIMOS/Package",
        "title": "sub_package_1",
        "type": "system/SIMOS/Package",
        "meta": {
          "menuItems": [
            {
              "label":"New",
              "menuItems":[
                {
                  "label":"Package",
                  "action":"CREATE"
                },
                {
                  "label":"Blueprint",
                  "action":"CREATE",
                  "data":{
                  "url":"/dmss/api/v1/explorer/data-source-name/ab11c047-0bb8-4e92-ae45-cc9c6473bf3a.content",
                  "nodeUrl":"/api/v4/index/data-source-name/ab11c047-0bb8-4e92-ae45-cc9c6473bf3a",
                  "request":{
                    "type":"system/SIMOS/Blueprint",
                    "name":"${name}",
                    "description":"${description}"
                    }
                  }
                }
            ]
          }]
        }
      }
    }
    """

  Scenario: Get index for single document (Data Modelling)
    Given I access the resource url "/api/v4/index/data-source-name/ab11c047-0bb8-4e92-ae45-cc9c6473bf3a/773cef3e-6854-4117-8548-b7edf13d179d?APPLICATION=DMT"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
       "773cef3e-6854-4117-8548-b7edf13d179d":{
          "parentId": "ab11c047-0bb8-4e92-ae45-cc9c6473bf3a",
          "title":"document_1",
          "id":"773cef3e-6854-4117-8548-b7edf13d179d",
          "nodeType":"document-node",
          "children":[],
          "type":"system/SIMOS/Blueprint"
       }
    }
    """

  Scenario: Get index for single document (Data Modelling)
    Given I access the resource url "/api/v4/index/entities-DS/entities-DS/aff2a29e-cd2f-4e80-8785-740667b5e99a?APPLICATION=DMT"
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
      "aff2a29e-cd2f-4e80-8785-740667b5e99a": {
        "id": "aff2a29e-cd2f-4e80-8785-740667b5e99a",
        "title": "entity",
        "type": "system/SIMOS/Package",
        "meta": {
          "menuItems": [
            {
              "label":"New",
              "menuItems":[
                {
                  "label":"Package",
                  "action":"CREATE"
                },
                {
                  "label":"Blueprint",
                  "action":"CREATE",
                  "data":{
                  "url":"/dmss/api/v1/explorer/entities-DS/aff2a29e-cd2f-4e80-8785-740667b5e99a.content",
                  "nodeUrl":"/api/v4/index/entities-DS/aff2a29e-cd2f-4e80-8785-740667b5e99a",
                  "request":{
                    "type":"system/SIMOS/Blueprint",
                    "name":"${name}",
                    "description":"${description}"
                    }
                  }
                }
            ]
          }]
        }
      }
    }
    """
