from fastapi import FastAPI, HTTPException, Response, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from pydantic import BaseModel
from datetime import datetime
import csv
import os
from http import HTTPStatus
import hashlib
from zipfile import ZipFile # Criar zip  
from io import BytesIO


app = FastAPI()
CSV_file = "eventos.csv"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Aqui você pode colocar apenas os domínios que você deseja permitir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Evento(BaseModel):
    id: int
    titulo: str
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
                row['data'] = datetime.fromisoformat(row['data'])
                eventos.append(Evento(**row))
    return eventos


def escreverDadosCSV(eventos):
    with open(CSV_file, mode="w", newline="") as file:
        fieldnames = ["id", "titulo", "descricao", "data", "local", "publicoEsperado"]
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        for evento in eventos:
            evento_dict = evento.dict()
            evento_dict["data"] = evento.data.isoformat()
            writer.writerow(evento.dict())

def calcular_hash():
    sha256 = hashlib.sha256()
    with open(CSV_file, "rb") as file:
        while chunk := file.read(4096):
            sha256.update(chunk)
    return sha256.hexdigest()

@app.get("/eventos", response_model=list[Evento])
def listarEventos():
    return lerDadosCSV()


@app.post("/eventos", response_model=Evento, status_code=HTTPStatus.CREATED)
def criarEvento(evento: Evento):
    try:
        if(evento.publicoEsperado < 1):
            raise HTTPException(status_code=400, detail="Erro ao criar evento: Publico esperado deve ser maior ou igual a 1.")
            
        eventos = lerDadosCSV()
        if eventos:
            evento.id = max(evento.id for evento in eventos) + 1
        else:
            evento.id = 1  # Caso seja o primeiro evento
        eventos.append(evento)
        escreverDadosCSV(eventos)
        return evento
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao criar evento: {str(e)}")


@app.put("/eventos/{id}", response_model=Evento)
def atualizarEvento(id: int, eventoAtualizado: Evento):
    if(evento.publicoEsperado < 1):
        raise HTTPException(status_code=400, detail="Erro ao atualizar evento: Publico esperado deve ser maior ou igual a 1.")
    
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
    
@app.get("/integridade")
def verificarIntegridade():
    return {"hash" : calcular_hash()}

@app.get("/backup")
def download_zip():
    NOME_ZIP = "backup.zip"

    if not os.path.exists(CSV_file):
        return {"error": f"O arquivo {CSV_file} não foi encontrado."}
    
    hash_csv = calcular_hash()
    
    copia_memoria_zip = BytesIO()
    with ZipFile(copia_memoria_zip, "w") as arquivo_backup:
        arquivo_backup.write(CSV_file, arcname=CSV_file)
        arquivo_backup.comment = hash_csv.encode("utf-8") # Copiei a ideia de como o Github faz quando baixa arquivo .zip

    copia_memoria_zip.seek(0)

    return Response(
        copia_memoria_zip.getvalue(),
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename={NOME_ZIP}"}
    )

@app.get("/eventos/filtro", response_model=list[Evento])
def filtrarEventos(
    titulo: Optional[str] = Query(None, alias="nome", description="Filtrar pelo título do evento"),
    data_inicio: Optional[datetime] = Query(None, description="Filtrar eventos a partir dessa data"),
    data_fim: Optional[datetime] = Query(None, description="Filtrar eventos até essa data")
):
    eventos = lerDadosCSV()
    
    # Filtros
    if titulo:
        filtro_busca = []
        for evento in eventos:
            if titulo.lower() in evento.titulo.lower():
                filtro_busca.append(evento)
        eventos = filtro_busca 
    
    if data_inicio:
        filtro_busca = []
        for evento in eventos:
            if evento.data.date() >= data_inicio.date():
                filtro_busca.append(evento)
        eventos = filtro_busca

    if data_fim:
        filtro_busca = []
        for evento in eventos:
            if evento.data.date() <= data_fim.date():
                filtro_busca.append(evento)
        eventos = filtro_busca

    if not eventos:
        raise HTTPException(status_code=404, detail="Nenhum evento encontrado utilizando os filtros atuais. Que tal fazer uma nova busca?")

    return eventos
