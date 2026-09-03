
from flask import Flask, render_template, request, redirect, url_for, session, flash, send_from_directory
from werkzeug.utils import secure_filename
import sqlite3, os, secrets

APP_DIR = os.path.dirname(os.path.abspath(__file__))
DB = os.path.join(APP_DIR, "rdmedia.db")
UPLOADS = os.path.join(APP_DIR, "uploads")
os.makedirs(UPLOADS, exist_ok=True)

app = Flask(__name__)
app.secret_key = secrets.token_hex(24)

# Change these before putting the site online.
ADMIN_USER = "admin"
ADMIN_PASS = "rd1234"

ALLOWED = {"song": {"mp3","m4a","wav","ogg"}, "video":{"mp4","webm","mov"},
           "picture":{"jpg","jpeg","png","gif","webp"}, "game":{"zip","apk","html","htm"}}

def db():
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    return con

def init_db():
    con = db()
    con.execute("""CREATE TABLE IF NOT EXISTS media(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        kind TEXT NOT NULL, title TEXT NOT NULL, creator TEXT DEFAULT '',
        filename TEXT NOT NULL, description TEXT DEFAULT '', created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )""")
    con.execute("""CREATE TABLE IF NOT EXISTS news(
        id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL,
        body TEXT NOT NULL, image TEXT DEFAULT '', created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )""")
    con.commit(); con.close()

@app.route("/")
def home():
    con=db()
    rows=con.execute("SELECT * FROM media ORDER BY id DESC").fetchall()
    news=con.execute("SELECT * FROM news ORDER BY id DESC").fetchall()
    con.close()
    return render_template("index.html", media=rows, news=news)

@app.route("/uploads/<path:name>")
def uploads(name):
    return send_from_directory(UPLOADS, name)

@app.route("/admin", methods=["GET","POST"])
def admin():
    if request.method=="POST":
        if request.form.get("username")==ADMIN_USER and request.form.get("password")==ADMIN_PASS:
            session["admin"]=True
            return redirect(url_for("dashboard"))
        flash("Wrong username or password.")
    return render_template("login.html")

@app.route("/admin/dashboard")
def dashboard():
    if not session.get("admin"): return redirect(url_for("admin"))
    con=db()
    media=con.execute("SELECT * FROM media ORDER BY id DESC").fetchall()
    news=con.execute("SELECT * FROM news ORDER BY id DESC").fetchall()
    con.close()
    return render_template("dashboard.html", media=media, news=news)

@app.route("/admin/upload", methods=["POST"])
def upload():
    if not session.get("admin"): return redirect(url_for("admin"))
    kind=request.form.get("kind","")
    title=request.form.get("title","").strip()
    creator=request.form.get("creator","").strip()
    desc=request.form.get("description","").strip()
    f=request.files.get("file")
    if kind not in ALLOWED or not title or not f or not f.filename:
        flash("Title, type and file are required."); return redirect(url_for("dashboard"))
    ext=f.filename.rsplit(".",1)[-1].lower() if "." in f.filename else ""
    if ext not in ALLOWED[kind]:
        flash("This file type is not allowed for the selected category."); return redirect(url_for("dashboard"))
    filename=secure_filename(f.filename)
    stem, suffix=os.path.splitext(filename)
    filename=f"{secrets.token_hex(6)}_{stem}{suffix}"
    f.save(os.path.join(UPLOADS, filename))
    con=db()
    con.execute("INSERT INTO media(kind,title,creator,filename,description) VALUES(?,?,?,?,?)",
                (kind,title,creator,filename,desc))
    con.commit(); con.close()
    flash("Upload successful.")
    return redirect(url_for("dashboard"))

@app.route("/admin/news", methods=["POST"])
def add_news():
    if not session.get("admin"): return redirect(url_for("admin"))
    title=request.form.get("title","").strip()
    body=request.form.get("body","").strip()
    f=request.files.get("image")
    image=""
    if f and f.filename:
        ext=f.filename.rsplit(".",1)[-1].lower()
        if ext not in ALLOWED["picture"]:
            flash("News image must be JPG, PNG, GIF or WEBP."); return redirect(url_for("dashboard"))
        filename=secure_filename(f.filename)
        filename=f"{secrets.token_hex(6)}_{filename}"
        f.save(os.path.join(UPLOADS,filename)); image=filename
    if title and body:
        con=db(); con.execute("INSERT INTO news(title,body,image) VALUES(?,?,?)",(title,body,image)); con.commit(); con.close()
        flash("News published.")
    else: flash("News title and body are required.")
    return redirect(url_for("dashboard"))

@app.route("/admin/delete/<int:item_id>", methods=["POST"])
def delete(item_id):
    if not session.get("admin"): return redirect(url_for("admin"))
    con=db()
    row=con.execute("SELECT filename FROM media WHERE id=?",(item_id,)).fetchone()
    if row:
        try: os.remove(os.path.join(UPLOADS,row["filename"]))
        except OSError: pass
        con.execute("DELETE FROM media WHERE id=?",(item_id,))
    con.commit(); con.close()
    return redirect(url_for("dashboard"))

@app.route("/admin/delete-news/<int:item_id>", methods=["POST"])
def delete_news(item_id):
    if not session.get("admin"): return redirect(url_for("admin"))
    con=db(); con.execute("DELETE FROM news WHERE id=?",(item_id,)); con.commit(); con.close()
    return redirect(url_for("dashboard"))

@app.route("/logout")
def logout():
    session.clear(); return redirect(url_for("admin"))

if __name__=="__main__":
    init_db()
    app.run(host="0.0.0.0", port=8080, debug=False)
