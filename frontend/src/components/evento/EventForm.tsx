"use client"

import React, { useState } from "react";
import api from "../../services/api";
import Link from "next/link";

interface Evento {
    id: number;
    nome: string;
    descricao: string;
    data: string;
    local: string;
    publicoEsperado: number;
}

const EventoForm: React.FC = () => {
    const [evento, setEvento] = useState<Evento>({
        id: 0,
        nome: '',
        descricao: '',
        data: '',
        local: '',
        publicoEsperado: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEvento(prevEvento => ({
            ...prevEvento,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const eventoSubmit = {
            ...evento,
            data: new Date(evento.data).toISOString(),
            publicoEsperado: Number(evento.publicoEsperado),
        };

        api.post("/eventos", eventoSubmit)
            .then(() => {
                alert("Evento criado com sucesso!");
                setEvento({
                    id: 0,
                    nome: '',
                    descricao: '',
                    data: '',
                    local: '',
                    publicoEsperado: 0,
                });
            })
            .catch((error) => console.error("Erro ao criar evento:", error));
    };

    return (
        <div className="bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/background-elementos.svg')" }}>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
                <div className="mb-4">
                    <label htmlFor="id" className="block text-lg font-semibold text-black mb-2">ID:</label>
                    <input
                        name="id"
                        id="id"
                        value={evento.id}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 "
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="nome" className="block text-lg font-semibold text-black mb-2">Nome:</label>
                    <input
                        name="nome"
                        id="nome"
                        value={evento.nome}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 "
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="descricao" className="block text-lg font-semibold text-black mb-2">Descrição:</label>
                    <textarea
                        name="descricao"
                        id="descricao"
                        value={evento.descricao}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="data" className="block text-lg font-semibold text-black mb-2">Data:</label>
                    <input
                        type="datetime-local"
                        name="data"
                        id="data"
                        value={evento.data}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="local" className="block text-lg font-semibold text-black mb-2">Local:</label>
                    <input
                        name="local"
                        id="local"
                        value={evento.local}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="publicoEsperado" className="block text-lg font-semibold text-black mb-2">Público Esperado:</label>
                    <input
                        type="number"
                        name="publicoEsperado"
                        id="publicoEsperado"
                        value={evento.publicoEsperado}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>
                <Link href="/eventos">
                <button type="submit" className="w-full p-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400">
                    Criar Evento
                </button>
                </Link>
            </form>
        </div>
    );
};

export default EventoForm;