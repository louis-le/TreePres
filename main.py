from flask import Flask, render_template, send_from_directory
import walk
# Helps Flask determine root path.
app = Flask(__name__)
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


# Start this app. Only runs app if this file is called directly.
if __name__ == "__main__":
    app.run(host="louisle-VirtualBox.na.sas.com")
