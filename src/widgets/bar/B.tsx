import React from 'react';

import { WidgetProps } from 'src/widgets/types';

export default class A extends React.PureComponent<WidgetProps> {
    public render(): React.ReactNode {
        return <div><h3>Bar A: {this.props.title}</h3></div>;
    }
}
