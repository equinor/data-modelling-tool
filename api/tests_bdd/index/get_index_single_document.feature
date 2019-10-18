Feature: Index

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name | maf      | documents  | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | templates        | dmt      | templates  | blueprints   | mongo-db |

    Given there are documents for the data source "data-source-name" in collection "documents"
      | uid | parent_uid | name          | description | type                   |
      | 1   |            | blueprints    |             | templates/DMT/Package   |
      | 2   | 1          | sub_package_1 |             | templates/DMT/Package   |
      | 3   | 2          | document_1    |             | templates/SIMOS/Blueprint |


   Scenario: Get index
    Given I access the resource url "/api/v3/index/data-source-name/3"
    And data modelling tool templates are imported
    When I make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
       "data-source-name/document_1/3":{
          "parentId":"data-source-name",
          "filename":"document_1",
          "title":"document_1",
          "id":"data-source-name/document_1/3",
          "nodeType":"document-node",
          "children":[
             "data-source-name/document_1/storageRecipes/3",
             "data-source-name/document_1/uiRecipes/3"
          ],
          "type":"templates/SIMOS/Blueprint"
       },
       "data-source-name/document_1/storageRecipes/3":{
          "parentId":"data-source-name/document_1/3",
          "filename":"storageRecipes",
          "title":"storageRecipes",
          "id":"data-source-name/document_1/storageRecipes/3",
          "nodeType":"document-node",
          "children":[],
          "type":"templates/SIMOS/Blueprint"
       },
       "data-source-name/document_1/uiRecipes/3":{
          "parentId":"data-source-name/document_1/3",
          "filename":"uiRecipes",
          "title":"uiRecipes",
          "id":"data-source-name/document_1/uiRecipes/3",
          "nodeType":"document-node",
          "children":[],
          "type":"templates/SIMOS/Blueprint"
       }
    }
    """
