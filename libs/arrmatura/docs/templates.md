# Templates

**Template** is a xml-based formal notation, which defining components composition, connections, logic and flow.

## Insight

```html

<component id="NavTreeItem">
  <a href="id">
    <span>{name | slice:0:50 | capitalize}</span>
    <span If="label" class="label label-{type}">{label}</span>
  </a>
</component>

<component id="NavTree">
  <ul class="nav">
    <li class="nav-item {item.class}" Each="item of data">
      <NavTreeItem Props="{item}">
      <NavTree If="item.subs" data="{item.subs}" />
    </li>
  </ul>
</component>
```

## Composition Control flow.

### Conditionals.

With `If` attribute, an element(and its inner context) presents only if value of expression is truthy.

```html
<div ... If="enabled">...</div>
```

#### full `then-else` syntax

```html
<Fragment If="enabled">
  <Then><Case1 /></Then>
  <Else><Case2 /></Else>
</Fragment>
```

### Iterations.

`Each` attribute multiplies component instances along items from given array.

```html
<ul>
  <li Each="item of data">
    <a href="/item/{item.id}">{item.position}. {item.name}</span>
  </li>
</ul>
```

> - items MUST HAVE unique `id` field

### Fragment.

`<Fragment>` is a transparent container and works just like a parens for multiple components.

```html
<Fragment If="enabled"> <innerContent1 />...<innerContentN /> </Fragment>
```

## Dynamic tags.

Used to calculate tag dunamically at runtime.

```html
<Dynamic As="Field.{type}" ...></Dynamic>
```

> it will fallback to a `Field` if a specific type not found.

## Properties.

Component state can be mutated different ways listed below.
State updates lead to redraw UI and notify subscribers(left arrows)
Updating data is compared with existing state values for 'sameness' (same set of same values).

### with scalar literals

`prop1="'somestring'"` puts a literal into `prop1` property.

> - 'true', 'false' values are narrowed to boolean,
> - numbers has been narrowed to number type.

### with resources values

`R`-prefix used to refer any value in the resource bundle.

`prop="R.resId"` assigns `resId` resource value to `prop`.

### with result of expression

`prop="{prop2}"` assigns value of `prop2` property of the current scope.

`prop="{data.key}"` assigns value of `data.key`.

`prop="{!prop2}"` assigns inverted value of `prop2`

`Props="{data}"` special `Props` property used to spread keys/values of `data` into properties of a target entity.

### with result of chain of pipes

`prop="{some | pipeFn1 : 'strLiteral1' : 1 : true | pipeFn2 : property2 | pipeFn2 : R.resourceId}` applies chain of pipes.

> - Pipe functions can be chained. Result of the previous one passed as a first argument to the next one.
> - Optional colon-separated arguments can be passed to a pipe function as second, third arguments.
> - Use shortcuts like `==, && , ??, ?, >, <, []` for `equals, and, or, then, less, greater, dot` functions respectively.
> - There is no operation priority, they applied in left-to-right order.

### `data-*` attributes

All `data-[key]` attributes will be collected into single `data` object property under its keys.

### References.

Add `Ref` attribute to any component to get refer it in `arrows` expressions.

```html
<UserService Ref="user" /> <UserAvatar data="<- user.profile" onSave="-> user.update" />
```

> use comma to separate multiple aliases `Ref="api,db,auth"`

## Left arrow expression

`data="<- ref.prop"` makes a hot subscription to any property of orbitrary component in the current or upper scopes.

> use pipes to adapt received value `data="<- ref.prop | adjustFn"`.

## Right arrow expression

Right arrow creates a function, that

- `action="data-> ref.submit(data)"` invokes `scope.refs[ref].submit(data)` action with an `data` object as parameter.

- `action="-> ref.submit(prop1)"` invokes `scope.refs[ref].submit(data)` action with a value of property `prop1` as parameter.

- `action="-> ref.prop1"` updates container state for given key `scope.refs[ref].up({ prop1: data })`.

> `action="data-> ref.action(data | prepare)` pipes will be applied on `data`-object before it passed to the action.

> `click="-> opened"` if `ref` is omitted, then a target will be a scope component `scope.up({opened:data})`

> `click="->"` spreads data to state of a scope component `scope.up(data)`

- `click="data-> * = data | assignKeyValue:'key':value"` updates a scope properties with result of `assignKeyValue` function on `data` object and other args.

- `click="-> prop" data="{data}"` updates a `prop` property with `data` object.

- `click="-> prop='literalValue'"` updates a given scope property with literal.

## Connector

Special build-in `Connector` component serves for async data binding
It acts with timeout(0 by default) and debounces if any:

```html
<!-- `data` works as a `trigger`, if none specified. -->
<Connector data="<- todo.shownItems|adjust" change="-> someData" />

<!-- `change` is invokes with `data` on `trigger` changed.  -->
<Connector
  data="someData"
  trigger="<- todo.shownItemsCount"
  timeout="100"
  change="data-> discriminant=data|calculate"
/>
```

## Slots

Slots are placeholders to inject an inner content of component usage tag.

```html
<Comp>
  <!-- inner content of component usage -->
  <InnerContent />
</Comp>
```

```html
<component id="Comp">
<div class="container">
    <!-- Inner content will replace <Slot/> -->
    <Slot>
</div>
</component>
```

### Multi-part extra content.

Inner content could be multiple-part and thus, distributed separately inside component template.

```html
<Comp>
  <Comp:key1><Extra1 /></Comp:key1>
  <Comp:key2><Extra2 /></Comp:key2>
  <DefaultSlotContent />
</Comp>
```

```html
<div class="component template">

    <!-- <Extra1/> will be placed here-->
    <Slot Key="key1">

    <!-- special `slot(key)` conditional expression may be used to check if non-empty slot content passed. -->
    <div class="comp" If="slot(key2)">
        <!-- <Extra2/> will be placed here -->
        <Slot Key="key2">
    </div>

    <!-- <DefaultContent/> will be placed here -->
    <Slot>
</div>
```