Feature: Document - Generate JSON Schema

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection     | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name | maf      | documents      | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | SSR-DataSource   | dmt      | SSR-DataSource | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | system           | dmt      | system         | blueprints   | mongo-db |

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
    "schema": {
      "properties": {
        "blueprints": {
          "items": {
            "description": "Blueprint packages that are available by default (Path without Datasource prefix).",
            "type": "string"
          },
          "type": "array"
        },
        "blueprintsModels": {
          "items": {
            "description": "Models that are available to create in blueprints page (Path without Datasource prefix).",
            "type": "string"
          },
          "type": "array"
        },
        "description": {
          "default": "Create an application by exporting Blueprints and Entities, and configuring context menus.",
          "type": "string"
        },
        "entities": {
          "items": {
            "description": "Entity packages that are available by default (Path without Datasource prefix).",
            "type": "string"
          },
          "type": "array"
        },
        "entityModels": {
          "items": {
            "description": "Models that are available to create in entity page (Path without Datasource prefix).",
            "type": "string"
          },
          "type": "array"
        },
        "name": {
          "type": "string"
        },
        "runnableModels": {
          "items": {
            "properties": {
              "description": {
                "type": "string"
              },
              "input": {
                "description": "Reference to a Blueprint (Path without Datasource prefix).",
                "type": "string"
              },
              "method": {
                "description": "What method to call inside runnable.tsx",
                "type": "string"
              },
              "name": {
                "type": "string"
              },
              "output": {
                "description": "Reference to a Blueprint (Path without Datasource prefix).",
                "type": "string"
              },
              "type": {
                "default": "system/SIMOS/Runnable",
                "type": "string"
              }
            },
            "type": "object"
          },
          "type": "array"
        },
        "type": {
          "default": "system/SIMOS/Application",
          "type": "string"
        }
      },
      "type": "object"
    },
    "uiSchema": {}
    }
    """
