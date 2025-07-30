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



from fastapi import FastAPI, HTTPException
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
    email: EmailStr

@app.get("/api/users")
async def get_users():
    users = []
    cursor = db.users.find()
    if users == []:
        return JSONResponse(status_code=404, content={ "message" : "No users found" })
    else:
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            users.append(doc)
            return users

@app.post("/api/users")
async def create_user(user: UserCreate):
    try:
        if not user.name.strip():
            return JSONResponse(status_code=400, content={"message": "Name is required"})

        if not user.email.strip():
            return JSONResponse(status_code=400, content={"message": "Email is required"})

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
