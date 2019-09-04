from behave import given
from services.database import model_db
from utils.logging import logger


@given('there are package named "{package_name}" of "{collection}"')
def step_impl_2(context, package_name, collection):
    context.cases = {}
    root_package_id = package_name
    for row in context.table:
        package_id = "{}/{}/package.json".format(root_package_id, row["version"])

        root_package = {
            "_id": root_package_id,
            "title": row["title"],
            "description": row["description"],
            "documentType": "root-package",
            "latestVersion": package_id,
            "versions": [package_id],
        }
        try:
            model_db[f"{collection}"].replace_one({"_id": root_package_id}, root_package, upsert=True)
        except Exception as Error:
            logger.error(f"Could not import: {Error}")

        package = {
            "title": row["title"],
            "description": row["description"],
            "documentType": "version",
            "subpackages": [],
            "files": [],
        }

        try:
            model_db[f"{collection}"].replace_one({"_id": package_id}, package, upsert=True)
        except Exception as Error:
            logger.error(f"Could not import: {Error}")
