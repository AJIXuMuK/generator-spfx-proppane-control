<template>
    <div :class="$style.{ComponentName}">
        <label :for="inputId" class="ms-Label" :class="$style.label">{{label}}</label>
        <div class="ms-TextField-fieldGroup" :class="$style.inputWrapper">
            <input type="text" v-model="inputValue" :id="inputId" v-on:change="_onChange" />
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

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

    public get inputId(): string {
        return `Input${this.uniqueKey}`;
    }

    private _onChange(event) {
        if (this.onValueChanged) {
            this.onValueChanged(this.$data.inputValue);
        }
    }
}
</script>
<style lang="scss" module>
@import '~@microsoft/sp-office-ui-fabric-core/dist/sass/_SPFabricCore.scss';

$inputBorder: "[theme:inputBorder, default: #a6a6a6]";
$inputBorderHovered: "[theme:inputBorderHovered, default: #212121]";

.{ComponentName} {
    .label {
        display: block;
        padding: 5px 0;
    }

    .inputWrapper {
        border: 1px solid;
        border-color: $inputBorder;
        height: 32px;
        display: flex;

        &:hover {
            border-color: $inputBorderHovered;
        }

        & > input {
            border: none;
            padding: 0 12px;
            width: 100%;
        }
    }
}
</style>

