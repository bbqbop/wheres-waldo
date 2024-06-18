import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext"

export default function SignUp(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [localError, setLocalError] = useState('');

    const { signUp, loading, error, clearError } = useAuth();
    const navigate = useNavigate()


    useEffect(()=> {
        clearError();
    },[])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!username.trim()){
            setLocalError('Enter username')
            return
        } 
        if(!password.trim()){
            setLocalError('Enter password')
            return
        }
        setLocalError('');
        const success = await signUp(username, password, firstname, lastname)
        if (success) {
            setLocalError(success.message)
            setTimeout(()=>{
                navigate("/")
            }, 1000)
        }
    }

    return(
        <>
            <p>Sign up</p>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Username"
                    value={username} 
                    onChange={e => setUsername(e.target.value)}
                    required   
                />
                <input 
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required  
                />
                <input 
                    type="text"
                    name="firstname"
                    id="firstname"
                    placeholder="First Name"
                    value={firstname} 
                    onChange={e => setFirstname(e.target.value)} 
                    required  
                />
                <input 
                    type="text"
                    name="lastname"
                    id="lastname"
                    placeholder="Last Name"
                    value={lastname} 
                    onChange={e => setLastname(e.target.value)}  
                    required 
                />
                <button type="submit">Submit</button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {localError && <p>{localError}</p>}
        </>
    )
}