from behave import given

from classes.blueprint_attribute import BlueprintAttribute
from classes.tree_node import ListNode, Node
from core.enums import DMT, SIMOS
from core.service.create_entity_utils import CreateEntity
from core.utility import BlueprintProvider
from services.data_modelling_document_service import dmss_api

blueprint_provider = BlueprintProvider()


def generate_tree_from_rows(node: Node, rows):
    if len(rows) == 0:
        return node

    if node.type == DMT.PACKAGE.value:
        content_node = node.search(f"{node.node_id}.content")
        # Create content not if not exists
        if not content_node:
            data = {"name": "content", "type": DMT.PACKAGE.value, "attributeType": SIMOS.BLUEPRINT_ATTRIBUTE.value}
            content_node = ListNode(
                key="content",
                uid="",
                entity=data,
                blueprint_provider=blueprint_provider,
                attribute=BlueprintAttribute("content", DMT.ENTITY.value),
            )
            node.add_child(content_node)
    else:
        content_node = node

    for row in rows:
        # Add children (only to packages)
        if row["parent_uid"] == node.uid:
            child_data = row.as_dict()
            entity = CreateEntity(
                blueprint_provider=blueprint_provider,
                type=child_data["type"],
                description=child_data.get("description", ""),
                name=child_data["name"],
            ).entity
            child_node = Node(
                key="",
                uid=child_data["uid"],
                entity=entity,
                blueprint_provider=blueprint_provider,
                attribute=BlueprintAttribute(child_data["name"], child_data["type"]),
            )

            print(f"adding {child_node.node_id} to {node.node_id}")
            content_node.add_child(child_node)

            if child_node.type == DMT.PACKAGE.value:
                filtered = list(filter(lambda i: i["uid"] != node.uid, rows))
                generate_tree_from_rows(child_node, filtered)

    return node


def generate_tree(data_source_id: str, table):
    root = Node(key=data_source_id, attribute=BlueprintAttribute(data_source_id, ""), uid=data_source_id)
    root_package = list(filter(lambda row: row["parent_uid"] == "", table.rows))[0]
    if not root_package:
        raise Exception("Root package is not found, you need to specify root package")
    root_package_data = root_package.as_dict()
    root_package_data["isRoot"] = True
    root_package_node = Node(
        key="root",
        uid=root_package["uid"],
        entity=root_package_data,
        blueprint_provider=blueprint_provider,
        parent=root,
        attribute=BlueprintAttribute("root", DMT.PACKAGE.value),
    )
    rows = list(filter(lambda row: row["parent_uid"] != "", table.rows))
    generate_tree_from_rows(root_package_node, rows)
    return root_package_node


@given('there are documents for the data source "{data_source_id}" in collection "{collection}"')
def step_impl_documents(context, data_source_id: str, collection: str):
    context.documents = {}
    tree = generate_tree(data_source_id, context.table)
    tree.show_tree()
    dmss_api.explorer_add_document(data_source_id, tree.to_dict())
