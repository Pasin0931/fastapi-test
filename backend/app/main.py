# # backend/app/main.py
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# # CORS to allow requests from frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # Frontend origin
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/api/hello")
# def read_root():
#     return {"message": "HELLO"}

# @app.get("/api/hi")
# def read_root():
#     return {"message": "HI"}

# @app.get("api/database")
# def get_dbInfo():
#     return {"message": "Database endpoint working !"}



from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, EmailStr
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from db.mongo import db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserCreate(BaseModel):
    name: str
    email: str

@app.get("/api/users")
async def get_users():
    try:

        users = []
        cursor = db.users.find()
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            users.append(doc)

        if users == []:
            return JSONResponse(status_code=400, content={"message": "Database empty"})

        return users

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/api/name")
async def get_users_by_name(name: str = Query(...)):
    try:
        users = []
        cursor = db.users.find({"name": name})
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            users.append(doc)

        if not users:
            return JSONResponse(status_code=404, content={"message": "Name not found"})

        return users

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/api/email")
async def get_users_by_email(email: str = Query(...)):
    try:
        users = []
        cursor = db.users.find({"email": email})
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            users.append(doc)

        if not users:
            return JSONResponse(status_code=404, content={"message": "Email not found"})

        return users

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/api/users")
async def create_user(user: UserCreate):
    try:
        if not user.name.strip() or not user.email.strip():
            return JSONResponse(status_code=400, content={"message": "Name and email are required"})

        existing = await db.users.find_one({"email": user.email})
        if existing:
            return JSONResponse(status_code=400, content={"message": "Email already registered"})

        result = await db.users.insert_one(user.dict())

        return {
            "message": "User created",
            "user_id": str(result.inserted_id)
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.delete("/api/users")
async def clear_all_users():
    try:
        users_cursor = db.users.find({})
        users = await users_cursor.to_list(length=1)
        if not users:
            return JSONResponse(status_code=400, content={"message": "Database empty"})
        
        result = await db.users.delete_many({})
        return {"message": "Database cleared"}

    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Error clearing database", "error": str(e)})