from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import csv
import os
from http import HTTPStatus


app = FastAPI()
CSV_file = "arquivo.csv"


class Evento(BaseModel):
    id: int
    nome: str
    descricao: str
    data: datetime
    local: str
    publicoEsperado: int


def lerDadosCSV():
    eventos = []
    if os.path.exists(CSV_file):
        with open(CSV_file, mode="r", newline="") as file:
            reader = csv.DictReader(file)
            for row in reader:
                eventos.append(Evento(**row))
    return eventos


def escreverDadosCSV(eventos):
    with open(CSV_file, mode="w", newline="") as file:
        fieldnames = ["id", "nome", "descricao", "data", "local", "publicoEsperado"]
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        for evento in eventos:
            writer.writerow(evento.dict())


@app.get("/eventos", response_model=list[Evento])
def listarEventos():
    return lerDadosCSV()


@app.post("/eventos", response_model=Evento, status_code=HTTPStatus.CREATED)
def criarEvento(evento: Evento):
    eventos = lerDadosCSV()
    if any(p.id == evento.id for p in eventos):
        raise HTTPException(status_code=400, detail="Evento já existente")
    eventos.append(evento)
    escreverDadosCSV(eventos)
    return evento


@app.put("/eventos/{id}", response_model=Evento)
def atualizarEvento(id: int, eventoAtualizado: Evento):
    eventos = lerDadosCSV()
    for i, evento in enumerate(eventos):
        if evento.id == id:
            eventos[i] = eventoAtualizado
            escreverDadosCSV(eventos)
            return eventoAtualizado
    raise HTTPException(status_code=404, detail="Evento não encontrado")


@app.delete("/eventos/{id}", status_code=HTTPStatus.NO_CONTENT)
def removerEventos(id: int):
    eventos = lerDadosCSV()
    for i, evento in enumerate(eventos):
        if evento.id == id:
            eventos.pop(i)
            escreverDadosCSV(eventos)
            return {"id": id, "message": "Evento deletado"}
        raise HTTPException(status_code=404, detail="Evento não encontrado")


@app.get("/eventos/quantidade")
def quantidadeTotalEventos():
    if not os.path.exists(CSV_file):
        return {"quantidade" : 0}
    with open(CSV_file, mode="r", newline="") as file:
        reader = csv.reader(file)
        total = sum(1 for _ in reader) - 1
    return {"quantidade": total if total > 0 else 0}
