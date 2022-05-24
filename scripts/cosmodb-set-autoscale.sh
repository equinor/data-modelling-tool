#!/usr/bin/env bash

set -uo pipefail
##############################################################################3
# Migrates all the collections in the Azure CosmoDB databases to an autoscale
# throughput provisioning. See; https://docs.microsoft.com/en-us/azure/cosmos-db/provision-throughput-autoscale
##############################################################################3

# Variable block
location="norwayeast"
resourceGroup="dmt-test"
subscription="S398-DataModellingTool"
account="dmt-db-test" # needs to be lower case

MONGO_COLLECTIONS=(
    "dmss-internal/data_sources"
    "DMSS-core/DMSS-core"
    "DMT-DS/DMT-DS"
    "DemoDS/default"
    "analysis-platform/default"
    "workflow/default"
    "app_asgardb_db/app_asgardb_db"
    "app_mooring_db/app_mooring_db"
    "sima/sima"
    )

for collection in "${MONGO_COLLECTIONS[@]}"; do
    IFS='/'
    read -a dbAndCollection <<< "$collection"
    unset IFS
    database=${dbAndCollection[0]}
    collection=${dbAndCollection[1]}

    echo "Migrating collection '$collection' in database '$database' to autoscale throughput provisioning"
    az cosmosdb mongodb collection throughput migrate \
        --account-name "$account" \
        --subscription "$subscription" \
        --resource-group "$resourceGroup" \
        --database-name "$database" \
        --name "$collection" \
        --throughput-type autoscale
done
