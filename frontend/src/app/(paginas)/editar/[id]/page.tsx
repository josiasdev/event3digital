"use client"

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation"; // useParams do App Router
import { atualizarEvento } from "../../../../services/api";  // Função para atualizar evento
import EventoUpdate from "@/components/evento/EventoUpdate";  // Componente de atualização de evento

interface Evento {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  local: string;
  publicoEsperado: number;
}

const EventoPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();  // Captura o id da URL
  const [evento, setEvento] = useState<Evento | null>(null);  // Evento a ser exibido
  const [loading, setLoading] = useState<boolean>(true);  // Estado de carregamento
  const [erro, setErro] = useState<string>("");  // Estado de erro

  // Simulação de carregamento do evento (pode ser substituído por dados reais)
  React.useEffect(() => {
    if (id) {
      // Exemplo de evento, substitua por dados reais ou gere de acordo com seu fluxo.
      const eventoSimulado: Evento = {
        id: Number(id),
        titulo: "Evento de Exemplo",
        descricao: "Descrição do evento de exemplo",
        data: "2024-12-15T10:00",
        local: "Local do Evento",
        publicoEsperado: 200,
      };

      setEvento(eventoSimulado);  // Atualiza com o evento simulado
      setLoading(false);  // Finaliza o carregamento
    }
  }, [id]);

  const handleSubmit = async (eventoAtualizado: Evento) => {
    try {
      if (id) {
        await atualizarEvento(Number(id), eventoAtualizado);  // Chama a função para atualizar o evento
        alert("Evento atualizado com sucesso!");
        router.push("/eventos");  // Redireciona para a lista de eventos
      }
    } catch (error) {
      alert("Erro ao atualizar evento.");
    }
  };

  if (loading) {
    return <div>Carregando...</div>;  // Exibe um carregamento enquanto o evento é carregado
  }

  if (erro) {
    return <div className="text-red-500">{erro}</div>;  // Exibe erro se não conseguir carregar o evento
  }

  return (
    <div>
      {evento && <EventoUpdate evento={evento} onSubmit={handleSubmit} />} {/* Passa o evento e o handleSubmit */}
    </div>
  );
};

export default EventoPage;
