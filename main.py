from flask import Flask, render_template

# Helps Flask determine root path.
app = Flask(__name__)


# Home page of website.
# Called a decorator.
@app.route('/')
def index():
    return render_template("index.html")

# Start this app. Only runs app if this file is called directly.
if __name__ == "__main__":
    app.run(debug=True)
