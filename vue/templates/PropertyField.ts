import { IPropertyPaneField, PropertyPaneFieldType } from '@microsoft/sp-webpart-base';
import { IPropertyField{ComponentName}Props, IPropertyField{ComponentName}PropsInternal } from './IPropertyField{ComponentName}';

import styles from './PropertyField{ComponentName}.module.scss';

// Importing Vue.js
import Vue from 'vue';
// Improting Vue.js SFC
import {ComponentName}Component from './PropertyField{ComponentName}Host.vue';

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
        
        const id: string = `ppf-${this.properties.key}`;

        elem.innerHTML = '';
        elem.className = styles.{ComponentName};

        // root div element of the component
        const element: HTMLDivElement = document.createElement('div');
        element.id = id;
        elem.appendChild(element);

        let vueEl = new Vue({
            render: h => h({ComponentName}Component, {
              props: {
                uniqueKey: this.properties.key,
                value: this.value,
                label: this.properties.label,
                onValueChanged: this._onInputChange.bind(this)
              }
            })
          });

          vueEl.$mount(element);
    }

    private _onInputChange(newValue: string): void {
        if (this.properties.onPropertyChange && newValue !== this.value) {
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