import React from "react";

import styles from "./css/PaginatorNavigateMenu.module.css";

/**
 * Paginator to navigate between pages
 * @param currentPage A number representing the current page
 * @param totalPages A number representing the total number of pages
 * @param onPageChange A function which takes an argument of the new page number.
 * @returns {Element}
 * @constructor
 */
const PaginatorNavigateMenu = ({currentPage, totalPages, onPageChange}) => {

    const nextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    }
    const previousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    }
    const firstPage = () => {
        onPageChange(1);
    }
    const lastPage = () => {
        onPageChange(totalPages);
    }

    let directLinks = [];
    for (let i = Math.max(1, currentPage - 3); i < Math.min(totalPages + 1, currentPage + 3); i++) {
        if (i > 0) {
            let val = i === currentPage ? <span key={i} className={styles.selectedPageNumber}>{i}</span> : <span className={styles.navButton} key={i} onClick={() => onPageChange(i)}>{i}</span>;
            directLinks.push(
                val
            );
        }
    }

    return (
        <div className={styles.container}>
            <span className={`${styles.hideOnSmallScreen} ${styles.navButton}`} onClick={firstPage}>Ensimmäinen sivu</span>
            <span className={`${styles.navButton}`} onClick={previousPage}>Edellinen</span>
            <span className={`${styles.hideOnSmallScreen} ${styles.pageNumbers}`}>{currentPage < 5 ? "" : "..."}{directLinks}{currentPage >= totalPages - 5 ? "" : "..."}</span>
            <span className={`${styles.hideOnLargeScreen} ${styles.pageNumbers} ${styles.selectedPageNumber}`}>{currentPage}</span>
            <span className={`${styles.navButton}`} onClick={nextPage}>Seuraava</span>
            <span className={`${styles.hideOnSmallScreen} ${styles.navButton}`} onClick={lastPage}>Viimeinen sivu ({totalPages})</span>
        </div>
    )
}

export default PaginatorNavigateMenu;