import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useData from "../hooks/useData";

export default function UserInfo(){
    const { loading, error, data, getData, sendData } = useData();
    const [ localError, setLocalError ] = useState('');
    const { id } = useParams()

    const [ user, setUser ] = useState(null)

    const [ dataHasChanged, setDataHasChanged ] = useState(false);

    useEffect(()=>{
        getData(`/user/${id}`)
    },[id])

    useEffect(() => {
        if (data) {
            setUser(data.user)
        }
    }, [data])

    const handleSubmit = async() => {
        const result = await sendData(`/user/${id}`, user, 'PUT')
        setLocalError(result.message)
        setTimeout(()=>setLocalError(''), 2000)
    }
    
    return (
        <div>
            <h2>User info</h2>
            {user && 
                <table>
                    <tbody>
                        <TableRow field="username" user={user} setUser={setUser} setDataHasChanged={setDataHasChanged}/>
                        <TableRow field="firstname" user={user} setUser={setUser} setDataHasChanged={setDataHasChanged}/>
                        <TableRow field="lastname" user={user} setUser={setUser} setDataHasChanged={setDataHasChanged}/>
                        <TableRow field="password" user={user} setUser={setUser} setDataHasChanged={setDataHasChanged}/>
                    </tbody>
                </table>
            }
            {dataHasChanged && <button onClick={handleSubmit}>Submit</button>}
            <hr />
            {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>} 
            {localError && <p>{localError}</p>}
        </div>
    )
}

function TableRow({user, setUser, field, setDataHasChanged}){
    const onChangeInput = (e) => {
        const { name, value } = e.target
        const editData = {...user, [name]: value}
        setUser(editData)
        setDataHasChanged(true)
    }

    return (
        <tr>
            <th>{field[0].toUpperCase() + field.slice(1)}:</th>
            <td>
                {field == "password" ? (
                    <Link to={`/user/${user._id}/change-password`}>Change password</Link>
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


