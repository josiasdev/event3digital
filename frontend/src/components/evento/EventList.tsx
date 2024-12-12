import React from "react";
import { useRouter } from "next/navigation";

interface Evento {
    id: number;
    titulo: string;
    descricao: string;
    data: string;
    local: string;
    publicoEsperado: number;
}

interface EventListProps {
    eventos: Evento[];
    Editar: (id: number) => void;
    Excluir: (id: number) => void;
}

const EventList: React.FC<EventListProps> = ({ eventos, Editar: Editar, Excluir: Excluir }) => {
    return (
        <ul>
            {eventos.length > 0 ? (
                eventos.map((evento) => (
                    <li className="mb-4 w-full p-3 border-2 border-gray-300 rounded-lg" key={evento.id}>
                        <h2 className="block text-lg font-semibold text-black">Titulo: {evento.titulo}</h2>
                        <p>Descrição: {evento.descricao}</p>
                        <p>Data: {new Date(evento.data).toLocaleString()}</p>
                        <p>Local: {evento.local}</p>
                        <p>Público esperado: {evento.publicoEsperado}</p>
                        <button onClick={() => Editar(evento.id)} className="botao verde mb-4 px-5">
                            Editar
                        </button>
                        <button onClick={() => Excluir(evento.id)} className="botao vermelho px-5">
                            Excluir
                        </button>
                    </li>
                ))
            ) : (
                <p className="text-gray-500 text-center">Nenhum evento encontrado.</p>
            )}
        </ul>
    );
};

export default EventList;
