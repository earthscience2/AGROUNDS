import styles from "./Rank.module.css";
function Rank(props){
    return (
        <div className={styles.Rank}>
            <p className={styles.Content}>{props.content1}</p>
            <p className={styles.Topic}>{props.topic}</p>
            <p className={styles.Content}>{props.content2}</p>
        </div>
    )
}
export default Rank;