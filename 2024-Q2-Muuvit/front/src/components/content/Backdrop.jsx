import styles from './css/Backdrop.module.css';

/**
 * Backdrop component.
 * @param onClose Is a function you are supposed to provide. It takes no parameters and returns nothing.
 *                  It is supposed to toggle the backdrop off. It is assumed you use conditional rendering, and
 *                  onClose toggles state that is the condition for showing the backdrop.
 * @param children Children are anything that goes in between the Backdrop opening and closing tags.
 *                  For example, <Backdrop><p>Some text</p></Backdrop> has children <p>Some text</p>.
 * @returns {JSX.Element}
 * @constructor
 */
const Backdrop = ({ onClose, children }) => {
    return (
        <div className={styles.backdrop} onClick={onClose}>{children}</div>
    );
};

export default Backdrop;