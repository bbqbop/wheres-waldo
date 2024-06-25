import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import useData from "../hooks/useData";

export default function UserInfo(){
    const { loading, error, data, getData, sendData } = useData();
    const { setUser } = useAuth()
    const [ localError, setLocalError ] = useState('');
    const { id } = useParams()

    const [ localUser, setLocalUser ] = useState(null)

    const [ dataHasChanged, setDataHasChanged ] = useState(false);

    useEffect(()=>{
        getData(`/user/${id}`)
    },[id])

    useEffect(() => {
        if (data) {
            setLocalUser(data.user)
        }
    }, [data])

    const handleSubmit = async() => {
        const result = await sendData(`/user/${id}`, localUser, 'PUT')
        setUser(result.user)
        localStorage.setItem('user', JSON.stringify(result.user))
        setLocalError(result.message)
        setTimeout(()=>setLocalError(''), 2000)
    }
    
    return (
        <div>
            <h2>User info</h2>
            {localUser && 
                <table>
                    <tbody>
                        <TableRow field="username" user={localUser} setLocalUser={setLocalUser} setDataHasChanged={setDataHasChanged}/>
                        <TableRow field="firstname" user={localUser} setLocalUser={setLocalUser} setDataHasChanged={setDataHasChanged}/>
                        <TableRow field="lastname" user={localUser} setLocalUser={setLocalUser} setDataHasChanged={setDataHasChanged}/>
                        <TableRow field="password" user={localUser} setLocalUser={setLocalUser} setDataHasChanged={setDataHasChanged}/>
                    </tbody>
                </table>
            }
            {dataHasChanged && <button onClick={handleSubmit}>Submit</button>}
            <hr />
            <Link to="/">Home </Link>

            {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>} 
            {localError && <p>{localError}</p>}
        </div>
    )
}

function TableRow({user, setLocalUser, field, setDataHasChanged}){
    const onChangeInput = (e) => {
        const { name, value } = e.target
        const editData = {...user, [name]: value}
        setLocalUser(editData)
        setDataHasChanged(true)
    }

    return (
        <tr>
            <th>{field[0].toUpperCase() + field.slice(1)}:</th>
            <td>
                {field == "password" ? (
                    <Link to={`/user/${user._id}/change-password`}> Change password</Link>
                ) : (
                    <input  
                        name={field}
                        value={user[field]}
                        type="text"
                        onChange={onChangeInput}
                        placeholder={field}
                    />  
                )}
            </td>
        </tr>
    )
}


