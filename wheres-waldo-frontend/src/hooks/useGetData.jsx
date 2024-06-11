import { useState } from "react";

export default function useGetData(){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const server = import.meta.env.VITE_SERVER

    const getData = async (url) => {
        setLoading(true);
        setError(null);
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
    return { loading, error, data, getData }
}