import styles from './css/Container.module.css'



function Container(props) {
    return (
        <div>
            {props.children}
        </div >
    )
}

export default Container 