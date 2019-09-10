Feature: Templates

  Scenario: Get blueprint template
    Given I access the resource url "/api/templates/blueprint.json"
    And init import is done
    When I make a "GET" request
    Then the response should equal
    """
    {
      "_id": "blueprint.json",
      "schema": {
        "title": "Blueprint",
        "type": "object",
        "properties": {
          "title": {
            "title": "Title",
            "type": "string",
            "default": ""
          },
          "description": {
            "title": "Description",
            "type": "string",
            "default": ""
          },
          "attributes": {
            "type": "array",
            "title": "Attributes",
            "items": {
              "properties": {
                "name": {
                  "title": "Name",
                  "type": "string"
                },
                "type": {
                  "title": "Type",
                  "type": "string",
                  "enum": [
                    "string",
                    "integer",
                    "number",
                    "boolean",
                    "blueprint"
                  ],
                  "enumNames": [
                    "String",
                    "Integer",
                    "Number",
                    "Boolean",
                    "Blueprint"
                  ],
                  "default": "string"
                },
                "value": {
                  "title": "Default Value",
                  "type": "string",
                  "default": ""
                },
                "dimensions": {
                  "title": "Dimensions",
                  "type": "string"
                }
              },
              "required": [
                "name",
                "type"
              ]
            }
          }
        },
        "required": [
          "title"
        ]
      },
      "view": [
        {
          "display": "basic",
          "keys": [
            "title",
            "description"
          ]
        },
        {
          "display": "table",
          "keys": "properties.attributes.items",
          "rowHeader": [
            "Name",
            "Type",
            "Unit",
            "$ref"
          ],
          "rowValues": [
            "name",
            "type",
            "unit",
            "ref"
          ]
        }
      ],
      "uiSchema": {
        "description": {
          "ui:widget": "textarea"
        },
        "ui:order": [
          "title",
          "description",
          "*"
        ],
        "attributes": {
          "ui:options": {
            "orderable": false
          },
          "items": {
            "ui:field": "attribute",
            "ui:order": [
              "name",
              "type",
              "value",
              "dimensions"
            ]
          }
        }
      }
    }
    """
