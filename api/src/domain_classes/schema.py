from __future__ import annotations

import base64
import copy
import hashlib
import hmac
import os
import zlib
from collections.abc import Iterable
from pathlib import Path
from types import CodeType
from typing import Any, Callable, Dict, List, Optional, TypeVar, Union, Set

import stringcase
from jinja2 import Template

from config import Config

T = TypeVar("T")

simple_types: List[type] = [str, bool, int, float]


def has_attribute(schema, name: str) -> bool:
    try:
        schema[name]
        return True
    except (KeyError, TypeError):
        try:
            getattr(schema, name)
            return True
        except AttributeError:
            return False
    return False


def get_attribute(item, attribute: str, use_default: bool = False, default=None) -> str:
    try:
        return getattr(item, attribute)
    except AttributeError:
        if use_default or default is not None:
            return item.get(attribute, default)
        return item[attribute]


def _get_definition(schema: Union[Dict, type], name: str) -> Optional[str]:
    attributes = get_attribute(schema, name, default=False)
    if attributes and isinstance(attributes, Iterable):  # E.g. not the `values` method on a dictionary
        for attr in attributes:
            if not any(isinstance(attr, type) for type in simple_types) and get_attribute(attr, "name") == name:
                return get_attribute(attr, "type")
    return None


def is_simple_type(element) -> bool:
    if isinstance(element, type):
        return element in simple_types
    return type(element) in simple_types


def get_simple_types() -> str:
    return f"[{', '.join(type_.__name__ for type_ in simple_types)}]"


def unpack_if_not_simple(value: str, _type: type) -> str:
    unpack = ""
    if _type not in simple_types:
        unpack = "**"
    return f"{unpack}{value}"


def get_name(attr: Attribute) -> str:
    return to_snake_case(attr.name)


def get_name_of_list_class(attr: Attribute) -> str:
    return "__" + stringcase.pascalcase(f"{get_name(attr)}_container")


def get_name_of_metaclass(schema: Dict[str, Any]) -> str:
    return f"_{schema['name']}Template"


def to_snake_case(name: str) -> str:
    return stringcase.snakecase(name)


def is_special_key(key: str) -> bool:
    # Special keys, that should be ignored
    return key in ["__class__", "__template_type__", "__raw__"]


def is_internal(schema, key: str) -> bool:
    if is_special_key(key):
        return True
    return key.startswith("__") and key.endswith("__") and key.strip("__") in schema


def default_as_loadable_json(attr: Attribute) -> str:
    default = attr.default
    if attr.type is str:
        default = f'"{default}"'
    elif attr.type is bool:
        default = str(attr.default).lower()
    return f"'''{default}'''"


def extract_casting(attr: Union[Attribute, str, dict]) -> str:
    try:
        return f"**{snakify(attr.__values__)}"
    except AttributeError:
        if isinstance(attr, str):
            return f'"{attr}"'
        elif isinstance(attr, dict):
            return f"**{snakify(attr)}"
        return f"{attr}"


def snakify(schema: Dict[str, Any]) -> Dict[str, Any]:
    if isinstance(schema, str):
        return schema
    _dict = {}
    for key, value in schema.items():
        if isinstance(value, dict):
            value = snakify(value)
        elif isinstance(value, list):
            value = [snakify(val) for val in value]
        _dict[f"{to_snake_case(key)}"] = value
    return _dict


class BinaryRepresentation:
    def __init__(self, binary: bytes, signature: str):
        self.binary = binary
        self.signature = signature


def get_signature(key, msg) -> str:
    return hmac.new(key, msg, digestmod=hashlib.sha3_256).hexdigest()


def get_pickled(factory: Factory) -> BinaryRepresentation:
    import pickle  # nosec B403; We are ONLY using it for dumping data, which is a safe usage of pickling
    from app import app

    pickeled = pickle.dumps(factory, pickle.HIGHEST_PROTOCOL)
    signature = get_signature(app.secret_key, pickeled)
    return BinaryRepresentation(pickeled, signature)


def load_from_pickle(representation: BinaryRepresentation) -> Optional[Factory]:
    import pickle  # nosec B403; Loading UNTRUSTED content is a security risk. The data loaded is signed.
    from app import app

    expected_signature = representation.signature
    actual_signature = get_signature(app.secret_key, representation.binary)
    if hmac.compare_digest(expected_signature, actual_signature):
        # Assuming the secret key is sufficiently random, reset between sessions, and that
        # an adversary does not have access to the secret key, this should be sufficiently secure
        return pickle.loads(representation.binary)  # nosec B301
    return None


