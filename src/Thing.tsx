import React from 'react';

import {WidgetFactory} from 'src/widgets';

interface WidgetConfig {
    key: string;
    title: string;
    path: string;
}

interface State {
    configStr: string;
    config: WidgetConfig[];
}

function stringNotNullOrWhitspace(str?: string | null): str is string {
    return str != null && str.trim() !== '';
}

function isWdigetConfig(c: any): c is WidgetConfig {
    if (c != null && typeof c === 'object') {
        const config = c as WidgetConfig;
        return stringNotNullOrWhitspace(c.key) && stringNotNullOrWhitspace(c.title) && stringNotNullOrWhitspace(c.path);
    }
    return false;
}

const DEFAULT_CONFIG: WidgetConfig[] = [
    { key: 'default', path: 'foo.A', title: 'Foo A' }
];

export class Thing extends React.PureComponent<{}, State> {
    public state: State = {
        config: DEFAULT_CONFIG,
        configStr: JSON.stringify(DEFAULT_CONFIG, undefined, 4)
    }

    private onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ configStr: e.target.value }, this.tryParseConfig);         
    }

    private tryParseConfig = () => {
        try {
            const config = JSON.parse(this.state.configStr);
            if (Array.isArray(config)) {
                if (config.reduce((prev, cur) => prev && isWdigetConfig(cur), true)) {
                    this.setState({ config: config });
                }
            }
        } catch (e) {
            // pass
        }
    }

    public render(): React.ReactNode {
        return (
            <div>
                <textarea onChange={this.onInputChange} value={this.state.configStr} />

                {this.state.config.map(c => (
                    <WidgetFactory key={c.key} widgetPath={c.path} title={c.title} />
                ))}
            </div>
        );
    }
}
