import { useState } from "react"
import useSendData from "../hooks/useSendData"
import Game from "./Game";

export default function CreateGame(){
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

        const result = await sendData('/game', formData)
    }

    if (data){
        const { game } = data
        return (
            <Game data={game} mode="setup" />
        )
    }

    return (
        <div className="createGame">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label>Input title
                    <input 
                        type="text"
                        name="title" 
                        placeholder="Enter title" 
                        value={title} 
                        onChange={(e)=>setTitle(e.target.value)}
                        required 
                    />
                    <input 
                        type="file" 
                        accept="image/*" 
                        placeholder="Upload Image" 
                        onChange={handleImageChange}
                        required/>
                    <button type="submit">Submit</button>
                </label>
            </form>
            {imagePreview && (
                <div>
                    <h3>Image Preview: </h3>
                    <img src={imagePreview} alt="Preview" style={{ width: '300px', height: 'auto' }} />
                </div>
            )}
            {loading && <p>'...loading'</p>}
            {error && <p>{error.message}</p>}
        </div>
    )
}