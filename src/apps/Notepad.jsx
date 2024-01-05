function Notepad({text}) {
    return (
        <div className="notepad">
            <textarea>{text ?? ''}</textarea>
        </div>
    )
}

export default Notepad;
