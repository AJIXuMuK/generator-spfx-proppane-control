import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

import {
    IPropertyField{ComponentName}HostProps,
    IPropertyField{ComponentName}HostState
} from './IPropertyField{ComponentName}Host';

export default class PropertyField{ComponentName}Host extends React.Component<IPropertyField{ComponentName}HostProps, IPropertyField{ComponentName}HostState> {
    constructor(props: IPropertyField{ComponentName}HostProps) {
        super(props);
    }

    public render(): React.ReactElement<IPropertyField{ComponentName}HostProps> {
        return (
            <TextField label={this.props.label} value={this.props.value} onChanged={this._onValueChanged.bind(this)} />
        );
    }

    private _onValueChanged(newValue: string): void {
        if (this.props.onValueChanged) {
            this.props.onValueChanged(newValue);
        }
    }
}