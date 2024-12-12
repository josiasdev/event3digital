"use client";

import React, { useEffect, useState } from "react";
import { obterQuantidadeEventos } from "../../services/api"; // Ajuste o caminho conforme necessário

const TotalEvent: React.FC = () => {
    const [totalEventos, setTotalEventos] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const buscarTotalEventos = async () => {
            try {
                const quantidade = await obterQuantidadeEventos();
                setTotalEventos(quantidade);
            } catch (error) {
                console.error('Erro ao obter quantidade de eventos:', error);
                setError("Houve um erro ao carregar a quantidade de eventos.");
            }
        };

        buscarTotalEventos();
    }, []);

    return (
        <div className="mb-3">
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <h2>Total de Eventos: {totalEventos}</h2>
            )}
        </div>
    );
};

export default TotalEvent;
