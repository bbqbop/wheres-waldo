import { Link } from "react-router-dom";

export default function ErrorPage(){
    return(
        <div className="error">
            <h2>Sorry, couldn't find page</h2>
            <hr />
            <Link to="/">Home</Link>
        </div>
    )
}