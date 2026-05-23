from fastapi import FastAPI
import platform
import socket

app = FastAPI()

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "worker_hostname": socket.gethostname(),
        "platform": platform.platform()
    }

@app.get("/compute/{number}")
def compute_number(number: int):
    return {"input": number, "squared": number ** 2}