class Attribute:
    def __init__(
        self, data: Dict[str, Any], attribute_type: type, type: type, definition: Dict[str, Any], original_name: str
    ):
        self.type = type
        self.__values__ = data
        self._definition = definition
        self.attribute_type = attribute_type
        self.original_name = original_name

    def __repr__(self):
        attributes = ["name", "optional", "contained"]
        if self.has_default:
            attributes += ["default"]

        def get_representation(key: str) -> str:
            value = getattr(self, key)
            if isinstance(value, str):
                value = f"'{value}'"
            return value

        return f"""{self.__class__.__name__}({", ".join(f"{key}={get_representation(key)}" for key in attributes)})"""

    @property
    def name(self):
        return to_snake_case(self.__values__["name"])

    @property
    def contained(self):
        return self._get("contained", True)

    @property
    def is_list(self):
        return bool(self._get("dimensions", "").strip("\"'"))

    @property
    def default(self):
        return self._get("default", None)

    @property
    def cast(self):
        # FIXME: Deal with Package's content of collection type 'Entity'
        if self.name in ["type", "content"]:
            return False
        return True

    @property
    def has_default(self):
        return "default" in self.__values__ and "default" in self._definition

    @property
    def enum_type(self):
        return self._get("enum_type", None)

    @property
    def optional(self):
        return self._get("optional", False)

    @property
    def dimensions(self) -> Optional[str]:
        return self._get("dimensions", None)

    def _get(self, name, default=None):
        return self.__values__.get(name, default)


class __Blueprint__(type):
    """Used only for type annotation"""

    __completed__: bool
    __schema__: dict
    __template_type__: str
    type: Union[str, __Blueprint__]

    @classmethod
    def __code__(
        mcs,
        include_dependencies: bool = False,
        format_code=False,
        include_imports: bool = True,
        include_code_generation: bool = False,
        keep_dmt_imports: bool = False,
        _included_dependencies: Optional[Set[__Blueprint__]] = None,
    ) -> str:
        ...

    @staticmethod
    def __dependencies__() -> List[__Blueprint__]:
        ...

    @classmethod
    def __has_circular_dependencies__(cls) -> bool:
        ...

    @classmethod
    def __circular_dependencies__(cls) -> Set[__Blueprint__]:
        ...


class Attributes:
    def __init__(self, attributes: Optional[List[Attribute]] = None):
        self._attributes: List[Attribute] = attributes or []

    def add(self, attribute: Attribute):
        self._attributes.append(attribute)

    @property
    def required(self):
        return sorted(self._filter(lambda attr: not attr.optional), key=lambda attr: attr.has_default)

    @property
    def optional(self):
        return self._filter(lambda attr: attr.optional)

    def _filter(self, filter: Callable[[Attribute], bool]):
        return [attribute for attribute in self._attributes if filter(attribute)]

    def __iter__(self):
        return (self.required + self.optional).__iter__()

    @property
    def ordered(self):
        return self._attributes

    @property
    def has_attributes(self):
        return any(attribute.name == "attributes" for attribute in self)

    def __len__(self):
        return len(self._attributes)


def remove_imports(definition: str) -> str:
    return "\n".join(
        line for line in definition.split("\n") if not any(line.startswith(word) for word in ["from", "import"])
    )


def basic_types() -> Dict[str, type]:
    return {"string": str, "boolean": bool, "integer": int, "number": float}


def compress(data: str, format: bool = True, indent: int = 2) -> str:
    compressed = zlib.compress(data.encode("UTF-8"), zlib.Z_BEST_COMPRESSION)
    encoded = str(base64.b85encode(compressed), "UTF-8")
    if format:
        encoded = format_long_line(encoded, indent)
    return str(encoded)


def format_long_line(data: str, indent: int) -> str:
    """Helper method for formatting long string, while black is missing this feature"""
    line_length = get_project_line_length() - (4 * indent + 3)
    lines = []
    index, n = 0, len(data)
    while index < n:
        end = index + line_length
        lines.append(data[index : min(end, n)])
        index = end
    data = str(tuple(lines)).replace(",", "")
    return data


def get_dto() -> str:
    with open(Path(__file__).parent / "dto.py") as f:
        content = "\n".join(f.readlines())
    return content


def get_project_line_length() -> int:
    return 119


TypeMapping = Dict[str, __Blueprint__]


class TypeCache:
    def __init__(self, permanent: TypeMapping, fleeting: Optional[TypeMapping] = None):
        self._permanent = permanent
        self._fleeting = fleeting or {}
        self._static = basic_types()
        self.lookup_table: Dict[__Blueprint__, str] = {}
        for container in self._permanent, self._fleeting:
            for template_type, Template in container.items():
                self.lookup_table[Template] = template_type

    def __getitem__(self, item: str) -> __Blueprint__:
        if self._is_template_internal(item):
            return self._permanent[item]
        elif self._is_static(item):
            return self._static[item]
        else:
            return self._fleeting[item]

    def __setitem__(self, key: str, value: __Blueprint__):
        self.lookup_table[value] = key
        if self._is_template_internal(key):
            self._permanent[key] = value
        else:
            self._fleeting[key] = value

    def __contains__(self, item: str):
        return any(item in collection for collection in self._collections)

    @property
    def _collections(self):
        return self._permanent, self._fleeting, self._static

    @staticmethod
    def _is_static(template_type: str) -> bool:
        return "/" not in template_type

    @staticmethod
    def _is_template_internal(template_type: str) -> bool:
        return template_type.startswith("system/")


