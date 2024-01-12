import Icon from "./Icon";

/// Renders grid of icons
function Grid({apps, open, fs}) {
    let keys = Object.keys(fs.root.children);
    return (
        <div className="grid">
            {apps.map((app, id) => (
                <Icon
                    key={id}
                    app={app}
                    open={open}
                />
            ))}
            {keys.map((key) => (
          <li key={key}>
            <strong>{key}:</strong>
          </li>
        ))}
        </div>
    )
}

export default Grid;
