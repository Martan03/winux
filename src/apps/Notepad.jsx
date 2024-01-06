import { useState } from "react";

function Notepad({text}) {
    const [value, setValue] = useState(text ?? '');

    return (
        <div className="notepad">
            <textarea value={value} onChange={(e) => setValue(e.value)} />
        </div>
    )
}

export default Notepad;
