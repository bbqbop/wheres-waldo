export default function CreateGame(){
    return (
        <div className="createGame">
            <form action="?" method="post" enctype="multipart/form-data">
                <label>Input title
                    <input name="title" placeholder="Enter title" required/>
                    <input type="file" accept="image/*" name="image" placeholder="Upload Image" required/>
                    <button type="submit">Submit</button>
                </label>
            </form>
        </div>
    )
}