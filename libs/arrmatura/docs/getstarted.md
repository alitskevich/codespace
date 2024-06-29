# Hello, world

The code you have provided is a combination of XML and JavaScript that utilizes the arrmatura framework to create a web application.

## templates.xml

The templates.xml file defines two components: "Application" and "Main". The "Application" component is the root component of the application and contains a single instance of the "Main" component. The "Main" component is defined as a div element that displays a greeting, which consists of a static string ("Hello") and a dynamic value (name).

```xml
<component id="Application">
    <Main name="world"/>
</component>

<component id="Main">
    <div title="{#greeting}, {@name | upper}!"></div>
</component>
```

## index.ts

In the index.ts file, the arrmatura framework is imported and used to render the application.

```javascript
import { arrmatura } from 'arrmatura';
import templates from './templates.xml';

arrmatura({
  template: '<Application />'
  types: [templates],
  resources: {
    greeting: 'Hello',
  },
  functions: {
    upper: (x) => x.toUpperCase(),
  },
});
```

The arrmatura function is passed several arguments:

- template: Specifies the root component of the application, which is <Application />.
- types: An array of component templates, in this case, the contents of the templates.xml file.
- resources: An object that contains the static data used in the application. In this case, a single resource greeting with the value "Hello" is provided.
- functions: An object that contains functions that can be used in component templates. In this case, a single function upper is provided, which takes a string as an argument and returns the uppercase version of the string.

When the arrmatura function is executed, it creates an instance of the "Application" component and renders it to the page. The "Main" component is then rendered as a child of the "Application" component, and its title is set to the result of evaluating the expression "{#greeting}, {@name | upper}!". This expression uses a combination of static data (greeting), dynamic data (name), and a function (upper) to create the greeting that is displayed in the div element.
