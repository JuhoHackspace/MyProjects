import React, { useState } from 'react';
import styles from './css/Notice.module.css';
import { set } from 'date-fns';

/**
 * Notice component for showing messages to the user.
 * @param noticeHeader The header of the notice.
 * @param noticeText The text of the notice.
 * @param position The position of the notice.
 * @param showSeconds The time the notice is shown in seconds.
 * @param setNotice The function to set the notice. This is used to hide the notice after a certain time.
 * @returns {Element}
 */


const Notice = React.forwardRef(
    (
        {noticeHeader, noticeText, position, showSeconds, setNotice}, ref
    ) => {
        if (showSeconds) {
            setTimeout(() => {
                setNotice({message: '', show: false});
            }, showSeconds * 1000);
        }
        return (
            <div
                ref={ref}
                className={styles.noticeContainer}
                style={{
                    position: 'fixed',
                    transform: position?.transform,
                    zIndex: 9999,
                    left: position?.left,
                    top: position?.top
                }}
            >
                <h1 className={styles.noticeHeader}>{noticeHeader}</h1>
                <p className={styles.noticeParagraph}>{noticeText}</p>
            </div>
        );
    }
);

export default Notice;