import { useState } from "react"
import { useAuth } from "../contexts/authContext";
import { Link } from "react-router-dom";
import useSendData from "../hooks/useData"
import Game from "./Game";
import styles from "./forms.module.css"

export default function CreateGame(){
    const { isLoggedIn } = useAuth()

    const { loading, error, data, sendData } = useSendData()

    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        // Create a preview URL for the selected image
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result)
        }
        reader.readAsDataURL(file);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('title', title),
        formData.append('image', image)

        const result = await sendData('/games', formData)
    }

    if (!isLoggedIn){
        return (
            <div>
                <h2>Login to create games!</h2>
                <hr />
                <Link to="/login">Login </Link>
            </div>
        )
    }

    if (data){
        const { game } = data
        return (
            <Game data={game} mode="setup" />
        )
    }

    return (
        <div className={styles.body}>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label>Game title
                    <input 
                        type="text"
                        name="title" 
                        placeholder="Enter title" 
                        value={title} 
                        onChange={(e)=>setTitle(e.target.value)}
                        required 
                    />
                </label>
                <label className={styles.customFileInput}>Upload Image
                    <input 
                        className={styles.fileInput}
                        type="file" 
                        accept="image/*" 
                        placeholder="Upload Image" 
                        onChange={handleImageChange}
                        required
                    />
                </label>
                    <button type="submit">Submit</button>
            </form>
            {imagePreview && (
                <div>
                    <h3>Image Preview: </h3>
                    <img src={imagePreview} alt="Preview" style={{ width: '300px', height: 'auto' }} />
                </div>
            )}
            {loading && <p>'...loading'</p>}
            {error && <p>{error.message}</p>}

            <hr />

            <Link to="/">Home </Link>

        </div>
    )
}