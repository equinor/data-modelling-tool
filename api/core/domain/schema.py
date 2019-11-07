from __future__ import annotations

import hashlib
import hmac
import os
from collections.abc import Iterable
from pathlib import Path
from types import CodeType
from typing import Any, Callable, Dict, List, Optional, TypeVar, Union

import stringcase
from jinja2 import Template

from classes.data_source import DataSource, get_client
from config import Config
from core.repository.interface.document_repository import DocumentRepository

T = TypeVar("T")

simple_types: List[type] = [str, bool, int, float]


def has_attribute(schema, name: str) -> bool:
    has = False
    try:
        schema[name]
        has = True
    except (KeyError, TypeError):
        try:
            getattr(schema, name)
            has = True
        except AttributeError:
            pass
    return has


def get_attribute(attr, item: str, use_default: bool = False, default=None) -> str:
    try:
        return getattr(attr, item)
    except AttributeError:
        if use_default or default is not None:
            return attr.get(item, default)
        return attr[item]


def _get_definition(schema: Union[Dict, type], name: str) -> Optional[str]:
    attributes = get_attribute(schema, name, default=False)
    if attributes and isinstance(attributes, Iterable):  # E.g. not the `values` method on a dictionary
        for attr in attributes:
            if not any(isinstance(attr, type) for type in simple_types) and get_attribute(attr, "name") == name:
                return get_attribute(attr, "type")
    return None


def is_simple_type(element) -> bool:
    if isinstance(element, object):
        return type(element) in simple_types
    return element in simple_types


def get_simple_types() -> str:
    return f"[{', '.join(type_.__name__ for type_ in simple_types)}]"


def get_unprocessed(schema: Dict[str, Any]) -> Dict:
    _schema = {}
    for key, value in schema.items():
        if f"__{key}__" not in schema:
            if isinstance(value, dict):
                value = get_unprocessed(value)
            elif isinstance(value, type):
                value = get_unprocessed(value.__schema__)
            _schema[key.strip("__")] = value
    return _schema


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


def to_camel_case(name: str) -> str:
    return stringcase.camelcase(name)


def is_internal(schema, key: str) -> bool:
    return key.startswith("__") and key.endswith("__") and key.strip("__") in schema


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
    def __init__(self, data: Dict[str, Any], type: type):
        self.type = type
        self.__values__ = data

    def __repr__(self):
        attributes = ["name", "optional", "default", "contained"]

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
        return self._get("dimensions", "").strip("\"'") == "*"

    @property
    def default(self):
        return self._get("default", None)

    @property
    def cast(self):
        if self.name in ["type"]:
            return False
        return True

    @property
    def enum_type(self):
        enum_type = self._get("enum_type", None)
        return enum_type

    @property
    def optional(self):
        return self._get("optional", False)

    def _get(self, name, default=None):
        return self.__values__.get(name, default)


class Attributes:
    def __init__(self):
        self._attributes: List[Attribute] = []

    def add(self, attribute: Attribute):
        self._attributes.append(attribute)

    @property
    def required(self):
        return self._filter(lambda attr: not attr.optional)

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


def remove_imports(definition: str) -> str:
    return "\n".join(
        line for line in definition.split("\n") if not any(line.startswith(word) for word in ["from", "import"])
    )


def basic_types() -> Dict[str, type]:
    return {"string": str, "boolean": bool, "integer": int, "number": float}


TypeMapping = Dict[str, type]


