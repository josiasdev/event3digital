"use client"

import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Link from "next/link";
import Logo from "../template/Logo";

interface Evento {
    id: number;
    nome: string;
    descricao: string;
    data: string;
    local: string;
    publicoEsperado: number;
}

const EventoList: React.FC = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);

    useEffect(() => {
        api.get<Evento[]>("/eventos")
            .then((response) => setEventos(response.data))
            .catch((error) => console.error("Erro ao buscar eventos:", error));
    }, []);

    return (
        <>
        
        <div className="bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ backgroundImage: "url('/background-elementos.svg')" }}>
            <div className="justify-items-center mb-3">
                <Logo />
        </div>
            <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
                <h1 className="mb-3">Lista de Eventos</h1>
                <ul>
                    {eventos.map((evento) => (
                        <li className="mb-4 w-full p-3 border-2 border-gray-300 rounded-lg" key={evento.id}>
                            <h2 className="block text-lg font-semibold text-black">Nome: {evento.nome}</h2>
                            <p>Descrição: {evento.descricao}</p>
                            <p>Data: {new Date(evento.data).toLocaleString()}</p>
                            <p>Local: {evento.local}</p>
                            <p>Público esperado: {evento.publicoEsperado}</p>
                            <Link href="/eventos/editar">
                                <button className="botao verde mb-4 px-5">Editar</button>
                            </Link>
                            <Link href="/eventos/excluir">
                                <button className="botao vermelho px-5">Excluir</button>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </>
    );
};

export default EventoList;
