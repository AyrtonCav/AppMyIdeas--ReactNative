import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '@/src/api';

type Idea = {
  id: number;
  titulo: string;
  videoUrl: string;
  musicaUrl: string;
  categoria: 'Legendado' | 'Matéria' | 'Meme';
  descricao: string;
  status: 'Pendente' | 'Concluída';
  favorito: boolean;
  publicidade: boolean;
  data: Date;
}

type IdeasContextType = {
  ideas: Idea[];
  addIdea: (newIdea: Idea) => void;  
  deleteIdea: (id: number) => void;
  updateIdea: (id: number, updatedIdea: Idea) => void; 
}

const IdeasContext = createContext<IdeasContextType>({ ideas: [], addIdea: () => {}, deleteIdea: () => {}, updateIdea: () => {} });

export const useIdeas = () => {
  return useContext(IdeasContext);
};

export const IdeasProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  // Função para buscar as ideias no back-end
  const fetchIdeas = async () => {
    try {
      const response = await api.get('/ideias');
      setIdeas(response.data);
    } catch (error) {
      console.error('Erro ao buscar as ideias:', error);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const addIdea = async (newIdea: Idea) => {
    try {
      const response = await api.post('/ideias', newIdea);
      if (response.status === 201) {
        fetchIdeas(); 
      }
    } catch (error) {
      console.error('Erro ao criar a ideia:', error);
    }
  };

  const deleteIdea = async (id: number) => {
    try {
      await api.delete(`/ideias/${id}`);
      fetchIdeas();
    } catch (error) {
      console.error('Erro ao excluir a ideia:', error);
    }
  };

  const updateIdea = async (id: number, updatedIdea: Idea) => {
    try {
      await api.put(`/ideias/${id}`, updatedIdea);
      fetchIdeas();
    } catch (error) {
      console.error('Erro ao atualizar a ideia:', error);
    }
  };

  return (
    <IdeasContext.Provider value={{ ideas, addIdea, deleteIdea, updateIdea }}>
      {children}
    </IdeasContext.Provider>
  );
};
