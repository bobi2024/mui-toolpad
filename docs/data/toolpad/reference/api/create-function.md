# createFunction API

<p class="description">Provide backend function that loads data on the page.</p>

## Import

```jsx
import { createFunction } from '@mui/toolpad/server';
```

## Description

```jsx
export const myApi = createFunction(config, resolver);
```

Make any backend data available to your page with the `createFunction`. Define a named export, initialized with `createFunction` in `toolpad/resources/functions.ts`. After doing so, the function will be available when creating a Custom Function query on the page. The result of calling this function on the backend will be available as page state.

You can define parameters to bind to page state. The actual values for these parameters will be supplied when the function is called to load the data.

## Parameters

- `resolver` a function that returns data. The data will be made available on the page as soon as it loads.

- `config` An object describing the capabilities of this backend function within Toolpad. See [FunctionConfig](#functionconfig)

## Returns

a function that is recognizable by Toolpad

## types

### FunctionConfig

This describes the behavior of the custom function.

**Properties**

| Name          | Type                                      | Description                                                                                                                                |
| :------------ | :---------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| `parameters?` | `{ [name: string]: ParameterDefinition }` | Describes the parameters that will be passed in the `parameters` property of the function. See [ParameterDefinition](#parameterdefinition) |

### ParameterDefinition

this describes the type of the parameter that will be passed to the custom function.

**Properties**

| Name           | Type                                                       | Description                                                                                                        |
| :------------- | :--------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| `type?`        | `'string' \| 'number' \| 'boolean' \| 'object' \| 'array'` | Describes the type of the parameter.                                                                               |
| `default?`     | `any`                                                      | A default value for the property.                                                                                  |
| `helperText?`  | `string`                                                   | A short explanatory text that'll be shown in the editor UI when this property is referenced. May contain Markdown. |
| `description?` | `string`                                                   | A description of the property, to be used to supply extra information to the user.                                 |
| `enum?`        | `string[]`                                                 | For the `'string'` type only. Defines a set of valid values for the property                                       |
| `minimum?`     | `number`                                                   | For the `'number'` type only. Defines the minimum allowed value of the property                                    |
| `maximum?`     | `number`                                                   | For the `'number'` type only. Defines the maximum allowed value of the property                                    |

## Usage

:::info
See [custom functions](/toolpad/concepts/connecting-to-data/#custom-functions)
:::
