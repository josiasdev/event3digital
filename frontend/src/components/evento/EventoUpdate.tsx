"use client"

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { obterEvento, atualizarEvento } from "../../services/api"; // Certifique-se de ter as funções para obter e atualizar evento
import Background from "../template/Background";

interface Evento {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  local: string;
  publicoEsperado: number;
}

const EventoUpdate: React.FC = () => {
  const [evento, setEvento] = useState<Evento | null>(null); // Evento pode ser nulo inicialmente
  const [erro, setErro] = useState<string>("");
  const router = useRouter();
  const { id } = useParams();  // Obtém o id da URL

  // Carregar o evento com base no id
  useEffect(() => {
    if (id && !isNaN(Number(id)) && Number(id) >= 0) {
      obterEvento(Number(id))
        .then((data) => {
          setEvento(data);  // Definindo o evento obtido
        })
        .catch((error) => {
          console.error("Erro ao obter evento:", error);
          setErro("Erro ao carregar os dados do evento.");
        });
    } else {
      setErro("ID inválido de evento.");
      router.push("/eventos");  // Redireciona para a lista de eventos se o ID for inválido
    }
  }, [id]);

  // Função de mudança nos campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEvento((prevEvento) => {
      if (prevEvento) {
        return {
          ...prevEvento,
          [name]: value, // Atualiza apenas o campo modificado
        };
      }
      return prevEvento;
    });
  };

  // Função de envio para atualizar o evento
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (evento) {
      const eventoSubmit = {
        ...evento,
        data: new Date(evento.data).toISOString(), // Converte a data para ISO string
        publicoEsperado: Number(evento.publicoEsperado),
      };

      try {
        await atualizarEvento(evento.id, eventoSubmit);  // Atualiza o evento
        alert("Evento atualizado com sucesso!");
        router.push("/eventos");
      } catch (error) {
        console.error("Erro ao atualizar evento:", error);
        alert("Erro ao atualizar evento. Tente novamente.");
      }
    }
  };

  if (!evento) {
    return <div>Carregando...</div>;  // Exibe um carregamento enquanto o evento é obtido
  }

  return (
    <>
      <Background>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
          {erro && <div className="text-red-500 mb-4">{erro}</div>}
          <div className="mb-4">
            <label htmlFor="titulo" className="block text-lg font-semibold text-black mb-2">
              Título:
            </label>
            <input
              name="titulo"
              id="titulo"
              value={evento.titulo}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="descricao" className="block text-lg font-semibold text-black mb-2">
              Descrição:
            </label>
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
            <label htmlFor="data" className="block text-lg font-semibold text-black mb-2">
              Data:
            </label>
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
            <label htmlFor="local" className="block text-lg font-semibold text-black mb-2">
              Local:
            </label>
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
            <label htmlFor="publicoEsperado" className="block text-lg font-semibold text-black mb-2">
              Público Esperado:
            </label>
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
          <button
            type="submit"
            className="w-full p-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Atualizar Evento
          </button>
        </form>
      </Background>
    </>
  );
};

export default EventoUpdate;
