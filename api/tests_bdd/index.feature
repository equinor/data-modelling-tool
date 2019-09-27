Feature: Index

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name | maf      | documents  | blueprints   | mongo-db |

    Given there are documents for the data source "data-source-name" in collection "documents"
      | uid | parent_uid | name          | description | type                   |
      | 1   |            | blueprints    |             | templates/v2/package   |
      | 2   | 1          | sub_package_1 |             | templates/v2/package   |
      | 3   | 2          | document_1    |             | templates/v2/blueprint |

    @skip
   Scenario: Get index
    Given I access the resource url "/api/v3/index/data-source-name"
    And data modelling tool templates are imported
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should equal
    """
    {
       "data-source-name":{
          "id":"data-source-name",
          "title":"data-source-name",
          "nodeType":"datasource",
          "children":[
             "data-source-name/1"
          ]
       },
       "data-source-name/1":{
          "filename":"blueprints",
          "title":"blueprints",
          "id":"data-source-name/1",
          "nodeType":"subpackage",
          "children":[
             "data-source-name/1_blueprints",
             "data-source-name/1_packages"
          ]
       },
       "data-source-name/1_blueprints":{
          "filename":"blueprints",
          "title":"blueprints",
          "id":"data-source-name/1_blueprints",
          "nodeType":"document-ref-array",
          "templateRef":"templates/blueprint",
          "children":[

          ]
       },
       "data-source-name/1_packages":{
          "filename":"packages",
          "title":"packages",
          "id":"data-source-name/1_packages",
          "nodeType":"document-ref-array",
          "templateRef":"templates/package",
          "children":[
             "data-source-name/2"
          ]
       },
       "data-source-name/2":{
          "filename":"sub_package_1",
          "title":"sub_package_1",
          "id":"data-source-name/2",
          "nodeType":"file",
          "children":[
             "data-source-name/2_blueprints",
             "data-source-name/2_packages"
          ]
       },
       "data-source-name/2_blueprints":{
          "filename":"blueprints",
          "title":"blueprints",
          "id":"data-source-name/2_blueprints",
          "nodeType":"document-ref-array",
          "templateRef":"templates/blueprint",
          "children":[
             "data-source-name/3"
          ]
       },
       "data-source-name/3":{
          "filename":"document_1",
          "title":"document_1",
          "id":"data-source-name/3",
          "nodeType":"file",
          "children":[
             "data-source-name/3_attributes",
             "data-source-name/3_storage_recipes",
             "data-source-name/3_ui_recipes"
          ]
       },
       "data-source-name/3_attributes":{
          "filename":"attributes",
          "title":"attributes",
          "id":"data-source-name/3_attributes",
          "nodeType":"document-ref-array",
          "templateRef":"templates/blueprint_attribute",
          "children":[

          ]
       },
       "data-source-name/3_storage_recipes":{
          "filename":"storage_recipes",
          "title":"storage_recipes",
          "id":"data-source-name/3_storage_recipes",
          "nodeType":"document-ref-array",
          "templateRef":"templates/storage",
          "children":[

          ]
       },
       "data-source-name/3_ui_recipes":{
          "filename":"ui_recipes",
          "title":"ui_recipes",
          "id":"data-source-name/3_ui_recipes",
          "nodeType":"document-ref-array",
          "templateRef":"templates/ui",
          "children":[

          ]
       },
       "data-source-name/2_packages":{
          "filename":"packages",
          "title":"packages",
          "id":"data-source-name/2_packages",
          "nodeType":"document-ref-array",
          "templateRef":"templates/package",
          "children":[

          ]
       }
    }
    """
