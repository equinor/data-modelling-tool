from __future__ import annotations

import os
from collections import Iterable
from dataclasses import dataclass
from pathlib import Path
from types import CodeType
from typing import Any, Dict, List, Optional, TypeVar, Union

import stringcase
from jinja2 import Template

from classes.data_source import DataSource, get_client
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


def get_unprocessed(schema: Dict) -> Dict:
    return {
        key.strip("__"): get_unprocessed(value) if isinstance(value, dict) else value
        for key, value in schema.items()
        if f"__{key}__" not in schema
    }


def unpack_if_not_simple(value: str, _type: type) -> str:
    unpack = ""
    if _type not in simple_types:
        unpack = "**"
    return f"{unpack}{value}"


def get_name(attr: Attribute) -> str:
    return to_snake_case(attr.name)


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


@dataclass(frozen=True)
class Attribute:
    type: type
    default: Any
    optional: bool
    is_list: bool
    cast: bool
    __values__: Dict

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
    def has_attributes(self):
        return any(attribute.name == "attributes" for attribute in self)


def remove_imports(definition: str) -> str:
    return "\n".join(
        line for line in definition.split("\n") if not any(line.startswith(word) for word in ["from", "import"])
    )


class Factory:
    _types: Dict[str, type] = {"string": str, "boolean": bool, "integer": int, "number": float}

    def __init__(
        self,
        template_repository: DocumentRepository,
        _create_instance: bool = False,
        dump_site: Optional[str] = None,
        read_from_file: bool = False,
    ):
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
        ]
        self.to_be_compiled = set()

    def _get_schema(self, template_type: str) -> dict:
        if self._read_from_file:
            return self._template_repository.find({"type": template_type})
        else:
            data_source_id, *_, name = template_type.split("/")
            repository = self._template_repository.__class__(get_client(DataSource(data_source_id)))
            return repository.find(filter={"name": name}, raw=True)

    def class_from_schema(self, schema):
        # with open(f'{Path(__file__).parent}/schema.jinja2') as f:
        #     template = "\n".join(f.readlines())
        class_template = Template(
            """\
from __future__ import annotations
from typing import List, Optional, Union
import stringcase


class {{ schema.name }}Template(type):
    def __new__(metacls, name, bases, attrs):
        cls = type(name, bases, attrs)
        {%- for key, value in schema.items() if not is_internal(schema, key) %}
        {%- set variable_name = to_snake_case(key) %}

        {%- if variable_name == "type" %}

        cls._type = "{{ schema.type }}"

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


class {{ schema.name }}(metaclass={{ schema.name }}Template):
{%- if schema.attributes %}
    def __init__(self, {{ signature(schema.attributes) }}):
        {%- for attr in schema.attributes %}
        {%- set name = get_name(attr) %}
        {%- if attr.is_list and attr.optional %}

        if {{ name }} is None:
            {{ name }} = []
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

    def __new__(cls, {{ signature(schema.attributes) }}):
        # TODO?: Implement / move explicit properties to be dynamically generated.
        instance = super({{ schema.name }}, cls).__new__(cls)
        return instance
    {%- endif %}

    {% for attr in schema.attributes %}
    @property
    def {{ get_name(attr) }}(self) -> {{ type_annotation(attr) }}:
        return self._{{ get_name(attr) }}

    @{{ get_name(attr) }}.setter
    def {{ get_name(attr) }}(self, value: {{ type_annotation(attr) }}):
        {% if attr.cast -%}
        {% if attr.is_list -%}
        if not (isinstance(value, list) and all(isinstance(val, {{ type_name(attr) }}) for val in value)):
        {%- else -%}
        if not isinstance(value, {{ type_name(attr) }}):
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

    @classmethod
    def from_dict(cls, adict):
        _type = adict.get("type", cls._type)
        if cls._type != _type:
            raise ValueError(f"The given type, {_type}, does not match the class' type, {cls._type}")
        kwargs = {
            f"{cls._to_snake_case(key)}": value
            for key, value in adict.items()
        }
        return cls(**kwargs)
{% else %}
    def __new__(cls, *args, **kwargs):
        instance = {{ type_name(schema.type) }}(**{
        {%- for key, value in schema.items() %}
            {%- if key not in ['type'] %}
            "{{ to_snake_case(key) }}": {% if value is string %}"{{ value }}"{% else %}{{ value }}{% endif %},
            {%- endif %}
        {%- endfor %}
        })
        {%- if schema.selected -%}
        instance.selected = args[0]
        {%- endif %}
        return instance
{% endif %}
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
            # TODO: Implement logic for dimensions
            is_optional = attribute.get("optional", False)
            name = attribute["name"]
            cast = True
            if name in ["type"]:
                cast = False
            default = attribute.get("default", None)
            is_list = attribute.get("dimensions", "").strip("\"'") == "*"
            attribute_type = attribute["type"]
            if attribute_type not in self._types:
                self._create(attribute_type, False)
            attribute_type = self._types[attribute_type]
            attribute = Attribute(
                type=attribute_type,
                optional=is_optional,
                default=default,
                is_list=is_list,
                cast=cast,
                __values__=attribute,
            )
            _attributes.add(attribute)
        return _attributes

    def write_domain(self, template_type: str) -> None:
        module: Path = Path(__file__).parent / "dynamic_models"
        if not module.exists():
            os.mkdir(str(module.absolute()))
        self.dump_site = str(module / "__init__.py")
        with open(self.dump_site, "w") as f:
            f.writelines(
                """\
# flake8: noqa
from __future__ import annotations
from typing import List, Optional, Union
import stringcase
"""
            )
        self.create(template_type, _create_instance=False)

    def type_name(self, attr: Union[Attribute, str, type]) -> str:
        if isinstance(attr, str):
            return self.get_type_by_name(attr).__name__
        elif isinstance(attr, type):
            return attr.__name__
        return attr.type.__name__

    def type_annotation(self, attr: Attribute) -> str:
        annotation = f"{self.type_name(attr)}"
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
            if attr.type is str and attr.default is not None:
                return f'"{attr.default}"'
            return attr.default
        return f"{self.type_name(attr)}('{attr.default}')"

    def variable_annotation(self, attr: Attribute) -> str:
        return f"{get_name(attr)}: {self.type_annotation(attr)}" + (
            f" = {self.get_default_value(attr)}" if attr.optional else ""
        )

    def signature(self, attributes: List[Attribute]) -> str:
        return f"{', '.join(self.variable_annotation(attr) for attr in attributes)}"

    def cast_as(self, attr: Attribute, name: Optional[str] = None) -> str:
        if name is None:
            name = get_name(attr)
        return f"{self.type_name(attr)}({unpack_if_not_simple(name, attr.type)})"

    def cast(self, attr: Attribute) -> str:
        if not attr.cast:
            return get_name(attr)
        if attr.is_list:
            return f"[{self.cast_as(attr, 'val')} for val in {get_name(attr)}]"
        return f"{self.cast_as(attr)}"

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

    def create(self, template_type: str, _create_instance: bool = False, compile: bool = True):
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
