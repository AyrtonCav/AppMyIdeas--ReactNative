export type Idea = {
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