/// Renders desktop icon
function Icon({app, wm}) {
    const open = () => {
        wm.addFromFile(app);
    }

    return (
        <div className="icon" onDoubleClick={() => open(app)}>
            <img src={app.Icon} alt={app.Name + " icon"} />
            <p>{app.Name}</p>
        </div>
    );
}

export default Icon;
