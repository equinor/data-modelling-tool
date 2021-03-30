Feature: test

Scenario: Get index for single document (model- and storage-NOT-contained)
    Given there are mongodb data sources
      | host | port  | username | password | tls   | name             | database | collection   |  type     |
      | db   | 27017 | maf      | maf      | false | data-source-name | local    | documents    |  mongo-db |
      | db   | 27017 | maf      | maf      | false | test-source-name | local    | test         |  mongo-db |
      | db   | 27017 | maf      | maf      | false | apps             | local    | applications |  mongo-db |


    Given there exist document with id "1" in data source "test-source-name"
    """
    {
        "name": "TestPackage",
        "description": "",
        "type": "system/SIMOS/Package",
        "content": [
            {
                "_id": "4",
                "name": "TestContainerMixContained"
            },
            {
                "_id": "3",
                "name": "TestContainer"
            },
            {
                "_id": "2",
                "name": "ItemType"
            }
        ],
        "isRoot": true,
        "storageRecipes": [],
        "uiRecipes": []
    }
    """

