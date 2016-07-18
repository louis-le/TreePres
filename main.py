from flask import Flask, render_template, send_from_directory, request, send_file, redirect, url_for
from werkzeug.utils import secure_filename
import walk, zipfile, download, os
from time import localtime, strftime
# Helps Flask determine root path.
app = Flask(__name__)
UPLOAD_FOLDER = '/FDA_Hold'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.debug = True




# Home page of website.
# Called a decorator.
@app.route('/', methods=['GET', 'POST', 'OPTIONS'])
def index():
    return render_template("index.html")


# Allows recognition of JSON files.
@app.route('/JSON/<path:filename>', methods=['GET', 'POST', 'OPTIONS'])
def send_json(filename):
    return send_from_directory('json', filename)


# Allows recognition of javascript files.
@app.route('/js/<path:filename>', methods=['GET', 'POST', 'OPTIONS'])
def send_js(filename):
    return send_from_directory('js', filename)


@app.route('/walk/', methods=['GET', 'POST', 'OPTIONS'])
def get_json_sys():
    body = walk.return_rest()
    return body


# @app.route('/download/', methods=['POST', 'OPTIONS'])
# def get_zip():
#     if request.method == 'POST':
#         download.zip(request.paths)

@app.route('/download/', methods=['POST'])
def download():
    # Problem happens here
    # return (request.form['paths'])
    zipf = zipfile.ZipFile('Python.zip', 'w', zipfile.ZIP_DEFLATED)
    p = request.form['paths']
    paths = p.split(", ")
    for path in paths:
        entered = False

        for root, dirs, files in os.walk(path):
            entered = True
            for file in files:
                zipf.write(os.path.join(root, file))

        if not entered:
            zipf.write(path)
    zipf.close()

    return send_file('/home/louis/Desktop/Tree/Python.zip', attachment_filename='Download-[' + strftime("%d %b %Y %H:%M:%S", localtime()) + '].zip', as_attachment=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route('/upload/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        app.config['UPLOAD_FOLDER'] = request.form['active']
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        # if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return redirect(url_for('uploaded_file',filename=filename))
    # return '''
    # <!doctype html>
    # <title>Upload new File</title>
    # <h1>Upload new File</h1>
    # <form action="url_for(upload_file)" method=post enctype=multipart/form-data>
    #   <p><input type=file name=file>
    #      <input type=submit value=Upload>
    # </form>
    # '''

from flask import send_from_directory

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    return redirect(url_for('index'))

# Start this app. Only runs app if this file is called directly.
if __name__ == "__main__":
    app.run(host="louis-VirtualBox.na.sas.com")
