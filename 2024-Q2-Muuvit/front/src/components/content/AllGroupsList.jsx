import '../../index.css';
import PaginatedAllGroups from "@content/PaginatedAllGroups.jsx";

/**
 * AllGroupsList component is used to display all groups.
 * @param showAllGroups Boolean value to show all groups.
 * @param setShowAllGroups Function to set whether all groups should be shown.
 * @returns {Element}
 */


const AllGroupsList = ({showAllGroups, setShowAllGroups}) => {

    return (
        <div>
            {showAllGroups && <PaginatedAllGroups />}
        </div>
    )
}

export default AllGroupsList;
