import { useState } from "react";
import './index.css';

export default function Connect ({address, buttonState, askToConnect}) {

    return (
        <div class="input-group mb-3">
            <button 
            class="btn btn-outline-secondary" 
            type="button" 
            id="button-addon1"
            onClick={askToConnect}
            >{buttonState}</button>
            
            <input 
            type="text" 
            class="form-control" 
            value={address} 
            aria-describedby="button-addon1"
            readOnly/>
        </div>
    )
}