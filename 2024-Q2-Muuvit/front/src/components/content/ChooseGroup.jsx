import axios from "axios";
import {useLoginData} from "@context/useLoginData.jsx";
import {useEffect} from "react";


/**
 * Show a list of user's groups, and let the user choose one of them.
 * @param onGroupChosen Is called upon selecting a group. It should take a group object as a parameter.
 * @returns {JSX.Element}
 * @constructor
 */
const ChooseGroup = ({onGroupChosen}) => {

    const creds = useLoginData();
    const [myGroups, setMyGroups] = useState([]);

    const getMyGroups = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/group/private/allmygroups`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${creds.token}`
                    }
                });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    useEffect(() => {
        const resp = getMyGroups();
        if (resp instanceof Error) {
            console.error(resp);
        } else {
            setMyGroups(resp);
        }
    }, []);
    return (
        <div>
            {myGroups.map((group, index) => {
                return (
                    <div key={index} onClick={() => onGroupChosen(group)}>
                        <h3>{group?.groupName}</h3>
                        <p>{group?.groupDescription}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default ChooseGroup;