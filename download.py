from subprocess import call
from io import BytesIO
import os, shutil
import zipfile

def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file))

def zip(path):
    zipf = zipfile.ZipFile('Python.zip', 'w', zipfile.ZIP_DEFLATED)
    zipdir(path, zipf)
    zipf.close()

    # memory_file = BytesIO()
    # with zipfile.ZipFile(memory_file, 'w') as zipf:
    #     files = result['files']
    #     for individualFile in files:
    #         data = zipfile.ZipInfo(individualFile['fileName'])
    #         data.date_time = time.localtime(time.time())[:6]
    #         data.compress_type = zipfile.ZIP_DEFLATED
    #         zipf.writestr(data, individualFile['fileData'])
    # memory_file.seek(0)
    # return send_file(memory_file, attachment_filename='Python.zip', as_attachment=True)
