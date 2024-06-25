import { useCallback, useEffect, useState } from "react"
import { useAuth } from "../contexts/authContext";

export default function useData(){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const { isLoggedIn } = useAuth();

    const server = import.meta.env.VITE_SERVER

    const sendData = async function(url, data, method = "POST"){
        setLoading(true);
        setError(null);
        setData(null)
        try {
            const isFormData = data instanceof FormData;
            const headers = {};
            if (isLoggedIn) headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
            if (!isFormData) headers["Content-Type"] = "application/json";
            
            const response = await fetch(`${server}${url}`, {
                method: method,
                mode: "cors",
                headers: headers,
                body: method == "DELETE" ? null : isFormData ? data : JSON.stringify(data)
            });

            if (!response.ok){
                throw new Error(response.message || response.status + ': ' + response.statusText || "Something went wrong")
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
            const headers = {}
            if (isLoggedIn || localStorage.user) headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;

            const response = await fetch(server + url, {
                mode: 'cors',
                headers: headers,
            })
            if (!response.ok){
                throw new Error(response.message || response.status + ': ' + response.statusText || "Something went wrong")
            }
            const result = await response.json()
            setData(result)
            return true
        } catch (error) {
            setError(error)
            return false
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, data, sendData, getData };
}