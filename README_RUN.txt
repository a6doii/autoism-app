Auto-Ism React + Flask Ready Project

Structure:
- backend/   Flask API + SQLite + Q-CHAT model
- frontend/  React app

Admin account:
- email: admin1
- password: s7s1234567A

Run backend:
1) cd backend
2) python -m venv .venv
3) .venv\Scripts\Activate
4) python -m pip install --upgrade pip
5) python -m pip install -r requirements.txt
6) python app.py

Backend runs at:
http://127.0.0.1:11000

Run frontend:
1) cd frontend
2) npm install
3) npm start

Frontend runs at:
http://localhost:3000

Notes:
- The frontend uses package.json proxy to call the Flask API.
- Reports are generated and saved per case test.
- The admin dashboard shows total accounts, total cases, total tests, recent reports, and allows deleting non-admin users.
