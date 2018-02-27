import React from 'react';

import { WidgetControllerProps } from 'src/widgets';

export default class A extends React.PureComponent<WidgetControllerProps> {
    public render(): React.ReactNode {
        const Widget = this.props.widget;
        const props =  { ...this.props };
        delete props.widget;

        return (
            <Widget {...props}>
            <h6>Renders: {this.props.renderCount}</h6>
            </Widget>
        )
    }
}
