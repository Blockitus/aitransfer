import { useState } from "react";
import './index.css';

export default function MagicBox ({prompt, setPrompt, handleClick}) {
    return (
        <div class="input-group mb-3">
            <input 
            type="text"
            class="form-control" 
            placeholder="Write an orden. e.g: What is my balance account" 
            aria-describedby="button-addon2"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}/>
            
            <button 
            class="btn btn-outline-secondary" 
            type="button" 
            onClick={handleClick} 
            id="button-addon2">Send</button>
        </div>
    );
}