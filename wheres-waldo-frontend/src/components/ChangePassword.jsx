import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import useData from "../hooks/useData"

export default function ChangePassword(){
    const { sendData, loading, error } = useData();
    const [ localError, setLocalError ] = useState();
    let { user } = useAuth();
    const [ oldPassword, setOldPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ newPassword, setNewPassword ] = useState('')
    
    const handleSubmit = async() => {
        if (!oldPassword.trim() || !newPassword.trim()) return setLocalError('Passwords must be entered.');
        if ( oldPassword !== confirmPassword ) return setLocalError('Passwords must match.')
        
        const result = await sendData(`/user/${user._id}/change-password`, { oldPassword, newPassword }, "PUT")
        if(result) setLocalError(result.message)
    }

    return (
        <div>
            {user && <h2>Change password for {user.username}</h2>}
            <table>
                <tbody>
                    <tr>
                        <th>
                            Enter Password  
                        </th>
                        <td>
                            <input 
                                type="password" 
                                name="oldPassword"
                                id="oldPassword"
                                value={oldPassword}
                                onChange={(e)=>setOldPassword(e.target.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Confirm Password  
                        </th>
                        <td>
                            <input 
                                type="password" 
                                name="confirmPassword"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e)=>setConfirmPassword(e.target.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Enter New Password  
                        </th>
                        <td>
                            <input 
                                type="password" 
                                name="newPassword"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e)=>setNewPassword(e.target.value)}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <button type="submit" onClick={handleSubmit}>Submit</button>

            <hr />
            <Link to="/">Home </Link>


            {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>} 
            {localError && <p>{localError}</p>}
        </div>
    )
}