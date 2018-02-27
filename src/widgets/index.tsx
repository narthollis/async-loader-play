import React from 'react';

import { WidgetProps } from 'src/widgets/types';
import { Omit } from 'src/util.types';

export interface WidgetControllerProps extends WidgetProps {
    widget: React.ComponentClass<WidgetProps> | React.SFC<WidgetProps>;
}

export class DefaultController extends React.PureComponent<WidgetControllerProps> {
    public render(): React.ReactNode {
        const Widget = this.props.widget;
        const props = { ...this.props };
        delete props.widget;

        return <Widget {...props} />;
    }
}

interface AsyncWidgetInjectedProps {
    renderCount: number;
}
interface AsyncWidgetProps extends Omit<WidgetProps, keyof AsyncWidgetInjectedProps> {
    controller: string;
    widget: string;
}

type WidgetControllerComponent =
    | React.ComponentClass<WidgetControllerProps & AsyncWidgetInjectedProps>
    | React.SFC<WidgetControllerProps & AsyncWidgetInjectedProps>;
type WidgetComponent =
    | React.ComponentClass<WidgetProps & AsyncWidgetInjectedProps>
    | React.SFC<WidgetProps & AsyncWidgetInjectedProps>;

interface AsyncWidgetState {
    controller?: WidgetControllerComponent | null;
    widget?: WidgetComponent | null;
}
class AsyncWidget extends React.PureComponent<AsyncWidgetProps, AsyncWidgetState> {
    private static controllerCache: Record<string, WidgetControllerComponent> = {};
    private static widgetCache: Record<string, WidgetComponent> = {};

    public state: AsyncWidgetState = {};

    private renderCount: number = 0;

    public componentWillMount(): void {
        if (AsyncWidget.controllerCache[this.props.controller] != null) {
            this.setState({ controller: AsyncWidget.controllerCache[this.props.controller] });
        } else {
            import(`src/widgets/${this.props.controller}/`).then(
                module => {
                    AsyncWidget.controllerCache[this.props.controller] = module.default;
                    this.setState({ controller: module.default })
                },
                () => this.setState({ controller: DefaultController })
            );
        }

        const widgetKey = `${this.props.controller}/${this.props.widget}`;
        if (AsyncWidget.widgetCache[widgetKey] != null) {
            this.setState({ widget: AsyncWidget.widgetCache[widgetKey]  });
        } else {
            import(`src/widgets/${this.props.controller}/${this.props.widget}`).then(
                module => {
                    AsyncWidget.widgetCache[widgetKey] = module.default;
                    this.setState({ widget: module.default });
                },
                () => this.setState({ widget: null })
            );
        }
    }

    public render(): React.ReactNode {
        this.renderCount++;

        if (this.state.controller != null && this.state.widget != null) {
            const Controller = this.state.controller;
            const props = { ...this.props };

            delete props.widget;
            delete props.controller;

            return (
                <Controller {...props} widget={this.state.widget} renderCount={this.renderCount} />
            );
        }

        if (this.state.controller === null) {
            return 'Controller Not Found';
        }

        if (this.state.widget === null) {
            return 'Widget Not Found';
        }

        return 'loading...';
    }
}

export interface WidgetFactoryProps {
    title: string;
    widgetPath: string;
}
export class WidgetFactory extends React.PureComponent<WidgetFactoryProps> {
    public render() {
        const [controller, widget] = this.props.widgetPath.split('.');

        const props = { ...this.props };
        delete props.widgetPath;

        return <AsyncWidget controller={controller} widget={widget} title={this.props.title} />;
    }
}
