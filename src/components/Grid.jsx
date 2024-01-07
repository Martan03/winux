import Icon from "./Icon";

/// Renders grid of icons
function Grid({apps, open}) {
    return (
        <div className="grid">
            {apps.map((app, id) => (
                <Icon
                    key={id}
                    app={app}
                    open={open}
                />
            ))}
        </div>
    )
}

export default Grid;
