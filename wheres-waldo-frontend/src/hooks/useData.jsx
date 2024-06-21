import { useCallback, useEffect, useState } from "react"
import { useAuth } from "../contexts/authContext";

export default function useData(){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [token, setToken] = useState(null)

    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (isLoggedIn) {
            setToken(localStorage.getItem("token"))
        }
    }, [isLoggedIn]);

    const server = import.meta.env.VITE_SERVER

    const sendData = async function(url, data, method = "POST"){
        setLoading(true);
        setError(null);
        setData(null)
        try {
            const isFormData = data instanceof FormData;
            const response = await fetch(`${server}${url}`, {
                method: method,
                mode: "cors",
                headers: isFormData && isLoggedIn || method == "DELETE" && isLoggedIn 
                            ? {"Authorization": `Bearer ${token}`} 
                            : isFormData 
                                ? {} 
                                : { "Content-Type": "application/json"},
                body: method == "DELETE" ? null : isFormData ? data : JSON.stringify(data)
            });
            if (!response.ok){
                throw new Error(result.message || "Something went wrong")
            }
            const result = await response.json();
            setData(result)
            return result;
        } catch (error) {
            setError(error)
            return false;
        } finally {
            setLoading(false)
        }
    }

    const getData = async (url) => {
        setLoading(true);
        setError(null);
        setData(null)
        try {
            const response = await fetch(server + url, {
                mode: 'cors'
            })
            const result = await response.json()
            setData(result)
            return true
        } catch(error) {
            setError(error)
            return false
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, data, sendData, getData };
}