class Factory:
    _internal_types: Dict[str, type] = {}

    def __init__(
        self,
        blueprints: Dict[str, dict],
        _create_instance: bool = False,
        dump_site: Optional[str] = None,
    ):
        self._types = TypeCache(self._internal_types)
        self._blueprints = blueprints
        self._create_instance = _create_instance
        self.dump_site = dump_site
        self._class_template = self._create_class_template(
            [
                self.type_name,
                self.type_annotation,
                self.signature,
                unpack_if_not_simple,
                get_name,
                self.variable_annotation,
                to_snake_case,
                self.cast_as,
                self.cast,
                self.get_type,
                is_internal,
                extract_casting,
                snakify,
                is_simple_type,
                get_simple_types,
                self.type_check,
                get_name_of_list_class,
                get_name_of_metaclass,
                self.get_escaped_default,
                default_as_loadable_json,
                compress,
                self.get_dependencies,
                get_dto,
                get_project_line_length,
                self.get_type_mapping,
            ]
        )
        self.to_be_compiled = set()

    def reset(self):
        self.reset_cache()
        self._types = TypeCache(self.__class__._internal_types)

    @classmethod
    def reset_cache(cls):
        del cls._internal_types
        cls._internal_types = {}

    def _get_schema(self, template_type: str) -> dict:
        return self._blueprints[template_type]

    def class_from_schema(self, schema) -> str:
        return self._class_template.render(schema=schema)

    @staticmethod
    def _create_class_template(macros):
        # with open(f'{Path(__file__).parent}/schema.jinja2') as f:
        #     template = "\n".join(f.readlines())
        # noinspection JinjaAutoinspect
        # noinspection GrazieInspection
        class_template = Template(
            """\
{%- block imports %}
from __future__ import annotations
from typing import List, Optional, Union, Any, Set, Tuple, Dict
import stringcase
import json
import base64
from domain_classes.dto import DTO
{%- endblock %}
{%- block definition %}


class {{ get_name_of_metaclass(schema) }}(type):
    def __new__(metacls, name, bases, attrs):
        cls = type(name, bases, attrs)
        {%- for key, value in schema.items() if not is_internal(schema, key) %}
        {%- set variable_name = to_snake_case(key) %}

        {%- if variable_name == "type" %}

        cls._type = "{{ schema.type }}"

        @property
        def get_type(cls) -> Union[type, str]:
            try:
                return {{ type_name(schema.type) }}
            except NameError:
                return cls._type
        metacls.__bind_method(cls, get_type, "type")
        {%- elif value is string %}
        {#- These are simple strings, that does not require special semantic  #}
        cls.{{ variable_name }} = "{{ value }}"
        {%- elif value is iterable %}

        def __get_{{ variable_name }}_type() -> type:
            try:
                return {{ get_type(schema, variable_name) }}
            except NameError:
                def ReflectValues(**kwargs):
                    return kwargs
                return ReflectValues

        @property
        def get_{{ variable_name }}(cls):
            return [
            {%- if variable_name == "attributes" %}
            {%- set value = value.ordered %}
            {%- endif %}
            {%- for attr in value %}
                __get_{{ variable_name }}_type()({{ extract_casting(attr) }}),
            {%- endfor %}
            ]
        metacls.__bind_method(cls, get_{{ variable_name }}, "{{ variable_name }}")
        {%- else %}
        # TODO: Something
        '''
            Key: {{ key }}
            Value: {{ value }}
        '''
        {%- endif -%}
        {%- endfor %}

        return cls

    def __getattr__(metacls, item: str):
        return getattr(metacls, item)

    @staticmethod
    def __bind_method(instance, func, as_name: Optional[str] = None):
        '''Borrowed from StackOverflow; https://stackoverflow.com/a/1015405/4414141'''
        if as_name is None:
            as_name = func.__name__
        bound_method = func.__get__(instance, instance.__class__)
        setattr(instance, as_name, bound_method)
        return bound_method


class {{ schema.name }}(metaclass={{ get_name_of_metaclass(schema) }}):
{%- if schema.attributes %}
    {%- for attr in schema.attributes %}
    {%- if attr.is_list %}

    class {{ get_name_of_list_class(attr) }}(list):
        def __init__(self, *args, **kwargs):
            # TODO: Deal with bounded arrays
            super().__init__(*args, **kwargs)

        def append(self, item):
            item = {{ cast_as(attr, "item") }}
            super().append(item)

        def to_dict(self, include_defaults: bool = True):
            return [el.to_dict(include_defaults=include_defaults) if hasattr(el, "to_dict") else el for el in self]
    {%- endif %}
    {%- endfor %}

    def __init__(self, {{ signature(schema.attributes) }}):
        self.__id_key__ = None
        self.__uid__ = None
        {%- for attr in schema.attributes %}
        {%- set name = get_name(attr) %}
        {%- if name == "type" %}
        {#- Deals with special cases #}
        self.{{ name }} = "{{ schema.__template_type__ }}"
        {%- else %}
        {%- if not is_simple_type(attr.attribute_type) and attr.default is string and attr.default %}
        if {{ name }} is None:
            import json
            {{ name }} = json.loads({{ default_as_loadable_json(attr) }})
        {%- endif %}
        {%- if attr.is_list and attr.optional %}

        if {{ name }} is None:
            {{ name }} = {{ custom_list_name }}()
        {{ name }} = {{ cast(attr) }}
        {%- elif attr.optional %}

        if {{ name }} is None:
            {{ name }} = {{ get_escaped_default(attr) }}
        if {{ name }} is not None:
            {{ name }} = {{ cast(attr) }}
        {%- else %}

        {{ name }} = {{ cast(attr) }}
        {%- endif %}
        self.{{ name }} = {{ name }}
        {%- endif %}
        {%- endfor %}
    {%- if schema.attributes.has_attributes %}

    # These thee methods, are used to defined the "**" operator
    def __getitem__(self, item: str):
        return getattr(self, item)

    def __len__(self):
        return len(self.attributes)

    def __iter__(self):
        return self.attributes.__iter__
    {%- endif %}

    __template_type__ = "{{ schema.__template_type__ }}"

    @property
    def __schema__(self):
        return {{ schema.__raw__ }}
    {%- if schema.attributes.has_attributes %}

{#
    def __new__(cls, {{ signature(schema.attributes) }}):
        # TODO?: Implement / move explicit properties to be dynamically generated.
        instance = super({{ schema.name }}, cls).__new__(cls)
        return instance
#}
    {%- endif %}

    {%- for attr in schema.attributes %}

    @property
    def {{ get_name(attr) }}(self) -> {{ type_annotation(attr) }}:
        return self._{{ get_name(attr) }}

    @{{ get_name(attr) }}.setter
    def {{ get_name(attr) }}(self, value: {{ type_annotation(attr, may_be_dict=True) }}):
        {% if not attr.optional -%}
        if value is None:
            raise ValueError("'{{ get_name(attr) }}' is required, and cannot be set to None")
        {% endif -%}
        {% if attr.cast -%}
        from domain_classes.dto import DTO
        {%- if attr.is_list %}
        # FIXME: Deal with multi-dimensional data
        if isinstance(value, list) and all(isinstance(element, dict) for element in value):
        {%- else %}
        if isinstance(value, dict):
        {%- endif %}
            # TODO: Fill in missing keys, if they can be obtained
            # E.g. `self.type`
            value = {{ cast(attr, "value") }}
        if not {{ type_check(attr, "value") }}:
            {%- if attr.optional %}
            if value is not None:
            {%- endif %}
            {% if attr.optional %}    {% endif %}raise ValueError(
                f"'{{ get_name(attr) }}' has an illegal value of {value}. "
                f"Its type is expected to be of type {{ type_name(attr) }}."
            )
        {%- endif %}
        self._{{ get_name(attr) }} = value
    {%- endfor %}

    def to_dict(self=None, *, include_defaults: bool = True):
        # Hack to be able to call `to_dict()` of a class instance
        if self is None:
            self = {{ schema.name }}
            id_key = None
            uid = None
        else:
            id_key = self.__id_key__
            uid = self.__uid__

        representation = {
            {%- for attr in schema.attributes %}
            {%- if attr.name == "type" %}
            "type": self.__template_type__,
            {%- else %}
            "{{ attr.original_name }}": self._get_representation(self, "{{ get_name(attr) }}", include_defaults),
            {%- endif %}
            {%- endfor %}
        }
        if id_key and uid:
            representation[id_key] = uid
        if not include_defaults:
        {%- if schema.attributes.has_attributes %}
            def _get(attr, name: str):
                if isinstance(attr, dict):
                    if name in attr:
                        return attr[name]
                    attr = {{ get_type(schema, "attributes") }}.from_dict(attr)
                return getattr(attr, self._to_snake_case(name))
            defaults = {}
            for attr in {{ get_type(schema, "attributes") }}.attributes:
                try:
                    defaults[_get(attr, "name")] = _get(attr, "default")
                except AttributeError:
                    continue
            representation["attributes"] = [
                {
                    key: value for key, value in attr.items()
                    if key not in defaults or value != defaults[key]
                } for attr in representation['attributes']
            ]
        {%- else %}
            attributes = [{{ get_type(schema, "attributes") }}.from_dict(definition) for definition in self.attributes]
            defaults = {attr.name: attr.default for attr in attributes}
            if id_key:
                defaults[id_key] = uid
            representation = {
                key: value
                for key, value in representation.items()
                if value != defaults[key]
            }
        {%- endif %}
        return representation
{% else %}
    def to_dict(self=None, *, include_defaults: bool = True):
        # Hack to be able to call `to_dict()` of a class instance
        if self is None:
            self = {{ schema.name }}
        return {
            self._get_original_key_name(key): self._get_representation(self, key, include_defaults)
            for key in self.keys()
        }

    def __new__(cls, *args, **kwargs):
        instance = {{ type_name(schema.type) }}(**{
        {%- for key, value in schema.items() if not is_internal(schema, key) %}
            "{{ to_snake_case(key) }}": {% if value is string %}"{{ value }}"{% else %}{{ value }}{% endif %},
        {%- endfor %}
        })
        {%- if schema.selected -%}
        instance.selected = args[0]
        {%- endif %}
        return instance
{% endif %}
    @classmethod
    def _get_representation(cls, item, key: str = None, include_defaults: bool = True):
        from domain_classes.dto import DTO

        if key:
            value = getattr(item, key)
            if hasattr(item, f"_{key}") and not isinstance(value, str):
                # Hack to avoid circular references
                value = getattr(item, f"_{key}")
        else:
            value = item

        if isinstance(value, list):
            return [cls._get_representation(val, include_defaults=include_defaults) for val in value]
        elif isinstance(value, dict):
            return {self._get_original_key_name(key): cls._get_representation(val, include_defaults=include_defaults) for key, val in value.items()}
        elif callable(value):
            value = value()
        elif isinstance(value, DTO):
            value = {**value.data.to_dict(include_defaults=include_defaults), "uid": value.uid}
        try:
            value = value.to_dict(include_defaults=include_defaults)
        except AttributeError:
            pass
        return value

    def keys(self):
        return [key for key in dir(self) if not key.startswith("-")]

    @classmethod
    def from_dict(cls, adict):
        id_keys = ["_id", "id", "uid"]
        # FIXME: adict may not be a dict...
        if not isinstance(adict, dict):
            adict = adict.to_dict()
        # TODO: Deal with the case where `id` is part of the legal attributes of the blueprint
        is_dto = any(key in id_keys for key in adict.keys())
        kwargs = {
            f"{cls._to_snake_case(key)}": value
            for key, value in adict.items()
            if key not in id_keys
        }
        # TODO: Add keys that are not given, but can be inferred
        model = cls(**kwargs)
        if is_dto:
            uid = None
            id_key = None
            for key in id_keys:
                try:
                    uid = adict[key]
                    id_key = key
                except KeyError:
                    pass
            if uid and id_key:
                model.__id_key__ = id_key
                model.__uid__ = uid
        return model

    @staticmethod
    def _to_snake_case(value: str) -> str:
        return stringcase.snakecase(value)

    @property
    def __completed__(self):
        return True

    @property
    def _original_key_names(self) -> Dict[str, str]:
        if not hasattr(self, "__original_key_names"):
            self.__original_key_names = {to_snake_case(key): key for key in self.__schema__.keys()}
        return self.__original_key_names

    def _get_original_key_name(self, key: str) -> str:
        return self._original_key_names[key]

{% endblock %}
    __code_generation: str = {{ compress(self.code_generation()) }}
{% block code_generation  %}
    __imports: str = {{ compress(self.imports()) }}
    __definition: str = {{ compress(self.definition()) }}
    __dmt_dependencies: List[str] = [
        {{ compress(get_dto(), indent=3) }},
    ]

    @staticmethod
    def __dependencies__() -> List[type]:
        return {{ get_dependencies(schema) }}

    @classmethod
    def __circular_dependencies__(cls) -> Set[type]:
        def find_circle(blueprint) -> Tuple[bool, Optional[type], Set[type]]:
            accessed = set()
            dependencies = blueprint.__dependencies__()
            found = False
            node_in_circle = None
            while len(dependencies) > 0 and not found:
                dependency = dependencies.pop()
                if dependency in accessed:
                    found = True
                    node_in_circle = dependency
                else:
                    accessed.add(dependency)
                    dependencies.extend([dep for dep in dependency.__dependencies__() if dep is not dependency])
            return found, node_in_circle, accessed

        _found, _node_in_circle, _ = find_circle(cls)

        if not _found and _node_in_circle is not None:
            return set()

        _, _, accessed = find_circle(_node_in_circle)
        return accessed

    @classmethod
    def __has_circular_dependencies__(cls) -> bool:
        if cls in (circle := cls.__circular_dependencies__()):
            if len(circle) == 1:
                # The blueprint is self-referential, which is fine
                return False
            return True
        return False

    @classmethod
    def __code__(
        cls,
        include_dependencies: bool = False,
        format_code=False,
        include_imports: bool = True,
        include_import_of_other_blueprints=False,
        include_code_generation: bool = False,
        keep_dmt_imports: bool = False,
        _included_dependencies: Optional[Set[type]] = None,
    ) -> str:
        import zlib

        def decompress(data: bytes) -> str:
            data = base64.b85decode(data)
            return zlib.decompress(data).decode("UTF-8")

        definition = ""
        remove_dto_imports = False
        if include_imports:
            definition += decompress(cls.__imports)
            if include_dependencies and not keep_dmt_imports:
                remove_dto_imports = True
                for dependency in cls.__dmt_dependencies:
                    definition += decompress(dependency)
        if include_dependencies:
            if _included_dependencies is None:
                _included_dependencies = set()
            for dependency in cls.__dependencies__():
                if dependency in _included_dependencies:
                    continue
                _included_dependencies.add(dependency)
                definition += dependency.__code__(
                    include_dependencies=True,
                    format_code=False,
                    include_imports=False,
                    _included_dependencies=_included_dependencies,
                )
        elif include_import_of_other_blueprints:
            type_mapping = {{ get_type_mapping(schema) }}
            for dependency in cls.__dependencies__():
                template_type = type_mapping[dependency]
                import_path = (
                    template_type
                        .replace("/", ".")
                        .replace("-", "_")
                )
                if dependency is not cls:
                    definition += f"\\nfrom {import_path} import {dependency.__name__}"
        definition += decompress(cls.__definition)
        if include_code_generation:
            def format_long_line(data: str, indent: int) -> str:
                ''' A copy of the method of the same name above '''
                line_length = ({{ get_project_line_length() }} - (4 * indent + 3))
                lines = []
                index, n = 0, len(data)
                while index < n:
                    end = index + line_length
                    lines.append(data[index:min(end, n)])
                    index = end
                data = str(tuple(lines)).replace(",", "")
                return data
            definition += f"    __code_generation: str = {format_long_line(cls.__code_generation, indent=2)}"
            definition += decompress(cls.__code_generation)
        if remove_dto_imports:
            for import_ in [
                "from domain_classes.dto import DTO",
            ]:
                definition = definition.replace(import_, "")
        if format_code:
            import black
            config = black.FileMode(
                line_length={{ get_project_line_length() }},
            )
            definition = black.format_str(definition, mode=config)
        return definition
{% endblock %}

"""
        )
        for macro in macros:
            class_template.globals[macro.__name__] = macro
        return class_template

    def _process_attributes(self, schema: Dict[str, Any]) -> Attributes:
        attributes: List[Dict[str, str]] = schema["attributes"]
        attribute_definition = self._get_attribute_definition(schema)
        _attributes = Attributes()

        _names = set()
        for attribute in attributes:
            attribute_name = attribute["name"]
            if attribute_name in _names:
                raise ValueError(
                    f"The attribute '{attribute_name}', id defined multiple times, for the blueprint {schema['name']}"
                )
            _names.add(attribute_name)
            attribute_type = attribute["attribute_type"]
            if attribute_type not in self._types:
                self._create(attribute_type, False)
            attribute_type = self._types[attribute_type]
            if attribute_name == "type":
                attribute = copy.copy(attribute)
                attribute["optional"] = "true"
                attribute["default"] = ""
            _attributes.add(
                Attribute(
                    attribute,
                    type=self.get_type_by_name(attribute["type"]),
                    attribute_type=attribute_type,
                    definition=attribute_definition,
                    original_name=attribute_name,
                )
            )
        return _attributes

    def _get_attribute_definition(self, schema) -> Dict[str, Any]:
        attribute = None
        for attr in schema.get("attributes", []):
            if attr["name"] == "attributes":
                attribute = attr
                break
        if attribute:
            return self._get_schema(attribute["type"])
        else:
            return self._get_attribute_definition(self._get_schema(schema["type"]))

    def write_domain(self, template_type: str, overwrite: bool = True) -> None:
        module: Path = Path(__file__).parent / Config.DYNAMIC_MODELS
        if not module.exists():
            os.mkdir(str(module.absolute()))
        self.dump_site = str(module / "__init__.py")
        if overwrite:
            with open(self.dump_site, "w") as f:
                f.writelines(
                    """\
# flake8: noqa
'''
THIS FILE IS AUTOMATICALLY GENERATED.
ANY CHANGES MADE TO THIS FILE, SHOULD BE DONE IN `applications.domain.schema`
To regenerate this file, run `doit create:system:blueprints`
'''
from __future__ import annotations
from typing import List, Optional, Union, Any, Set, Tuple
import stringcase
import json
base64
from domain_classes.dto import DTO
"""
                )
        return self.create(template_type, _create_instance=False)

    def type_name(self, attr: Union[Attribute, str, type]) -> str:
        if isinstance(attr, str):
            return self.get_type_by_name(attr).__name__
        elif isinstance(attr, type):
            return attr.__name__
        return attr.attribute_type.__name__

    def type_check(self, attr: Attribute, value_name: str, dimension: Optional[int] = None) -> str:
        type_name = self.type_name(attr)
        if attr.is_list:
            dimensions = attr.dimensions.split(",")
            if dimension is None:
                dimension = len(dimensions)
            counter_name = f"val_dim_{dimension}"
            if dimension == 1:
                cast = f"isinstance({counter_name}, {type_name})"
            else:
                cast = self.type_check(attr, f'{f"{counter_name}"}', dimension - 1)
            check = f"isinstance({value_name}, list) and all({cast} for {counter_name} in {value_name})"
        elif attr.type not in simple_types:
            check = (
                f"("
                f"isinstance({value_name}, {type_name})"
                f"or ("
                f"isinstance({value_name}, DTO) "
                f"and isinstance({value_name}.data, {type_name})"
                f")"
                f")"
            )
        else:
            check = f"isinstance({value_name}, {type_name})"
        return f"({check})"

    def type_annotation(self, attr: Attribute, may_be_dict: bool = False) -> str:
        annotation = f"{self.type_name(attr)}"
        if attr.type not in simple_types:
            annotation = f"Union[{annotation}, DTO[{annotation}]{', Dict[str, Any]' if may_be_dict else ''}]"
        if attr.is_list:
            annotation = f"List[{annotation}]"
        if attr.optional:
            annotation = f"Optional[{annotation}]"
        return annotation

    def get_type_by_name(self, name: str) -> type:
        if name not in self._types:
            self.to_be_compiled.add(name)
            return self._create(name, compile=False)
        return self._types[name]

    def get_dependencies(self, schema) -> str:
        return f"[{', '.join(dep.__name__ for dep in self._get_dependencies(schema))}]"

    def _get_dependencies(self, schema: dict) -> List[__Blueprint__]:
        dependencies = []
        if (parent := self.get_type_by_name(schema["type"])).__name__ != schema["name"]:
            dependencies.append(parent)
        for attr in schema.get("attributes", []):
            for item in ["type", "attribute_type"]:
                try:
                    # noinspection PyDeepBugsSwappedArgs
                    _type = getattr(attr, item)
                except AttributeError:
                    _type = self.get_type_by_name(attr[item])
                if not is_simple_type(_type) and _type not in dependencies:
                    dependencies.append(_type)
        return dependencies

    @staticmethod
    def get_escaped_default(attr: Attribute) -> str:
        if attr.default is not None:
            if attr.attribute_type is str:
                return f'"{attr.default}"'
            elif isinstance(attr.default, str):
                if attr.attribute_type is bool:
                    return {"false": "False", "true": "True", "": "False"}[attr.default.lower()]
        if attr.default == "" and not is_simple_type(attr.attribute_type):
            return str(None)
        return attr.default

    def get_default_value(self, attr: Attribute) -> Optional[str]:
        if attr.optional:
            return None
        if attr.type in simple_types or attr.default is None:
            return self.get_escaped_default(attr)
        if isinstance(attr.default, str):
            # These default values must be dealt with separately
            return None
        return f"{self.type_name(attr)}('''{attr.default}''')"

    def get_type_mapping(self, schema) -> str:
        lookup = self._types.lookup_table
        mapping = {dependency.__name__: lookup[dependency] for dependency in self._get_dependencies(schema)}
        representation = "{"
        for type_name, template_type in mapping.items():
            representation += f"{type_name}: '{template_type}',"
        representation += "}"
        return representation

    def variable_annotation(self, attr: Attribute) -> str:
        return f"{get_name(attr)}: {self.type_annotation(attr)}" + (
            f" = {self.get_default_value(attr)}" if attr.optional or attr.has_default else ""
        )

    def signature(self, attributes: Attributes) -> str:
        return f"{', '.join(self.variable_annotation(attr) for attr in attributes)}"

    def cast_as(self, attr: Attribute, name: Optional[str] = None) -> str:
        if name is None:
            name = get_name(attr)
        return f"{self.type_name(attr)}{'.from_dict' if attr.attribute_type not in simple_types else ''}({name})"

    def cast(self, attr: Attribute, name: Optional[str] = None, dimension: Optional[int] = None) -> str:
        if not attr.cast:
            if name is not None:
                return name
            return get_name(attr)
        if attr.is_list:
            dimensions = attr.dimensions.split(",")
            if dimension is None:
                dimension = len(dimensions)
                value_name = get_name(attr) if name is None else name
            else:
                value_name = f"val_dim_{dimension}"
            if dimension == 1:
                return f"self.{get_name_of_list_class(attr)}({self.cast_as(attr, 'val')} for val in {value_name})"
            else:
                counter_name = f"val_dim_{dimension - 1}"
                return f"self.{get_name_of_list_class(attr)}({self.cast(attr, f'{counter_name}', dimension - 1)} for {counter_name} in {value_name})"
        return f"{self.cast_as(attr, name)}"

    def compile(self, schema: Dict) -> __Blueprint__:
        definition = self.class_from_schema(schema)
        name = schema["name"]
        path = f"<string/{name}>"
        if Config.FLASK_DEBUG:
            where = ".generated"
            if not Path(where).exists():
                os.mkdir(where)
            path = f"{where}/{name}.py"
            with open(path, "w") as f:
                f.write(definition)
        if self.dump_site is not None:
            with open(self.dump_site, "a+") as f:
                f.write(remove_imports(definition))
        code: CodeType = compile(definition, path, "exec", optimize=1)
        exec(code)  # nosec
        cls: __Blueprint__ = locals()[name]
        if cls.__name__ not in globals():
            globals()[cls.__name__] = cls
        return cls

    @classmethod
    def from_dict(cls, schema: Dict):
        """TODO: Function similarly to create, but without "self.blueprints" """
        pass

    def create(
        self, template_type: str, _create_instance: bool = False, compile: bool = True, write_domain: bool = False
    ) -> Optional[__Blueprint__]:
        if write_domain:
            return self.write_domain(template_type)
        try:
            cls = self._types[template_type]
            if not cls.__completed__:
                raise KeyError
            return cls
        except KeyError:
            Template = self._create(template_type, _create_instance, compile)
            for template_type in self.to_be_compiled:
                self._create(template_type, _create_instance)
            return Template

    def create_from_schema(self, schema: dict, template_type: str) -> __Blueprint__:
        Template = self._create_from_schema(schema, template_type)
        for template_type in self.to_be_compiled:
            self._create(template_type)
        return Template

    def _create(self, template_type: str, _create_instance: bool = False, compile: bool = True) -> __Blueprint__:
        return self._create_from_schema(self._get_schema(template_type), template_type, _create_instance, compile)

    def _create_from_schema(
        self, schema: dict, template_type: str, _create_instance: bool = False, compile: bool = True
    ) -> __Blueprint__:
        if template_type in self._types and (_cls := self._types[template_type]).__completed__:
            return _cls
        schema = snakify(schema)
        # Let at "dummy type" be available for others
        _cls = self._create_dummy(schema, template_type)
        schema["__raw__"] = self._blueprints[template_type]
        schema["__class__"] = _cls
        schema["__template_type__"] = template_type
        if not compile:
            return _cls
        if "attributes" in schema:
            schema["__attributes__"] = schema["attributes"]
            schema["attributes"] = self._process_attributes(schema)
        _cls = self.compile(schema)
        self._types[template_type] = _cls
        try:
            if isinstance(_cls.type, str) and _cls.type not in self._types:
                self._create(_cls.type, _create_instance)
        except AttributeError:
            pass
        if _create_instance:
            schema = self._get_schema(template_type)  # Get a fresh one, as the previous may have been altered
            return _cls.type.from_dict(schema)
        return _cls

    @staticmethod
    def bind_method(instance, func, as_name: Optional[str] = None):
        """Borrowed from StackOverflow; https://stackoverflow.com/a/1015405/4414141"""
        if as_name is None:
            as_name = func.__name__
        bound_method = func.__get__(instance, instance.__class__)
        setattr(instance, as_name, bound_method)
        return bound_method

    @staticmethod
    def add_to_package(instance):
        """TODO: Implement ability to create / add the class to a dynamic module"""
        pass

    def get_type(self, schema: Union[Dict, type], name: str) -> str:
        template_type = _get_definition(schema, name)
        if template_type:
            return self.type_name(template_type)
        template_type = get_attribute(schema, attribute="type")
        Template = self.get_type_by_name(template_type)
        if has_attribute(Template, "attributes"):
            for attr in get_attribute(Template, attribute="attributes"):
                if to_snake_case(get_attribute(attr, "name")) == to_snake_case(name):
                    template_type = get_attribute(attr, "attribute_type")
                    if isinstance(template_type, str) and template_type not in self._types:
                        self._create(template_type)
                    return self.type_name(template_type)
        return self.get_type(Template, name)

    def _create_dummy(self, schema: dict, template_type: str) -> __Blueprint__:
        if template_type not in self._types:
            _cls: __Blueprint__ = type(schema["name"], (), schema)
            _cls.__schema__ = schema
            _cls.__completed__ = False
            _cls.__template_type__ = template_type
            self._types.lookup_table[_cls] = template_type
            self._types[template_type] = _cls
        return self._types[template_type]
