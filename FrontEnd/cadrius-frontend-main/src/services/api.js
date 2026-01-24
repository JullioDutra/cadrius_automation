// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1/', 
});

// 1. Interceptor de Requisição (O que já tínhamos)
// Adiciona o token no cabeçalho se ele existir
api.interceptors.request.use(async config => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. NOVO: Interceptor de Resposta (Tratamento de Erro)
api.interceptors.response.use(
    (response) => {
        // Se a resposta for sucesso, apenas retorna os dados
        return response;
    },
    (error) => {
        // Se houver erro, verifica se é 401 (Não Autorizado)
        if (error.response && error.response.status === 401) {
            console.warn("Sessão expirada ou token inválido. Redirecionando para Login...");
            
            // Limpa qualquer token inválido que possa ter sobrado
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');

            // Força o redirecionamento para a tela de Login
            // Usamos window.location aqui porque o Router não está acessível dentro do axios
            if (window.location.pathname !== '/') {
                window.location.href = '/';
            }
        }
        // Rejeita a promessa para que os componentes ainda saibam que houve erro
        return Promise.reject(error);
    }
);

export default api;