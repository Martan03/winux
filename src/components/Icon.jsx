/// Renders desktop icon
function Icon({path, title}) {
    return (
        <div className="icon">
            <img src={path} alt={title + " icon"} />
            <p>{title}</p>
        </div>
    );
}

export default Icon;
