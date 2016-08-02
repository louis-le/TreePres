from flask import Flask, render_template, send_from_directory, \
    request, send_file, redirect, url_for, session, flash, g, Response
from werkzeug.utils import secure_filename
from time import localtime, strftime
from io import BytesIO

import walk
import zipfile
import os
import sqlite3
import socket

# Helps Flask determine root path.
UPLOAD_FOLDER = './'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
DATABASE = 'users.py'

app = Flask(__name__)
app.secret_key = 'super secret key'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

app.debug = True


# Home page of website.
# Called a decorator.
@app.route('/', methods=['GET', 'POST', 'OPTIONS'])
def index():
    user_id = get_my_ip()
    users = g.db.execute("SELECT * FROM Users WHERE UserHostName=(?)", [user_id]).fetchall()
    # if len(users):
    #     return render_template("index.html")
    # else:
    #     return render_template("401_error.html")
    return render_template("index.html")
    # return render_template("401_error.html")


# Allows recognition of JSON files.
@app.route('/JSON/<path:filename>', methods=['GET', 'POST', 'OPTIONS'])
def send_json(filename):
    return send_from_directory('json', filename)


# Allows recognition of javascript files.
@app.route('/js/<path:filename>', methods=['GET', 'POST', 'OPTIONS'])
def send_js(filename):
    return send_from_directory('js', filename)


# Creates JSON file of set path.
@app.route('/walk/', methods=['GET', 'POST', 'OPTIONS'])
def get_json_sys():
    body = walk.return_rest()
    return body


# Download button, zips up all selected files
# along with auditing hostname, time and file paths.
@app.route('/download/', methods=['POST'])
def download():
    # Part of code that zips up files
    p = request.form['paths']
    paths = p.split(", ")
    memory_file = BytesIO()
    with zipfile.ZipFile(memory_file, 'w', zipfile.ZIP_DEFLATED) as zipf:

        for path in paths:
            entered = False

            for root, dirs, files in os.walk(path):
                entered = True
                for file in files:
                    zipf.write(os.path.join(root, file))

            if not entered:
                zipf.write(path)
        zipf.close()
    memory_file.seek(0)

    # Updates database
    user_id = get_my_ip()
    # return str(cur.rowcount)
    g.db.execute("INSERT INTO Users (UserHostName, DownloadPaths) VALUES (?,?)", [user_id, p])
    g.db.commit()

    return send_file(memory_file, attachment_filename='Download-[' + \
        strftime("%d %b %Y %H:%M:%S", localtime()) + '].zip', as_attachment=True)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@app.route('/upload/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        app.config['UPLOAD_FOLDER'] = request.form['active']
        # check if the post request has the file part
        # if 'file' not in request.files:
        #     flash('No file part')
        #     return redirect(request.url)
        files = request.files.getlist('file')
        for file in files:
        # if user does not select file, browser also
        # submit a empty part without filename
        # if file.filename == '':
        #     flash('No selected file')
        #     return redirect(request.url)
        # if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            send_from_directory(app.config['UPLOAD_FOLDER'], filename)
            source = app.config['UPLOAD_FOLDER'] + "/" + filename
            destination = app.config['UPLOAD_FOLDER'] + "/" + str(get_my_ip()) + "_" + filename
            os.rename(source, destination)
        return redirect(url_for('index'))


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    return redirect(url_for('index'))


@app.route("/get_my_ip", methods=["GET"])
def get_my_ip():
    return socket.getfqdn(request.remote_addr)
    # return jsonify({'host': hostname}), 200


@app.before_request
def before_request():
    g.db = sqlite3.connect("users.db")


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db


@app.teardown_request
def teardown_request(exception):
    if hasattr(g, 'db'):
        g.db.close()


def connect_db():
    return sqlite3.connect('users.db')


@app.route('/users')
def users():
    users = g.db.execute("SELECT * FROM Users").fetchall()
    return render_template('users.html', users=users)

# Start this app. Only runs app if this file is called directly.
if __name__ == "__main__":
    # app.run(host='louis-VirtualBox.na.sas.com', port=4679)
    app.run(host='louis-VirtualBox.na.sas.com', port=4657)
