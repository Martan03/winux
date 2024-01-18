/// Renders desktop icon
function Icon({app, wm}) {
    const open = () => {
        if (app.Exec)
            wm.addFromFile(app);
        else
            wm.add(app);
    }

    const icon = app.Icon ?? app.icon;
    const name = app.Name ?? app.name;

    return (
        <div className="icon" onDoubleClick={() => open(app)}>
            <img src={icon} alt={name + " icon"} />
            <p>{name}</p>
        </div>
    );
}

export default Icon;
