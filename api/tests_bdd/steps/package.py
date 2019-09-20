from behave import given
import json
from services.database import model_db
from utils.logging import logger


@given('there are package named "{package_name}" of "{collection}"')
def step_impl_2(context, package_name, collection):
    context.cases = {}
    root_package_id = f"{package_name}/package"
    for row in context.table:
        version_package_id = f"{package_name}/{row['version']}/package"
        root_package = f"""
            {{
                "_id": "{root_package_id}",
                "meta": {{
                    "name": "package",
                    "documentType": "root-package",
                    "templateRef": "template/root-package"
                }},
                "formData": {{
                    "title": "{row['title']}",
                    "description": "{row['description']}",
                    "latestVersion": "{version_package_id}",
                    "versions": ["{version_package_id}"]
                }}
            }}
        """

        try:
            model_db[f"{collection}"].replace_one({"_id": root_package_id}, json.loads(root_package), upsert=True)
        except Exception as Error:
            logger.error(f"Could not import: {Error}")

        version_package = f"""
            {{
                "_id": "{version_package_id}",
                "meta": {{
                    "name": "package",
                    "documentType": "version",
                    "templateRef": "templates/package-template"
                }},
                "formData": {{
                    "title": "{row['title']}",
                    "description": "{row['description']}"
                }}
            }}
        """

        try:
            model_db[f"{collection}"].replace_one(
                {"_id": version_package_id}, json.loads(version_package), upsert=True
            )
        except Exception as Error:
            logger.error(f"Could not import: {Error}")
