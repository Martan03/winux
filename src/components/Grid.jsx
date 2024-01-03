import Icon from "./Icon";

/// Renders grid of icons
function Grid({apps, open}) {
    return (
        <div className="grid">
            {apps.map((app, id) => (
                <Icon
                    key={id}
                    id={id}
                    icon={app.icon}
                    title={app.title}
                    open={open}
                />
            ))}
        </div>
    )
}

export default Grid;
