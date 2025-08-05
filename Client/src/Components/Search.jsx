import React, {useState} from "react"
import {FaSearch} from "react-icons/fa"

import "./Search.css";

function SearchBar() {
    const [input, setInput] = useState("");

    const fetchData = (value) => {
        fetch("https://jsonplaceholder.typicode.com/users")
        .then((response) => response.json())
        .then((json) => {
            const results = json.filter((user) => {
                return value && user && user.name && user.name.toLowerCase().includes(value)
            });
            console.log(results);
        });
    }

    const handleChange = (value) => {
        setInput(value)
        fetchData(value)
    }
    return (
        <div className="search-bar">
            <FaSearch id="search-icon" />
            <input 
                placeholder="Search..."
                value={input}
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
    )
}

export default SearchBar;