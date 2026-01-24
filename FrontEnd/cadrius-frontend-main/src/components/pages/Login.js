// src/components/pages/Login.js
import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import styles from './css/Login.module.css';

import InputPadrao from '../layout/InputPadrao';
import BotaoLogin from '../layout/BotaoLogin';

import { FaCog } from "react-icons/fa";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [lembrar, setLembrar] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('auth/token/', {
                username: username,
                password: password
            });


            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            navigate('/dashboard');

        } catch (err) {
            console.error("Erro no login:", err);
            setError('Falha no login. Verifique suas credenciais.');
        }
    };

    return (
        // Container Principal (Para centralização e fundo da tela)
        <div className={styles.login_container}>

            {/* Card de Login - Container principal do formulário e cabeçalho */}
            <div className={styles.login_card}>

                {/* Seção de Cabeçalho (Logo e Títulos) */}
                <div className={styles.header_section}>
                    <FaCog className={styles.logo_icon} />
                    <h2 className={styles.title}>CADRIUS AI</h2>
                    <p className={styles.subtitle}>Portal de automação inteligente</p>
                </div>

                {/* Área do Formulário */}
                <form onSubmit={handleSubmit} className={styles.form_area}>

                    {/* Input E-mail */}
                    <div className={styles.input_group}>
                        <InputPadrao
                            nome="username"
                            labelConteudo="Username"
                            placeholder="Username"
                            tipo="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {/* Input Senha */}
                    <div className={styles.input_group}>
                        <InputPadrao
                            nome="senha"
                            labelConteudo="Senha"
                            placeholder="*******"
                            tipo="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Opções: Lembrar de mim / Esqueceu a senha */}
                    <div className={styles.options_group}>
                        {/* Checkbox (Lembrar de mim) */}
                        <InputPadrao
                            nome="lembrar"
                            tipo="checkbox"
                            labelConteudo="Lembrar de mim"
                            value={lembrar}
                            onChange={(e) => setLembrar(e.target.checked)}
                        />
                        {/* Link Esqueceu a senha? */}
                        <a href="#" className={styles.forgot_password_link}>Esqueceu a senha?</a>
                    </div>

                    {/* Botão Principal: Acessar Portal */}
                    <BotaoLogin
                        tipo="submit"
                        texto="Acessar Portal"
                        className={styles.button_primary}
                    />

                    {/* Separador "Novo no Cadrius?" */}
                    <p className={styles.separator}>Novo no Cadrius?</p>

                    {/* Botão Secundário: Criar Conta */}
                    <BotaoLogin
                        tipo="button"
                        texto="Criar nova conta"
                        className={styles.button_secondary}
                        onClick={() => navigate('/cadastro')}
                    />

                    {error && <p className={styles.error_message}>{error}</p>}
                </form>

                {/* Rodapé (Copyright) */}
                <div className={styles.footer}>
                    <p>© 2025 Cadrius AI Systems, Tecnologia de automação inteligente.</p>
                </div>
            </div> {/* Fim do .login_card */}
        </div> /* Fim do .login_container */
    );
}

export default Login;