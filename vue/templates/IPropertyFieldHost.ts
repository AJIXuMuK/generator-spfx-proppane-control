/**
 * PropertyFieldTextHost component props
 */
export interface IPropertyField{ComponentName}HostProps {
    label: string;
    value?: string;
    onValueChanged: (value: string) => void;
    /**
     * we're using uniqueKey instead of key because key is a "reserved" attribute
     */
    uniqueKey: string;
}