class TypeCache:
    def __init__(self, permanent: TypeMapping, fleeting: Optional[TypeMapping] = None):
        self._permanent = permanent
        self._fleeting = fleeting or {}
        self._static = basic_types()

    def __getitem__(self, item: str) -> type:
        if self._is_template_internal(item):
            return self._permanent[item]
        elif self._is_static(item):
            return self._static[item]
        else:
            return self._fleeting[item]

    def __setitem__(self, key: str, value: type):
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
        template_repository: DocumentRepository,
        _create_instance: bool = False,
        dump_site: Optional[str] = None,
        read_from_file: bool = False,
    ):
        self._types = TypeCache(self._internal_types)
        self._template_repository = template_repository
        self._read_from_file = read_from_file
        self._create_instance = _create_instance
        self.dump_site = dump_site
        self.macros = [
            self.type_name,
            self.type_annotation,
            self.signature,
            unpack_if_not_simple,
            get_name,
            self.variable_annotation,
            to_snake_case,
            to_camel_case,
            self.cast_as,
            self.cast,
            self.get_type,
            get_unprocessed,
            is_internal,
            extract_casting,
            snakify,
            is_simple_type,
            get_simple_types,
            self.type_check,
            get_name_of_list_class,
            get_name_of_metaclass,
        ]
        self.to_be_compiled = set()

    @classmethod
    def reset_cache(cls):
        del cls._internal_types
        cls._internal_types = {}
        cls._types = TypeCache(cls._internal_types)

    def _get_schema(self, template_type: str) -> dict:
        if self._read_from_file:
            return self._template_repository.find({"type": template_type})
        else:
            data_source_id, *_, name = template_type.split("/")
            repository = self._template_repository.__class__(get_client(DataSource(data_source_id)))
            return repository.find(filter={"name": name}, raw=True)

    # noinspection GrazieInspection
    def class_from_schema(self, schema):
        # with open(f'{Path(__file__).parent}/schema.jinja2') as f:
        #     template = "\n".join(f.readlines())
        class_template = Template(
            """\
from __future__ import annotations
from typing import List, Optional, Union, Any
import stringcase
from core.domain.dto import DTO


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
            super().__init__(*args, **kwargs)

        def append(self, item):
            item = {{ cast_as(attr, "item") }}
            super().append(item)

        def to_dict(self):
            return [el.to_dict() if hasattr(el, "to_dict") else el for el in self]
    {%- endif %}
    {%- endfor %}

    def __init__(self, {{ signature(schema.attributes) }}):
        {%- for attr in schema.attributes %}
        {%- set name = get_name(attr) %}
        {%- if attr.is_list and attr.optional %}

        if {{ name }} is None:
            {{ name }} = {{ custom_list_name }}()
        {{ name }} = {{ cast(attr) }}
        {%- elif attr.optional %}

        if {{ name }} is not None:
            {{ name }} = {{ cast(attr) }}
        {%- else %}

        {{ name }} = {{ cast(attr) }}
        {%- endif %}
        self.{{ name }} = {{ name }}
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

    @property
    def __schema__(self):
        return {{ get_unprocessed(schema) }}
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
        {% if attr.cast -%}
        from core.domain.dto import DTO
        {%- if attr.is_list %}
        if isinstance(value, list) and all(isinstance(element, dict) for element in value):
        {%- else %}
        if isinstance(value, dict):
        {%- endif %}
            # TODO: Fill in missing keys, if they can be obtained
            # E.g. `self.type`
            value = {{ cast(attr, "value") }}
        {% if attr.is_list -%}
        if not (isinstance(value, list) and all({{ type_check(attr, "val") }} for val in value)):
        {%- else -%}
        if not ({{ type_check(attr, "value") }}):
        {%- endif %}
            {%- if attr.optional %}
            if value is not None:
                raise ValueError
            {%- else %}
            raise ValueError
            {% endif %}
        {%- endif %}
        self._{{ get_name(attr) }} = value
    {%- endfor %}

    def to_dict(self=None):
        from core.domain.dto import DTO
        # Hack to be able to call `to_dict()` of a class instance
        if self is None:
            self = {{ schema.name }}

        def get_representation(item, key: str = None):
            if key:
                value = getattr(item, key)
                if hasattr(item, f"_{key}") and not isinstance(value, str):
                    # Hack to avoid circular references
                    value = getattr(item, f"_{key}")
            else:
                value = item

            if isinstance(value, list):
                return [get_representation(val) for val in value]
            elif isinstance(value, dict):
                return {self._to_camel_case(key): get_representation(val) for key, val in value.items()}
            elif callable(value):
                value = value()
            elif isinstance(value, DTO):
                value = {**value.data.to_dict(), "uid": value.uid}
            try:
                value = value.to_dict()
            except AttributeError:
                pass
            return value

        return {
            {%- for attr in schema.attributes %}
            "{{ to_camel_case(attr.name) }}": get_representation(self, "{{ get_name(attr) }}"),
            {%- endfor %}
        }
{% else %}
    def __new__(cls, *args, **kwargs):
        instance = {{ type_name(schema.type) }}(**{
        {%- for key, value in schema.items() %}
            "{{ to_snake_case(key) }}": {% if value is string %}"{{ value }}"{% else %}{{ value }}{% endif %},
        {%- endfor %}
        })
        {%- if schema.selected -%}
        instance.selected = args[0]
        {%- endif %}
        return instance
{% endif %}
    @classmethod
    def from_dict(cls, adict):
        from core.domain.dto import DTO
        id_keys = ["_id", "id", "uid"]
        is_dto = any(key in id_keys for key in adict.keys())
        kwargs = {
            f"{cls._to_snake_case(key)}": value
            for key, value in adict.items()
            if key not in id_keys
        }
        model = cls(**kwargs)
        if is_dto:
            uid = None
            for key in id_keys:
                try:
                    uid = adict[key]
                except KeyError:
                    pass
            model = DTO(model, uid=uid)
        return model

    @staticmethod
    def _to_snake_case(value: str) -> str:
        return stringcase.snakecase(value)

    @staticmethod
    def _to_camel_case(value: str) -> str:
        return stringcase.camelcase(value)

"""
        )
        for macro in self.macros:
            class_template.globals[macro.__name__] = macro
        return class_template.render(schema=schema)

    def _process_attributes(self, attributes: List[Dict[str, str]]) -> Attributes:
        _attributes = Attributes()

        for attribute in attributes:
            attribute_type = attribute["type"]
            if attribute_type not in self._types:
                self._create(attribute_type, False)
            attribute_type = self._types[attribute_type]
            _attributes.add(Attribute(attribute, type=attribute_type))
        return _attributes

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
from __future__ import annotations
from typing import List, Optional, Union, Any
import stringcase
from core.domain.dto import DTO
"""
                )
        return self.create(template_type, _create_instance=False)

    def type_name(self, attr: Union[Attribute, str, type]) -> str:
        if isinstance(attr, str):
            return self.get_type_by_name(attr).__name__
        elif isinstance(attr, type):
            return attr.__name__
        return attr.type.__name__

    def type_check(self, attr: Attribute, value_name: str) -> str:
        type_name = self.type_name(attr)
        check = ""
        if attr.type not in simple_types:
            check = f"(isinstance({value_name}, DTO) and isinstance({value_name}.data, {type_name}))"
        check = f"{f'{check} or ' if check else ''}isinstance({value_name}, {type_name})"
        return check

    def type_annotation(self, attr: Attribute, may_be_dict: bool = False) -> str:
        annotation = f"{self.type_name(attr)}"
        if attr.type not in simple_types:
            annotation = f"Union[{annotation}, DTO[{annotation}]{', Dict[str, Any]' if may_be_dict else ''}]"
        if attr.is_list:
            annotation = f"List[{annotation}]"
        if attr.optional:
            annotation = f"Optional[{annotation}]"
        return annotation

    def get_type_by_name(self, name: str):
        if name not in self._types:
            self.to_be_compiled.add(name)
            return self._create(name, compile=False)
        return self._types[name]

    def get_default_value(self, attr: Attribute) -> str:
        if attr.type in simple_types or attr.default is None:
            if attr.default is not None:
                if attr.type is str:
                    return f'"{attr.default}"'
                elif isinstance(attr.default, str):
                    if attr.type is bool:
                        return {"false": False, "true": True}[attr.default.lower()]
            return attr.default
        return f"{self.type_name(attr)}('''{attr.default}''')"

    def variable_annotation(self, attr: Attribute) -> str:
        return f"{get_name(attr)}: {self.type_annotation(attr)}" + (
            f" = {self.get_default_value(attr)}" if attr.optional else ""
        )

    def signature(self, attributes: List[Attribute]) -> str:
        return f"{', '.join(self.variable_annotation(attr) for attr in attributes)}"

    def cast_as(self, attr: Attribute, name: Optional[str] = None) -> str:
        if name is None:
            name = get_name(attr)
        return f"{self.type_name(attr)}{'.from_dict' if attr.type not in simple_types else ''}({name})"

    def cast(self, attr: Attribute, name: Optional[str] = None) -> str:
        if not attr.cast:
            if name is not None:
                return name
            return get_name(attr)
        if attr.is_list:
            return f"self.{get_name_of_list_class(attr)}({self.cast_as(attr, 'val')} for val in {get_name(attr) if name is None else name})"
        return f"{self.cast_as(attr, name)}"

    def compile(self, schema: Dict) -> type:
        definition = self.class_from_schema(schema)
        if self.dump_site is not None:
            with open(self.dump_site, "a+") as f:
                f.write(remove_imports(definition))
        code: CodeType = compile(definition, f"<string/{schema['name']}>", "exec", optimize=1)
        exec(code)  # nosec
        cls: type = locals()[schema["name"]]
        if cls.__name__ not in globals():
            globals()[cls.__name__] = cls
        return cls

    @classmethod
    def from_dict(cls, schema: Dict):
        """ TODO: Function similarly to create, but without "self.template_repository" """
        pass

    def create(
        self, template_type: str, _create_instance: bool = False, compile: bool = True, write_domain: bool = False
    ):
        if write_domain:
            return self.write_domain(template_type)
        try:  # FIXME: Deal with the (real) possibility of the type not being fully formed (`type(<name>, (), schema)`
            return self._types[template_type]
        except KeyError:
            Template = self._create(template_type, _create_instance, compile)
            for template_type in self.to_be_compiled:
                self._create(template_type, _create_instance)
            return Template

    def _create(self, template_type: str, _create_instance: bool = False, compile: bool = True):
        schema = snakify(self._get_schema(template_type))
        # Let at "dummy type" be available for others
        _cls = type(schema["name"], (), snakify(schema))
        if not compile:
            return _cls
        self._types[template_type] = _cls
        if "attributes" in schema:
            schema["__attributes__"] = schema["attributes"]
            schema["attributes"] = self._process_attributes(schema["attributes"])
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
        template_type = get_attribute(schema, "type")
        Template = self.get_type_by_name(template_type)
        if has_attribute(Template, "attributes"):
            for attr in get_attribute(Template, "attributes"):
                if to_snake_case(get_attribute(attr, "name")) == to_snake_case(name):
                    template_type = get_attribute(attr, "type")
                    if isinstance(template_type, str) and template_type not in self._types:
                        self._create(template_type)
                    return self.type_name(template_type)
        return self.get_type(Template, name)
