import React from 'react';

import { WidgetFactory } from 'src/widgets';

interface WidgetConfig {
    key: string;
    title: string;
    path: string;
}

interface State {
    configStr: string;
    config: WidgetConfig[];
    rows: number;
}

function stringNotNullOrWhitspace(str?: string | null): str is string {
    return str != null && str.trim() !== '';
}

function isWdigetConfig(c: any): c is WidgetConfig {
    if (c != null && typeof c === 'object') {
        const config = c as WidgetConfig;
        return (
            stringNotNullOrWhitspace(c.key) &&
            stringNotNullOrWhitspace(c.title) &&
            stringNotNullOrWhitspace(c.path)
        );
    }
    return false;
}

const DEFAULT_CONFIG: WidgetConfig[] = [{ key: 'default', path: 'foo.A', title: 'Foo A' }];

const PATH_OPTIONS = ['foo.A', 'foo.B', 'bar.A', 'bar.B'];

function range(start: number, end: number, increment: number = 1) {
    const result = [];
    for (let i = start; i < end; i = i + increment) {
        result.push(i);
    }
    return result;
}

export class Thing extends React.PureComponent<{}, State> {
    public state: State = {
        config: DEFAULT_CONFIG,
        configStr: JSON.stringify(DEFAULT_CONFIG, undefined, 4),
        rows: 1
    };

    private onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ configStr: e.target.value }, this.tryParseConfig);
    };

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
    };

    private onAddRandom = () => {
        const n: WidgetConfig = {
            key: Date.now().toString() + Math.round(Math.random() * 100).toString(),
            path: PATH_OPTIONS[Math.floor(Math.random() * PATH_OPTIONS.length)],
            title: 'A Random Component'
        };

        this.setState(state => {
            const config = [...state.config, n];
            return {
                config,
                configStr: JSON.stringify(config, undefined, 4)
            };
        });
    };

    private onAddRow = () => {
        this.setState(state => ({ ...state, rows: state.rows + 1 }));
    }

    public render(): React.ReactNode {
        return (
            <div className="row">
                <div className="col-3" style={{ display: 'flex', flexDirection: 'column' }}>
                    <button className="btn btn-primary" type="button" onClick={this.onAddRandom}>
                        Add Random
                    </button>
                    <button className="btn btn-secondary" type="button" onClick={this.onAddRow}>
                        Add Row
                    </button>
                    <div className="form-group" style={{ flex: '1'}}>
                        <label htmlFor="config">Config</label>                        
                        <textarea
                            className="form-control"
                            id="config"
                            style={{ height: '100%', width: '100%' }}
                            onChange={this.onInputChange}
                            value={this.state.configStr}
                        />
                    </div>
                    <div style={{ flex: 1, position: 'relative' }}>
                    </div>
                </div>
                <div className="col">
                    {range(0, this.state.rows).map(i => (
                        <div
                            key={i}
                            className="row"
                        >
                            {this.state.config.map(c => (
                                <WidgetFactory
                                    key={c.key}
                                    widgetPath={c.path}
                                    title={`${c.title} ${i}`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
