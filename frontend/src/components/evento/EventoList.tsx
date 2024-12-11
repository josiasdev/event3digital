"use client"

import React, { useEffect, useState } from "react";
import { listarEventos, removerEvento, atualizarEvento } from "../../services/api";
import Link from "next/link";
import Logo from "../template/Logo";
import Background from "../template/Background";

interface Evento {
    id: number;
    titulo: string;
    descricao: string;
    data: string;
    local: string;
    publicoEsperado: number;
}

const EventoList: React.FC = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [erro, setErro] = useState<string | null>(null);

    const carregarEventos = async () => {
        try {
            const eventosList = await listarEventos();
            setEventos(eventosList);
        } catch (error: any) {
            setErro(`Erro ao carregar eventos: ${error.message}`);
        }
    };
    const excluirEvento = async (id: number) => {
        const confirmar = window.confirm("Tem certeza que deseja excluir este evento?");
        if (confirmar) {
            try {
                await removerEvento(id);
                setEventos((prevEventos) => prevEventos.filter((evento) => evento.id !== id));
            } catch (error: any) {
                setErro(`Erro ao excluir evento: ${error.message}`);
                console.error("Erro ao excluir evento:", error);
            }
        }

    };
    useEffect(() => {
        carregarEventos();
    }, []);

    return (
        <>
        <Background>
                <div className="justify-items-center mb-3">
                    <Logo />
                </div>
                <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
                    <h1 className="mb-3">Lista de Eventos</h1>
                    {erro && <p className="text-red-500">{erro}</p>}
                    <ul>
                        {eventos.map((evento) => (
                            <li className="mb-4 w-full p-3 border-2 border-gray-300 rounded-lg" key={evento.id}>
                                <h2 className="block text-lg font-semibold text-black">Titulo: {evento.titulo}</h2>
                                <p>Descrição: {evento.descricao}</p>
                                <p>Data: {new Date(evento.data).toLocaleString()}</p>
                                <p>Local: {evento.local}</p>
                                <p>Público esperado: {evento.publicoEsperado}</p>
                                <Link href="/editar">
                                    <button className="botao verde mb-4 px-5">Editar</button>
                                </Link>
                                <button
                                    onClick={() => excluirEvento(evento.id)}
                                    className="botao vermelho px-5"
                                >
                                    Excluir
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                </Background>
        </>
    );
};

export default EventoList;
