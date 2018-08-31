import { IPropertyPaneField, PropertyPaneFieldType } from '@microsoft/sp-webpart-base';
import { IPropertyField{ComponentName}Props, IPropertyField{ComponentName}PropsInternal } from './IPropertyField{ComponentName}';

import styles from './PropertyField{ComponentName}.module.scss';

class PropertyField{ComponentName}Builder implements IPropertyPaneField<IPropertyField{ComponentName}Props> {
    //Properties defined by IPropertyPaneField
	public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
	public targetProperty: string;
	public properties: IPropertyField{ComponentName}PropsInternal;
    private elem: HTMLElement;
    private value: string;
    private changeCB?: (targetProperty?: string, newValue?: any) => void;
    
    public constructor(_targetProperty: string, _properties: IPropertyField{ComponentName}Props) {
		this.targetProperty = _targetProperty;
		this.properties = {
			key: _properties.key,
			label: _properties.label,
            onPropertyChange: _properties.onPropertyChange,
            value: _properties.value,
            onRender: this.onRender.bind(this),
            properties: _properties.properties
        };
        
        this.value = _properties.value;
        if (this.value === undefined) {
            this.value = '';
        }
    }
    
    public render(): void {
        if (!this.elem) {
            return;
        }

        this.onRender(this.elem);
    }

    private onRender(elem: HTMLElement, ctx?: any, changeCallback?: (targetProperty?: string, newValue?: any) => void): void {
		if (!this.elem) {
			this.elem = elem;
		}
        this.changeCB = changeCallback;

        // creating input element
        const input: HTMLInputElement = document.createElement('input');
        input.type = 'text';
        input.addEventListener('change', this._onInputChange.bind(this));
        input.value = this.value;
        input.id = `Input${this.properties.key}`;

        // div input wrapper
        const inputWrapper: HTMLDivElement = document.createElement('div');
        inputWrapper.className = `ms-TextField-fieldGroup ${styles.inputWrapper}`;
        inputWrapper.appendChild(input);

        // input's label
        const label: HTMLLabelElement = document.createElement('label');
        label.htmlFor = input.id;
        label.textContent = this.properties.label;
        label.className = `ms-Label ${styles.label}`;

        // root div element of the component
        const element: HTMLDivElement = document.createElement('div');
        element.appendChild(label);
        element.appendChild(inputWrapper);

        // adding the component to the Prop Pane
        elem.innerHTML = '';
        elem.className = styles.{ComponentName};
        elem.appendChild(element);
    }

    private _onInputChange(elem: Event): void {
        const input = elem.target as HTMLInputElement;
        if (this.properties.onPropertyChange && input.value !== this.value) {
            const newValue = input.value;
            this.properties.onPropertyChange(this.targetProperty, this.value, newValue);
            this.value = newValue;
            this.properties.properties[this.targetProperty] = newValue;
            if (typeof this.changeCB !== 'undefined' && this.changeCB !== null) {
				this.changeCB(this.targetProperty, newValue);
			}
        }
    }
}

export function PropertyField{ComponentName}(targetProperty: string, properties: IPropertyField{ComponentName}Props): IPropertyPaneField<IPropertyField{ComponentName}Props> {
	return new PropertyField{ComponentName}Builder(targetProperty, properties);
}