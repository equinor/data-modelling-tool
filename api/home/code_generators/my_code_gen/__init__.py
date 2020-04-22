import io
import zipfile


def main(list_of_blueprints):
    memory_file = io.BytesIO()
    with zipfile.ZipFile(memory_file, mode="w") as zip_file:
        zip_file.writestr("python-code.py", str(list_of_blueprints))

    memory_file.seek(0)
    return memory_file
