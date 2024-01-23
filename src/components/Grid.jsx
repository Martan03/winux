import { getAppsFromDir } from "../core/Apps";
import Icon from "./Icon";

/// Renders grid of icons
function Grid({fs, wm}) {
    const desktop = fs.getDir(fs.root, '/home/visitor/Desktop');
    const apps = getAppsFromDir(desktop);

    return (
        <div className="grid">
            {apps.map((app, id) => (
                <Icon
                    key={id}
                    app={app}
                    wm={wm}
                />
            ))}
        </div>
    )
}

export default Grid;
