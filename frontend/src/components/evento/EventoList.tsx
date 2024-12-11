"use client"

import React, { useEffect, useState } from "react";
import { listarEventos, removerEvento, atualizarEvento } from "../../services/api";
import Logo from "../template/Logo";
import Background from "../template/Background";
import { useRouter } from "next/navigation";
import { verificarIntegridade, baixarBackup } from "../../services/api";

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
    const [filtroTitulo, setFiltroTitulo] = useState<string>("");
    const [sha256, setSha256] = useState<string | null>(null);
    const [showSha256, setShowSha256] = useState<boolean>(false);
    const router = useRouter();


    const carregarEventos = async () => {
        try {
            const eventosList = await listarEventos();
            setEventos(eventosList);
        } catch (error: any) {
            setErro(`Erro ao carregar eventos`);
        }
    };
    const excluirEvento = async (id: number) => {
        const confirmar = window.confirm("Tem certeza que deseja excluir este evento?");
        if (confirmar) {
            try {
                await removerEvento(id);
                setEventos((prevEventos) => prevEventos.filter((evento) => evento.id !== id));
            } catch (error: any) {
                setErro(`Erro ao excluir evento`);
            }
        }
    };


    const atualizarEvento = (id: number) => {
        router.push(`/editar/${id}`); // Redireciona para /evento com o ID do evento
    };

    const obterSha256 = async () => {
        try {
            const hash = await verificarIntegridade(); // Chama a função para obter o hash
            setSha256(hash);
            setShowSha256(true); // Mostrar o SHA256 com o efeito
        } catch (error) {
            setErro(`Erro ao obter SHA256`);
        }
    };
    const baixarArquivo = async () => {
        try {
            const backupBlob = await baixarBackup(); // Chama a função para baixar o backup
            // Cria um link temporário para fazer o download do arquivo
            const link = document.createElement('a');
            link.href = URL.createObjectURL(backupBlob);
            link.download = "backup.zip"; // Nome do arquivo a ser baixado
            link.click();
        } catch (error) {
            setErro(`Erro ao baixar o backup`);
        }
    };

    useEffect(() => {
        carregarEventos();
    }, []);
    const eventosFiltrados = eventos.filter((evento) => {
        return filtroTitulo ? evento.titulo.toLowerCase().includes(filtroTitulo.toLowerCase()) : true;
    });

    return (
        <>
            <Background>
                <div className="justify-items-center mb-3">
                    <Logo />
                </div>
                <div className="mb-4 flex flex-col gap-2 max-w-lg mx-auto p-6">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={filtroTitulo}
                            onChange={(e) => setFiltroTitulo(e.target.value)}
                            className="border p-2 rounded flex-1"
                            placeholder="Procurar por título"
                        />
                    </div>
                </div>

                <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
                    <h1 className="mb-3">Lista de Eventos</h1>
                    {erro && <p className="text-red-500">{erro}</p>}
                    <div className="mt-4 mb-3 p-4 border rounded-lg bg-gray-100">
                        <div className="mt-4 text-center">
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="w-20 h-20 mx-auto mb-4"
                            />
                            <p className="text-gray-600 text-sm">
                                Baixe todos os eventos da lista.
                            </p>
                        </div>
                        <div className="flex justify-between mt-4">
                            <button className="botao azul px-4 py-2" onClick={baixarArquivo}>Download</button>
                            <button
                                className="botao cinza px-4 py-2"
                                onClick={obterSha256}
                            >
                                Sum
                            </button>
                        </div>
                        {showSha256 && sha256 && (
                            <div className="mt-4 p-4 bg-white">
                                <p className="text-sm text-gray-600 break-words">SHA256: {sha256}</p>
                            </div>
                        )}
                    </div>
                    <ul>
                        {(filtroTitulo ? eventosFiltrados : eventos).map((evento) => (
                            <li className="mb-4 w-full p-3 border-2 border-gray-300 rounded-lg" key={evento.id}>
                                <h2 className="block text-lg font-semibold text-black">Titulo: {evento.titulo}</h2>
                                <p>Descrição: {evento.descricao}</p>
                                <p>Data: {new Date(evento.data).toLocaleString()}</p>
                                <p>Local: {evento.local}</p>
                                <p>Público esperado: {evento.publicoEsperado}</p>
                                <button
                                    onClick={() => atualizarEvento(evento.id)}
                                    className="botao verde mb-4 px-5"
                                >
                                    Editar
                                </button>
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
