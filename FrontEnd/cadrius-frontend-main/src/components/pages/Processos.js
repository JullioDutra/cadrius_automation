// src/components/pages/Processos.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './css/Processos.module.css';
// BarraSup já está no MainLayout, mas mantemos a importação caso seja usada em outro contexto ou removida do layout
// import BarraSup from "../layout/BarraSup"; 
import Card from "../layout/Card";
import TextoCarregando from '../layout/TextoCarregando';
import StatusBadge from '../layout/StatusBadge';

// --- Componente Auxiliar: Sugestões da IA ---
function AISuggestions({ suggestions }) {
    if (!suggestions || suggestions.length === 0) return null;

    // Pega apenas o primeiro item para exibir como destaque
    const topItem = suggestions[0];
    const numero = topItem.extracted_data?.numero_processo || "N/D";

    return (
        <Card>
            <div className={styles.ai_content}>
                <h3 className={styles.ai_title}>Sugestões da IA 🤖</h3>
                <div className={styles.suggestion_item}>
                    <p className={styles.suggestion_text}>
                        Detectei movimentação recente no processo <span className={styles.process_num}>{numero}</span>.
                    </p>
                    <button className={styles.suggestion_button}>Ver detalhes</button>
                </div>
            </div>
        </Card>
    );
}

// --- Componente Principal: Tabela de Processos ---
function ProcessTable({ data, onReprocess }) {
    return (
        <div className={styles.process_table_container}>

            {/* Controles */}
            <div className={styles.controls_header}>
                <div className={styles.search_container}>
                    <input type="text" placeholder="Buscar por número ou parte..." className={styles.search_input} />
                    <i data-feather="search" className={styles.search_icon}></i>
                </div>
                <select className={styles.filter_select}>
                    <option>Todos os Status</option>
                    <option>Extraído</option>
                    <option>Pendente</option>
                </select>
            </div>

            {/* Tabela */}
            <table className={styles.table_base}>
                <thead className={styles.table_header}>
                    <tr>
                        <th className={styles.th}>Nº PROCESSO / ASSUNTO</th>
                        <th className={styles.th}>REMETENTE</th>
                        <th className={styles.th}>STATUS</th>
                        <th className={styles.th}>RECEBIDO EM</th>
                        <th className={styles.th}>PRAZOS (IA)</th>
                        <th className={styles.th}>AÇÕES</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => {
                        // Extrai dados seguros (com fallback se a IA não tiver rodado ainda)
                        const extra = item.extracted_data || {};
                        // Tenta pegar o número do processo, senão usa o assunto cortado
                        const numero = extra.numero_processo || (item.subject ? item.subject.substring(0, 30) + "..." : "(Sem Assunto)");
                        const prazo = extra.prazo_fatal ? `${extra.prazo_fatal}` : "-";

                        // Formata data
                        const dataRecebimento = item.received_at ? new Date(item.received_at).toLocaleDateString('pt-BR') : "-";

                        return (
                            <tr key={item.id} className={styles.table_row}>
                                <td className={styles.td_num} title={item.subject}>
                                    {numero}
                                </td>
                                <td className={styles.td}>{item.sender}</td>
                                <td className={styles.td}>
                                    {/* Badge Simples baseado no status */}
                                    <StatusBadge
                                        status={item.status}
                                        text={item.status_display}>
                                    </StatusBadge>
                                </td>
                                <td className={styles.td}>{dataRecebimento}</td>
                                <td className={styles.td_deadline}>{prazo}</td>
                                <td className={styles.td_actions}>
                                    <button className={styles.action_btn} title="Ver Detalhes">
                                        <i data-feather="eye" className={styles.action_icon}></i>
                                    </button>

                                    {/* Botão de Reprocessar (Chama API) */}
                                    <button
                                        className={styles.action_btn}
                                        title="Reprocessar com IA"
                                        onClick={() => onReprocess(item.id)}
                                    >
                                        <i data-feather="zap" className={styles.action_icon}></i>
                                    </button>

                                    <button className={styles.action_btn} title="Arquivar">
                                        <i data-feather="trash-2" className={styles.action_icon}></i>
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {data.length === 0 && (
                <div className={styles.empty_message}>
                    Nenhum processo ou e-mail encontrado.
                </div>
            )}
        </div>
    );
}

function Processos() {
    const [processos, setProcessos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Função para carregar dados
    const loadData = async () => {
        setLoading(true);
        try {
            const response = await api.get('emails/');
            // O Django Pagination retorna { results: [...] }, ou lista direta dependendo da config
            const data = response.data.results ? response.data.results : response.data;
            setProcessos(data);
        } catch (error) {
            console.error("Erro ao buscar processos:", error);
        } finally {
            setLoading(false);
        }
    };

    // Carrega ao montar a tela
    useEffect(() => {
        loadData();
    }, []);

    // Ação de Reprocessar
    const handleReprocess = async (id) => {
        try {
            // Chama o endpoint customizado definido no Django (views.py -> reprocess)
            await api.post(`emails/${id}/reprocess/`);
            alert("Processo enviado para re-análise da IA!");
            loadData(); // Recarrega a lista para ver o novo status
        } catch (error) {
            console.error("Erro ao reprocessar:", error);
            alert("Não foi possível reprocessar.");
        }
    };

    // Filtra itens que a IA já extraiu algo relevante para mostrar na sidebar
    const suggestionItems = processos.filter(p => p.extracted_data && p.extracted_data.numero_processo);

    return (
        <div className={styles.processos_container}>

            <div className={styles.main_grid_layout}>

                {/* 1. Área Principal (Tabela) */}
                <div className={styles.table_area}>
                    {loading ? <TextoCarregando text={'Carregando Processos...'}></TextoCarregando> : (
                        <ProcessTable data={processos} onReprocess={handleReprocess} />
                    )}
                </div>

                {/* 2. Área Lateral (Sugestões IA) */}
                <div className={styles.sidebar_area}>
                    <AISuggestions suggestions={suggestionItems} />
                </div>

            </div>
        </div>
    );
}

export default Processos;