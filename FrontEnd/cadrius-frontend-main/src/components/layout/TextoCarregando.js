import styles from '../layout/css/TextoCarregando.module.css'

function TextoCarregando({ text }) {
    return (
        <div>
            <p className={styles.ParagrafoCarregando}>{text}</p>
        </div >
    )
}

export default TextoCarregando 