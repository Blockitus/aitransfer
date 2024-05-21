import { useState } from "react";

export default function TextArea({message}) {
    return (
        <div className="input-group">
            <textarea 
                className="form-control" 
                aria-label="With textarea"
                value={message}
                readOnly/>
        </div>
    
    );

}