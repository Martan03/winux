/// Renders desktop icon
function Icon({app, open}) {
    return (
        <div className="icon" onDoubleClick={() => open(app)}>
            <img src={app.icon} alt={app.title + " icon"} />
            <p>{app.title}</p>
        </div>
    );
}

export default Icon;
