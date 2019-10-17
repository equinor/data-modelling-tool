Feature: Document - Generate JSON Schema

  Background: There are data sources in the system

    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection | documentType | type     |
      | db   | 27017 | maf      | maf      | false | data-source-name | maf      | documents  | blueprints   | mongo-db |
      | db   | 27017 | maf      | maf      | false | templates        | dmt      | template   | blueprints   | mongo-db |

  Scenario: Generate Blueprint
    Given i access the resource url "/api/v2/json-schema/templates/SIMOS/Blueprint"
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
             "attributes":{
                "type":"array",
                "items":{
                   "type":"object",
                   "properties":{
                      "name":{
                         "type":"string"
                      },
                      "description":{
                         "type":"string"
                      },
                      "labels":{
                         "type":"string"
                      },
                      "values":{
                         "type":"string"
                      }
                   }
                }
             },
             "storageRecipes":{
                "type":"array",
                "items":{
                   "type":"object",
                   "properties":{
                      "name":{
                         "type":"string"
                      },
                      "description":{
                         "type":"string"
                      },
                      "attributes":{
                         "type":"array",
                         "items":{
                            "type":"object",
                            "properties":{
                               "name":{
                                  "type":"string"
                               },
                               "description":{
                                  "type":"string"
                               },
                               "contained":{
                                  "type":"boolean"
                               }
                            }
                         }
                      }
                   }
                }
             },
             "uiRecipes":{
                "type":"array",
                "items":{
                   "type":"object",
                   "properties":{
                      "name":{
                         "type":"string"
                      },
                      "attributes":{
                         "type":"array",
                         "items":{
                            "type":"object",
                            "properties":{
                               "name":{
                                  "type":"string"
                               },
                               "description":{
                                  "type":"string"
                               },
                               "optional":{
                                  "type":"boolean"
                               },
                               "type":{
                                  "type":"string"
                               }
                            }
                         }
                      }
                   }
                }
             }
          }
       },
       "uiRecipes":{
          "DEFAULT_EDIT":{
             "description":{
                "ui:widget":"textarea"
             },
             "attributes":{
                "ui:options":{
                   "orderable":false
                },
                "items":{
                   "ui:field":"attribute"
                }
             }
          }
       }
    }
    """
