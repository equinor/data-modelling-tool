from behave import given
from services.database import model_db
from utils.logging import logger
from core.domain.root_package import RootPackage
from core.domain.sub_package import SubPackage
from core.domain.document import Document


@given('there are root packages in collection "{collection}"')
def step_impl_root_packages(context, collection):
    context.sub_packages = {}
    for row in context.table:
        filename = row["filename"]
        root_package_id = f"{filename}/package"
        latest_version_package_id = f"{filename}/{row['version']}/package"
        root_package = RootPackage(id=root_package_id, template_ref="template/root-package")
        root_package.form_data.latest_version = latest_version_package_id
        root_package.form_data.versions = [latest_version_package_id]
        try:
            model_db[f"{collection}"].replace_one({"_id": root_package_id}, root_package.to_dict(), upsert=True)
        except Exception as Error:
            logger.error(f"Could not import: {Error}")
        sub_package = SubPackage(
            id=latest_version_package_id, template_ref="templates/package-template", document_type="version"
        )
        try:
            model_db[f"{collection}"].replace_one({"_id": sub_package.id}, sub_package.to_dict(), upsert=True)
            context.sub_packages[sub_package.id] = sub_package
        except Exception as Error:
            logger.error(f"Could not import: {Error}")


@given('there are sub packages in collection "{collection}"')
def step_impl_sub_packages(context, collection):
    for row in context.table:
        parent: SubPackage = context.sub_packages[row["parent_id"]]
        filename = row["filename"]
        sub_package_id = parent.add_subpackage(filename)
        try:
            model_db[f"{collection}"].replace_one({"_id": parent.id}, parent.to_dict(), upsert=True)
        except Exception as Error:
            logger.error(f"Could not import: {Error}")

        new_sub_package = SubPackage(
            id=sub_package_id, template_ref="templates/package-template", document_type="subpackage"
        )
        try:
            model_db[f"{collection}"].replace_one({"_id": new_sub_package.id}, new_sub_package.to_dict(), upsert=True)
            context.sub_packages[new_sub_package.id] = new_sub_package
        except Exception as Error:
            logger.error(f"Could not import: {Error}")


@given('there are documents in collection "{collection}"')
def step_impl_documents(context, collection):
    context.documents = {}
    for row in context.table:
        parent: SubPackage = context.sub_packages[row["parent_id"]]
        filename = row["filename"]
        document_id = parent.add_file(filename)
        try:
            model_db[f"{collection}"].replace_one({"_id": parent.id}, parent.to_dict(), upsert=True)
        except Exception as Error:
            logger.error(f"Could not import: {Error}")

        document = Document(id=document_id, template_ref="templates/package-template")
        try:
            model_db[f"{collection}"].replace_one({"_id": document.id}, document.to_dict(), upsert=True)
            context.documents[document.id] = document
        except Exception as Error:
            logger.error(f"Could not import: {Error}")
