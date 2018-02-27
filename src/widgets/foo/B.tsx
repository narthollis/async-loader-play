import React from 'react';

import { WidgetProps } from 'src/widgets/types';

export default class A extends React.PureComponent<WidgetProps> {
    public render(): React.ReactNode {
        return (
            <div className="col widget">
                Foo B: {this.props.title}
                {this.props.children}
            </div>
        );
    }
}
