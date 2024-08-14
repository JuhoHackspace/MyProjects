import React from 'react'
import { useLoginData } from '@context/useLoginData'
import styles from './css/ShareFavourites.module.css'
import { useEffect, useState } from 'react'
import { set } from 'date-fns'

export default function ShareFavourites({share_slur, setShowShareFavourites}) {
    const loginData = useLoginData()
    const [sharedLink, setSharedLink] = useState('')
    const [statusMessage, setStatusMessage] = useState('')
    const [linkCreated, setLinkCreated] = useState(false)

    const createLink = () => {
        console.log('Creating link for user:', loginData.userName);
        const link = `${window.location.origin}/sharedLists/${loginData.userName}/${share_slur}`;
        setSharedLink(link);
        setStatusMessage('Linkki luotu');
        setLinkCreated(true);
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(sharedLink);
        setStatusMessage('Linkki kopioitu leikepöydälle');
    }

return (
    <div className={styles.linkBox}>
            <div className={styles.upper}>
                <h2 className={styles.heading}>Jaa suosikkilistasi</h2>
                <button className={styles.createLink} onClick={createLink}>Luo linkki</button>
            </div>
            {linkCreated && <div className={styles.line}>
                <input className={styles.input} type="text" value={sharedLink} readOnly />
                <p className={styles.status}>{statusMessage}</p>
            </div>}
            <div className={styles.buttons}>
                <button onClick={() => copyToClipboard()}>Kopioi</button>
                <button onClick={() => setShowShareFavourites(false)}>Sulje</button>
            </div>
    </div>
)
}
