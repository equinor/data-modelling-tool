# Code Generator

DMT can generate code from your blueprints. This is useful for being able to programmatically interact with your models. For example; creating 10k entities of a complex model based on data from an Excel sheet.  
If you also need storage for your models, or making them available for searching and viewing in the DMT web application, [DMT Python3 Library](https://equinor.github.io/dmt-py/) can help with that.

To download generated code for some blueprints;

1. Navigate to the "Blueprints" page in the DMT app
2. Right-click any package or blueprint
3. Select "Generate Code" and choose your code generator

![custom_code_generator](./custom_code_generator.png)

## Custom Code Generator

DMT currently ships with one Python3 code generator ([read more](/api/home/code_generators/default_python/README.md)).
This might not suit your needs (either you need a different language, or some special feature on the code itself), so DMT supports plugable code generators. The code generators can be written in any language, and generate code in any language.

To use your own code generator, follow these steps;

1. Create a python module (a directory with a `__init__.py`-file)
2. (Optional) Create the files called
   * `NAME.txt` with a single line with the desired display name.
   * `README.md` with a description, and usage of the plugin, along with other relevant information
3. Have the modules `main()` function adhere to the DMT-code-generator-standard

   ```python
   import io

   def main(dict_of_blueprints: dict) -> io.BytesIO:
       """Entry point of the code generator"""
       ...
   ```

   Input: A dictionary of all the blueprints referenced in the selected package/blueprint, in their entierty.

   ```python
   {
      "SSR-DataSource/CarPackage/Car": {
         "name": "Car",
         "type": "system/SIMOS/Blueprint",
         ...
      }
      "system/SIMOS/Blueprint": {
         ...
      }
   }
   ```

   Output: A zip folder of the `io.BytesIO`-class  
   Example;

   ```python
   import io
   import zipfile

   def main(list_of_blueprints):
      memory_file = io.BytesIO()
      with zipfile.ZipFile(memory_file, mode="w") as zip_file:
         zip_file.writestr("python-code.py", str(list_of_blueprints))

      # Important to do, otherwise the file will look empty
      memory_file.seek(0)
      return memory_file
   ```

4. Using docker; mount your python module into  `/code/home/code_generators/`

 ```yaml
 ...
 volumes:
   - ./plugins/awesome_fortran_cg:/code/home/code_generators/awesome_fortran_cg
 ...
 ```

5. When the DMT-API restarts, the plugin is loaded, and offered as an option on "Generate Code".