from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import csv
import os
from http import HTTPStatus


app = FastAPI()
CSV_file = "arquivo.csv"


class Eventos(BaseModel):
    id: int
    nome: str
    descricao: str
    data: datetime
    local: str
    publicoEsperado: int

def lerDadosCSV():
    eventos = []
    if os.path.exists(CSV_file):
        with open (CSV_file, mode="r", newline="") as file:
            reader = csv.DictReader(file)
            for row in reader:
                eventos.append(Eventos(**row))
    return eventos

def escreverDadosCSV(eventos):
    with open(CSV_file, mode="w", newline="") as file:
        fieldnames = ["id", "nome","descricao", "data" , "local", "publicoEsperado"]
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        for evento in eventos:
            writer.writerow(evento.dict())
            
            
@app.get("/eventos", response_model=list[Eventos])
def listarEventos():
    return lerDadosCSV()


@app.post("/eventos", response_model=Eventos, status_code=HTTPStatus.CREATED)
def criarEvento(evento: Eventos):
    eventos = lerDadosCSV()
    # p['id'] para acessar a chave id de cada dicionário para retornar todos.
    if any(p.id == evento.id for p in eventos):
        raise HTTPException(status_code=400, detail="Evento já existente")
    eventos.append(evento)
    escreverDadosCSV(eventos)
    return evento
    
