/// Renders desktop icon
function Icon({id, icon, title, open}) {
    return (
        <div className="icon" onDoubleClick={() => open(id)}>
            <img src={icon} alt={title + " icon"} />
            <p>{title}</p>
        </div>
    );
}

export default Icon;
