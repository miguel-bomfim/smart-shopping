export interface Gasto {
  id?: number;
  user_id: string;
  descricao: string;
  valor: number;
  data_gasto: Date;
  cartao: 'Nubank' | 'Itaú' | 'Outro';
  user_display_name?: string; // Para mostrar "Miguel" ou "Sarah" na tela
}

export interface ResumoMes {
  total: number;
  porUsuario: {
    nome: string;
    bancos: { nome: string; total: number }[];
  }[];
}