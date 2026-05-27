from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import json
from datetime import datetime
from pathlib import Path

app = FastAPI(title="Eileen Cruz - Contact API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

DATA_FILE = Path("messages.json")

class ContactMessage(BaseModel):
    nombre: str
    email: EmailStr
    telefono: str | None = None
    mensaje: str

@app.post("/api/contact")
async def receive_contact(data: ContactMessage):
    entry = {
        **data.model_dump(),
        "fecha": datetime.now().isoformat(),
    }

    mensajes = []
    if DATA_FILE.exists():
        mensajes = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    mensajes.append(entry)
    DATA_FILE.write_text(json.dumps(mensajes, indent=2, ensure_ascii=False), encoding="utf-8")

    return {"ok": True, "mensaje": "Mensaje recibido correctamente"}

@app.get("/api/health")
async def health():
    return {"status": "ok"}
