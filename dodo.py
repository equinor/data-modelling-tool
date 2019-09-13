import os
from pathlib import Path


def docker_compose(_targets=()):
    return (
        f"docker-compose "
        f"-f docker-compose.yml"
        f"{''.join([f' -f docker-compose.{target}.yml' for target in _targets])}"
    )


def execute(container, command, run=False, include=(), environment=()):
    return (
        f"{docker_compose(include)} "
        f"{'run --rm' if run else 'exec'} "
        f"{''.join([f'-e {env}' for env in environment])}"
        f"{container} "
        f"{command}"
    )


def container_params():
    return [
        {"name": "remote", "long": "remote", "type": bool, "default": False},
        {
            "name": "include",
            "long": "include",
            "short": "f",
            "type": tuple,
            "default": ("override",),
        },
        {
            "name": "environment",
            "long": "environment",
            "short": "e",
            "type": tuple,
            "default": (),
        },
    ]


def task_reset_database():
    def reset(run=False, include=(), environment=""):
        return execute(
            "api",
            "/code/reset-database.sh",
            run=run,
            include=include,
            environment=environment,
        )

    return {"actions": [(reset,)], "params": container_params()}


def task_initialize_ide():
    def initialize(wip_config=False):
        from lxml import etree

        def misc_xml():
            misc_xml_path = Path(".idea/misc.xml")

            if not misc_xml_path.exists():
                with open(misc_xml_path, "a") as f:
                    f.write('<project version="4"></project>')
            with open(misc_xml_path) as f:
                misc = etree.parse(f)
            root = misc.getroot()

            def webpack_config():
                webpack_path = "$PROJECT_DIR$/web/node_modules/react-scripts/config/webpack.config.js"
                config: etree.Element = misc.find(
                    'component/[@name="WebPackConfiguration"]/option'
                )
                if config is None:
                    config = etree.Element(
                        "component", {"name": "WebPackConfiguration"}
                    )
                    config.append(
                        etree.Element("option", {"name": "path", "value": webpack_path})
                    )
                    root.append(config)
                else:
                    config.attrib["value"] = webpack_path

            webpack_config()
            misc.write(str(misc_xml_path), encoding="utf-8", pretty_print=True)

        def run_configuration(include_wip=False):
            placement = Path(".idea/runConfigurations")
            os.makedirs(placement, exist_ok=True)

            def write(name, content):
                if isinstance(content, str):
                    content = etree.fromstring(content)
                with open(placement / name, "wb") as f:
                    f.write(
                        etree.tostring(content, encoding="utf-8", pretty_print=True)
                    )
                with open(placement / ".gitignore", "a") as f:
                    f.write(name + "\n")

            for name, xml in run_configurations.items():
                if name.lower().startswith("wip"):
                    if include_wip:
                        write(name, xml)
                else:
                    write(name, xml)

        misc_xml()
        run_configuration(wip_config)

    return {
        "actions": [(initialize,)],
        "params": [
            {"name": "wip_config", "long": "wip-config", "type": bool, "default": False}
        ],
        "verbosity": 2,
    }


# flake8: noqa
run_configurations = {
    "API.xml": """<component name="ProjectRunConfigurationManager">
  <configuration default="false" name="API" type="Python.FlaskServer">
    <option name="additionalOptions" value="--host 0.0.0.0" />
    <option name="flaskDebug" value="true" />
    <module name="data-modelling-tool" />
    <option name="target" value="$PROJECT_DIR$/api/app.py" />
    <option name="targetType" value="PATH" />
    <option name="INTERPRETER_OPTIONS" value="" />
    <option name="PARENT_ENVS" value="true" />
    <option name="SDK_HOME" value="docker-compose://[$PROJECT_DIR$/docker-compose.yml, $PROJECT_DIR$/docker-compose.override.yml]:api/python" />
    <option name="WORKING_DIRECTORY" value="$PROJECT_DIR$" />
    <option name="IS_MODULE_SDK" value="false" />
    <option name="ADD_CONTENT_ROOTS" value="true" />
    <option name="ADD_SOURCE_ROOTS" value="true" />
    <EXTENSION ID="DockerComposeSettingsRunConfigurationExtension" commandLine="up" />
    <EXTENSION ID="PythonCoverageRunConfigurationExtension" runner="coverage.py" />
    <option name="launchJavascriptDebuger" value="false" />
    <method v="2" />
  </configuration>
</component>
""",
    "WEB.xml": """<component name="ProjectRunConfigurationManager">
  <configuration
     default="false"
     name="WEB"
     type="JavascriptDebugType"
     uri="http://localhost"
     useFirstLineBreakpoints="true"
   >
    <method v="2" />
  </configuration>
</component>""",
    "WIP__WEB__attach.xml": """<component name="ProjectRunConfigurationManager">
  <configuration
    default="false"
    name="WIP: WEB (attach)"
    type="ChromiumRemoteDebugType"
    factoryName="Chromium Remote"
    port="56745"
    restartOnDisconnect="true"
  >
    <method v="2" />
  </configuration>
</component>""",
    "WIP__WEB__node_.xml": """<component name="ProjectRunConfigurationManager">
  <configuration
    default="false"
    name="WIP: WEB (node)"
    type="NodeJSConfigurationType"
    application-parameters="start"
    path-to-node="docker-compose://[$PROJECT_DIR$/docker-compose.yml, $PROJECT_DIR$/docker-compose.override.yml]:web/node"
    node-parameters="--inspect-brk=&quot;0.0.0.0:9229&quot;"
    path-to-js-file="node_modules/react-scripts/bin/react-scripts.js"
    working-dir="$PROJECT_DIR$/web"
  >
    <envs>
      <env name="HOST" value="0.0.0.0" />
    </envs>
    <EXTENSION ID="com.jetbrains.nodejs.run.NodeJSStartBrowserRunConfigurationExtension">
      <browser with-js-debugger="true" />
    </EXTENSION>
    <method v="2" />
  </configuration>
</component>""",
}

if __name__ == "__main__":
    import doit

    doit.run(globals())
