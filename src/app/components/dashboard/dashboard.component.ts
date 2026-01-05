import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { Select } from 'primeng/select'; // Confirmado para v21+
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext'; // Importante para os inputs
import { InputNumberModule } from 'primeng/inputnumber'; // Opcional, para valor monetário

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    CardModule, 
    DialogModule, 
    Select, 
    ButtonModule,
    InputTextModule,
    InputNumberModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  meses = [
    { nome: 'JAN', val: 1 }, { nome: 'FEV', val: 2 }, { nome: 'MAR', val: 3 },
    { nome: 'ABR', val: 4 }, { nome: 'MAI', val: 5 }, { nome: 'JUN', val: 6 },
    { nome: 'JUL', val: 7 }, { nome: 'AGO', val: 8 }, { nome: 'SET', val: 9 },
    { nome: 'OUT', val: 10 }, { nome: 'NOV', val: 11 }, { nome: 'DEZ', val: 12 }
  ];

  anoAtual = 2026;
  mesSelecionado: any = null;
  gastos: any[] = [];
  resumo: any = null;
  loading = false;
  
  // Modal de adicionar
  displayAddModal = false;
  novoGasto: any = { descricao: '', valor: null, cartao: null };
  
  opcoesCartao = [
    { label: 'Nubank', value: 'Nubank' }, 
    { label: 'Itaú', value: 'Itaú' },
    { label: 'Outro', value: 'Outro' }
  ];

  constructor(private supabase: SupabaseService) {}

  ngOnInit() {
    // Opcional: Já carregar o mês atual ao entrar
    // const mesAtual = new Date().getMonth() + 1;
    // this.selecionarMes(this.meses.find(m => m.val === mesAtual));
  }

  async selecionarMes(mes: any) {
    this.mesSelecionado = mes;
    await this.carregarGastos(mes.val, this.anoAtual);
  }

  async carregarGastos(mes: number, ano: number) {
    this.loading = true;
    this.resumo = null; // Limpa visualização anterior

    // Pega o primeiro e o último dia do mês corretamente (evita erro de fev/30)
    const dataInicio = new Date(ano, mes - 1, 1).toISOString();
    const dataFim = new Date(ano, mes, 0, 23, 59, 59).toISOString(); // Dia 0 do próximo mês = último desse mês

    const { data, error } = await this.supabase.client
      .from('gastos')
      .select('*')
      .gte('data_gasto', dataInicio)
      .lte('data_gasto', dataFim);

    if (error) {
      console.error('Erro ao buscar gastos:', error);
    } else if (data) {
      this.processarDadosParaVisualizacao(data);
    }
    
    this.loading = false;
  }

  processarDadosParaVisualizacao(dados: any[]) {
    // Mapeamento REAL baseado nos seus prints
    const usersMap: any = {
      '5f556ad3-7969-47b6-888b-f1b4d5214fa2': 'Miguel',
      '5b3947f0-2824-414d-9fb8-2e2a1c0663b7': 'Sarah'
    };

    let totalGeral = 0;
    const agrupamento: any = {};

    dados.forEach(g => {
      // Garante que o valor seja número
      const valor = Number(g.valor);
      totalGeral += valor;

      // Identifica o nome pelo ID
      const nome = usersMap[g.user_id] || 'Outro';
      
      if (!agrupamento[nome]) agrupamento[nome] = {};
      if (!agrupamento[nome][g.cartao]) agrupamento[nome][g.cartao] = 0;
      
      agrupamento[nome][g.cartao] += valor;
    });

    this.resumo = {
      total: totalGeral,
      usuarios: Object.keys(agrupamento).map(nome => ({
        nome,
        cartoes: Object.keys(agrupamento[nome]).map(cartao => ({
          nome: cartao,
          valor: agrupamento[nome][cartao]
        }))
      }))
    };
  }

  abrirModalAdicionar() {
    if (!this.mesSelecionado) {
      alert('Selecione um mês primeiro!');
      return;
    }
    this.novoGasto = { descricao: '', valor: null, cartao: null };
    this.displayAddModal = true;
  }

  async salvarGasto() {
    if (!this.novoGasto.descricao || !this.novoGasto.valor || !this.novoGasto.cartao) {
      alert('Preencha todos os campos');
      return;
    }

    const user = await this.supabase.client.auth.getUser();
    
    if (!user.data.user) {
        alert('Usuário não logado');
        return;
    }

    // CRÍTICO: Define a data do gasto para o dia 1 do MÊS SELECIONADO no dashboard
    // Assim, se você estiver em Maio editando Janeiro, o gasto vai para Janeiro.
    const dataDoGasto = new Date(this.anoAtual, this.mesSelecionado.val - 1, 1);

    const { error } = await this.supabase.client.from('gastos').insert({
      descricao: this.novoGasto.descricao,
      valor: this.novoGasto.valor,
      cartao: this.novoGasto.cartao,
      data_gasto: dataDoGasto, 
      user_id: user.data.user.id
    });
    
    if (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar gasto');
    } else {
        this.displayAddModal = false;
        // Recarrega os dados para mostrar o novo valor
        this.selecionarMes(this.mesSelecionado); 
    }
  }
}