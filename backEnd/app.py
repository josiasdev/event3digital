from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import csv
import os
from http import HTTPStatus


app = FastAPI()
CSV_file = "arquivo.csv"


class Vendas(BaseModel):
    id: int
    nome: str
    categoria: str
    preco: float
    quantidade: int
    dataCriacao: datetime


def inserirEntidade(venda: Vendas):
    is_new_file = not os.path.exists(CSV_file)
    with open(CSV_file, mode="a", newline="", encoding="utf-8") as file:
        fieldNames = ["id", "nome", "categoria", "preco", "quantidade", "dataCriacao"]
        writer = csv.DictWriter(file, fieldnames=fieldNames)
        if is_new_file:
            writer.writeheader()

        writer.writerow(
            {
                "id": venda.id,
                "nome": venda.nome,
                "categoria": venda.categoria,
                "preco": venda.preco,
                "quantidade": venda.quantidade,
                "dataCriacao": venda.dataCriacao.strftime("%Y-%m-%d %H:%M:%S")
            }
        )


@app.post("/vendas/")
def criarVenda(venda: Vendas):
    inserirEntidade(venda)
    return {
        "status": "success",
        "message": "Venda cadastrada com sucesso!",
        "venda": venda,
    }
    raise HTTPException(
        status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        detail=f"Erro ao cadastrar a venda:",
    )
