import { useCallback, useEffect, useState } from "react"

export default function useSendData(){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const server = import.meta.env.VITE_SERVER

    const sendData = async function(url, data, method = "POST"){
        setLoading(true);
        setError(null);

        try {
            const isFormData = data instanceof FormData;
            console.log(isFormData)
            const response = await fetch(`${server}${url}`, {
                method: method,
                mode: "cors",
                headers: isFormData ? {} : { "Content-Type": "application/json"},
                body: isFormData ? data : JSON.stringify(data)
            });

            if (!response.ok){
                throw new Error(result.message || "Something went wrong")
            }
            const result = await response.json();
            setData(result)
            return true;
        } catch (error) {
            setError(error)
            return false;
        } finally {
            setLoading(false)
        }
    }
    return { loading, error, data, sendData };
}