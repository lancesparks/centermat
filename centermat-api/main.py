from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routers.auth import router as auth_router
from routers.brackets import router as bracket_router
from routers.tournament import router as tournament_router
from routers.match import router as match_router
from routers.registration import router as registration_router
from routers.weight_class import router as weight_class_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(tournament_router)
app.include_router(bracket_router)
app.include_router(match_router)
app.include_router(registration_router)
app.include_router(weight_class_router)