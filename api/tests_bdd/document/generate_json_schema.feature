Feature: Document - Generate JSON Schema

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name            | database | collection     | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name| maf      | documents      | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | SSR-DataSource  | dmt      | SSR-DataSource | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | system          | dmt      | system         | blueprints   | mongo-db |

  Scenario: Generate Blueprint
    Given i access the resource url "/api/v2/json-schema/system/SIMOS/Blueprint"
    And data modelling tool templates are imported
    When i make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
        "schema": {},
        "uiSchema": {}
    }
    """

  Scenario: Generate Application
    Given i access the resource url "/api/v2/json-schema/system/SIMOS/Application"
    And data modelling tool templates are imported
    When i make a "GET" request
    Then the response status should be "OK"
    And the response should contain
    """
    {
       "schema":{
          "type":"object",
          "properties":{
             "name":{
                "type":"string"
             },
             "description":{
                "type":"string"
             },
             "blueprints":{
                "type":"array",
                "items":{
                   "type":"string",
                   "description":"Blueprint packages that are available by default"
                }
             },
             "entities":{
                "type":"array",
                "items":{
                   "type":"string",
                   "description":"Entity packages that are available by default"
                }
             },
             "blueprintsModels":{
                "type":"array",
                "items":{
                   "type":"string",
                   "description":"Models that are available to create in blueprints page"
                }
             },
             "entityModels":{
                "type":"array",
                "items":{
                   "type":"string",
                   "description":"Models that are available to create in entity page"
                }
             },
             "runnable":{
                "type":"object",
                "properties":{
                   "name":{
                      "type":"string"
                   },
                   "description":{
                      "type":"string"
                   },
                   "input":{
                      "type":"string",
                      "description":""
                   },
                   "output":{
                      "type":"string",
                      "description":""
                   },
                   "function":{
                      "type":"string",
                      "description":"What are the function called inside runnable.tsx"
                   }
                }
             }
          }
       },
       "uiSchema":{

       }
    }
    """
