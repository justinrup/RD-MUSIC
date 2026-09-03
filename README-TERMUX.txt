RD MEDIA ADMIN - TERMUX
1) cd ~/storage/downloads
2) unzip -o RD-MEDIA-ADMIN.zip -d RD-MEDIA-ADMIN
3) cd RD-MEDIA-ADMIN
4) pkg update -y
5) pkg install python -y
6) pip install flask werkzeug
7) python app.py
8) Chrome: http://localhost:8080
9) Admin: http://localhost:8080/admin
Login: admin
Password: rd1234

IMPORTANT: change ADMIN_USER and ADMIN_PASS in app.py before putting this online.
Uploaded files go into uploads/ and data goes into rdmedia.db.
This is suitable for local Termux testing. For public hosting, use a server/storage setup that supports persistent files.
