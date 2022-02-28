from behave import given

from domain_classes.blueprint_attribute import BlueprintAttribute
from domain_classes.tree_node import ListNode, Node
from enums import SIMOS, SIMOS
from services.dmss import dmss_api
from services.document_service import DocumentService
from utils.create_entity_utils import CreateEntity

document_service = DocumentService()


def generate_tree_from_rows(node: Node, rows):
    if len(rows) == 0:
        return node

    if node.type == SIMOS.PACKAGE.value:
        content_node = node.search(f"{node.node_id}.content")
        # Create content not if not exists
        if not content_node:
            data = {
                "name": "content",
                "type": SIMOS.PACKAGE.value,
                "attributeType": SIMOS.BLUEPRINT_ATTRIBUTE.value,
            }
            content_node = ListNode(
                key="content",
                uid="",
                entity=data,
                blueprint_provider=document_service.get_blueprint,
                attribute=BlueprintAttribute("content", SIMOS.ENTITY.value),
            )
            node.add_child(content_node)
    else:
        content_node = node

    for row in rows:
        # Add children (only to packages)
        if row["parent_uid"] == node.uid:
            child_data = row.as_dict()
            entity = CreateEntity(
                blueprint_provider=document_service.get_blueprint,
                type=child_data["type"],
                description=child_data.get("description", ""),
                name=child_data["name"],
            ).entity
            child_node = Node(
                key="",
                uid=child_data["_id"],
                entity=entity,
                blueprint_provider=document_service.get_blueprint,
                attribute=BlueprintAttribute(child_data["name"], child_data["type"]),
            )

            print(f"adding {child_node.node_id} to {node.node_id}")
            content_node.add_child(child_node)

            if child_node.type == SIMOS.PACKAGE.value:
                filtered = list(filter(lambda i: i["_id"] != node.uid, rows))
                generate_tree_from_rows(child_node, filtered)

    return node


def generate_tree(data_source_id: str, table):
    root = Node(
        key=data_source_id,
        attribute=BlueprintAttribute(data_source_id, SIMOS.DATASOURCE.value),
        uid=data_source_id,
    )
    root_package = next((row for row in table.rows if row["parent_uid"] == ""), None)
    if not root_package:
        raise Exception("Root package is not found, you need to specify root package")
    root_package_data = root_package.as_dict()
    root_package_data["isRoot"] = True
    root_package_node = Node(
        key="root",
        uid=root_package["_id"],
        entity=root_package_data,
        blueprint_provider=document_service.get_blueprint,
        parent=root,
        attribute=BlueprintAttribute("root", SIMOS.PACKAGE.value),
    )
    rows = list(filter(lambda row: row["parent_uid"] != "", table.rows))
    generate_tree_from_rows(root_package_node, rows)
    return root_package_node


@given('there are documents for the data source "{data_source_id}" in collection "{collection}"')
def step_impl_documents(context, data_source_id: str, collection: str):
    context.documents = {}
    tree = generate_tree(data_source_id, context.table)
    tree.show_tree()
    root_package_response = dmss_api.explorer_add(data_source_id, tree.entity)  # First, create the rootPackage
    if tree.children:
        dmss_api.explorer_add(
            f"{data_source_id}/{root_package_response['uid']}.content", tree.children[0].children[0].to_dict()
        )
