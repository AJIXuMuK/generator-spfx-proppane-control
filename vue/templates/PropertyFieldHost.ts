import { Vue, Component, Prop, Provide } from 'vue-property-decorator';
import styles from './PropertyField{ComponentName}.module.scss';

import {
    IPropertyField{ComponentName}HostProps
} from './IPropertyField{ComponentName}Host';

/**
 * Class-component
 */
@Component
export default class PropertyField{ComponentName}Host extends Vue implements IPropertyField{ComponentName}HostProps {
    @Prop()
    public label: string;

    @Prop()
    public value?: string;

    @Prop()
    public uniqueKey: string;
    
    @Prop()
    public onValueChanged: (value: string) => void;

    public data(): any {
        return {
            inputValue: this.value
        };
    }

    /**
     * Readonly property to return styles
     */
    public get styles(): { [key: string]: string } {
        return styles;
    }

    public get inputId(): string {
        return `Input${this.uniqueKey}`;
    }

    private _onChange(event) {
        if (this.onValueChanged) {
            this.onValueChanged(this.$data.inputValue);
        }
    }
}