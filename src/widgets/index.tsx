import React from 'react';

import { WidgetProps } from 'src/widgets/types';

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

interface AsyncWidgetProps extends WidgetProps {
    controller: string;
    widget: string;
}
interface AsyncWidgetState {
    controller?: React.ComponentClass<WidgetControllerProps> | React.SFC<WidgetControllerProps> | null;
    widget?: React.ComponentClass<WidgetProps> | React.SFC<WidgetProps> | null;
}
class AsyncWidget extends React.PureComponent<AsyncWidgetProps, AsyncWidgetState> {
    public state: AsyncWidgetState = {};

    public componentDidMount(): void {
        import(`src/widgets/${this.props.controller}/`).then(
            module => this.setState({ controller: module.default }),
            () => this.setState({ controller: DefaultController })
        );

        import(`src/widgets/${this.props.controller}/${this.props.widget}`).then(
            module => this.setState({ widget: module.default }),
            () => this.setState({ widget: null })
        );
    }

    public render(): React.ReactNode {
        if (this.state.controller != null && this.state.widget != null) {
            const Controller = this.state.controller;
            const props = { ...this.props };

            delete props.widget;
            delete props.controller;

            return <Controller {...props} widget={this.state.widget} />;
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

export interface WidgetFactoryProps extends WidgetProps {
    widgetPath: string;
}
export class WidgetFactory extends React.PureComponent<WidgetFactoryProps> {
    public render() {
        const [controller, widget] = this.props.widgetPath.split('.');

        const props = { ...this.props };
        delete props.widgetPath;

        return <AsyncWidget {...props} controller={controller} widget={widget} />;
    }
}
