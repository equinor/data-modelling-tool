import io
import json
from json import JSONDecodeError
from pathlib import Path
from typing import Any, Tuple
from uuid import UUID, uuid4
from zipfile import ZipFile

from dmss_api import ApiException

from domain_classes.package import Package
from enums import BLOB_TYPES
from repository.repository_exceptions import ImportAliasNotFoundException, ImportReferenceNotFoundException
from restful import request_object as req
from restful import response_object as res
from restful import use_case as uc
from services.dmss import dmss_api
from services.document_service import DocumentService

keys_to_check = ("type", "attributeType", "_id", "extends")  # These keys can contain a reference


def replace_relative_references(key: str, value, reference_table: dict = None) -> Any:
    """
    Takes a key-value pair, and returns the passed value, with relative
    references updated with absolute ones found in the 'reference_table'.
    It digs down on complex types.
    @param reference_table: A dict like so; {"fileName": {"id": newUUID, "absolute": ds/root-package/file}
    @param key: Name of the attribute being checked in the document
    @param value: Value of the attribute being checked in the document
    @return: The passed value, with relative references updated with absolute ones
    """

    if key in keys_to_check:
        if key == "_id":
            try:
                UUID(value)  # If _id is a valid uuid, don't change it
                return value
            except ValueError:  # The _id is not a UUID. It should then be an alias
                try:
                    return next((doc["id"] for doc in reference_table.values() if doc["alias"] == value))
                except StopIteration:
                    raise ImportAliasNotFoundException(value)
        if key == "extends":  # 'extends' is a list
            extends_list = []
            for i, blueprint in enumerate(value):
                # Relative references start with a "/", if not, they are absolute references
                if blueprint[0] == "/":
                    try:
                        extends_list.append(reference_table[value[i]]["absolute"])
                    except KeyError:
                        raise ImportReferenceNotFoundException(value[i])
                extends_list.append(blueprint)
                return extends_list
        if value[0] == "/":
            try:
                return reference_table[value]["absolute"]
            except KeyError:
                raise ImportReferenceNotFoundException(value)

    # If the value is a complex type, dig down recursively
    if isinstance(value, dict):
        return {k: replace_relative_references(k, v, reference_table) for k, v in value.items()}
    if isinstance(value, list):
        return [replace_relative_references(key, v, reference_table) for v in value]

    return value  # This means it's a primitive type, return it as is


def add_file_to_package(path: Path, package: Package, document: dict) -> Tuple[UUID, str]:
    if len(path.parts) == 1:  # End of path means the actual document
        uid = uuid4()
        # If the document has an "_id", return it as an alias, if not use UUID as alias.
        alias = document.get("_id", str(uid))
        if document["type"] not in BLOB_TYPES:
            package.content.append({**document, "_id": alias})
        return uid, alias

    sub_folder = next((p for p in package.content if p["name"] == path.parts[0]), None)
    if not sub_folder:  # If the sub folder has not already been created on parent, create it
        sub_folder = Package(name=path.parts[0])
        package.content.append(sub_folder)

    new_path = str(path).split("/", 1)[1]  # Remove first element in path before stepping down
    return add_file_to_package(Path(new_path), sub_folder, document)


def package_tree_from_zip(data_source_id: str, package_name: str, zip_package: io.BytesIO) -> Package:
    """
    Converts a Zip-folder into a Data Modelling Tool Package structure. Inserting UUID4's between any references,
    and converting relative paths to absolute paths
    @param package_name: name of the package
    @param data_source_id: A string with the name/id of an existing data source to import package to
    @param zip_package: A zip-folder represented as an in-memory io.BytesIO object
    @return: A Package object with sub folders(Package) and documents(dict)
    """
    root_package = Package(name=package_name, is_root=True)
    reference_table = {}

    with ZipFile(zip_package) as zip_file:
        # Construct a nested Package object of the package to import
        for filename in zip_file.namelist():
            if Path(filename).suffix != ".json":
                continue
            filename = filename.split("/", 1)[1]  # Remove RootPackage prefix
            try:
                json_doc = json.loads(zip_file.read(f"{package_name}/{filename}"))
            except JSONDecodeError:
                raise Exception(f"Failed to load the file '{filename}' as a JSON document")
            uid, alias = add_file_to_package(Path(filename), root_package, json_doc)

            # Create a dict with new UUID's and absolute references for every file in the package
            relative_path = f"/{filename.removesuffix('.json')}"
            reference_table.update(
                {
                    relative_path: {
                        "filename": filename,
                        "alias": alias,
                        "id": str(uid),
                        "absolute": f"{data_source_id}/{package_name}{relative_path}",
                    }
                }
            )

        # Now that we have the entire package as a Package tree, traverse it, and replace relative references
        root_package.traverse_documents(
            lambda document: {
                k: replace_relative_references(k, v, reference_table=reference_table) for k, v in document.items()
            },
            update=True,
        )

    return root_package


def import_package_tree(root_package: Package, data_source_id: str) -> None:
    dmss_api.explorer_add_raw(data_source_id, root_package.to_dict())
    root_package.traverse_documents(lambda document: dmss_api.explorer_add_raw(data_source_id, document))
    root_package.traverse_package(lambda package: dmss_api.explorer_add_raw(data_source_id, package.to_dict()))


class ImportPackageRequestObject(req.ValidRequestObject):
    def __init__(self, data_source_id: str, package_name: str, zip_package: io.BytesIO):
        self.data_source_id = data_source_id
        self.package_name = package_name
        self.zip_package = zip_package

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "dataSourceId" not in adict:
            invalid_req.add_error("dataSourceId", "is missing")
        if "packageName" not in adict:
            invalid_req.add_error("packageName", "is missing")
        if "zipPackage" not in adict:
            invalid_req.add_error("zipPackage", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(adict["dataSourceId"], adict["packageName"], adict["zipPackage"])


class ImportPackageUseCase(uc.UseCase):
    def process_request(self, req: ImportPackageRequestObject):
        document_service = DocumentService()

        try:  # Test if a package with the same name already exists
            document_service.document_provider(f"{req.data_source_id}/{req.package_name}")
        except ApiException as error:
            if error.status == 404:
                pass
        else:
            raise Exception(
                f"Failed to import package. Does a package named "
                f"'{req.package_name}' already exist in data source '{req.data_source_id}'?"
            )

        try:
            root_package = package_tree_from_zip(req.data_source_id, req.package_name, req.zip_package)
        except Exception as error:
            raise Exception(f"Something went wrong trying to import the package; {error}")

        import_package_tree(root_package, req.data_source_id)

        return res.ResponseSuccess("ok")
