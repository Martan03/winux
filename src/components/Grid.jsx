import Icon from "./Icon";

/// Renders grid of icons
function Grid({icons}) {
    return (
        <div className="grid">
            {icons.map((icon, id) => (
                <Icon key={id} path={icon.path} title={icon.title} />
            ))}
        </div>
    )
}

export default Grid;
