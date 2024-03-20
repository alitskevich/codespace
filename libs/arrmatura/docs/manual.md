#Templates

**Template** is a xml-based notation defining a components composition, events and data flow.

## Insight

```html

<component id="NavTreeItem">
  <a href="@id">
    <span>{@name | slice:0:50 | capitalize}</span>
    <span if="@label" class="label label-{@type}">{@label}</span>
  </a>
</component>

<component id="NavTree">
  <ul class="nav">
    <li class="nav-item {@item.class}" each="item of @data">
      <NavTreeItem (...)="@item">
      <NavTree if="@item.subs" data="@item.subs" />
    </li>
  </ul>
</component>
```

## Composition Control flow.

### Conditionals.

With `if` attribute, an element(and its inner context) presents only if value of expression is truthy.

```html
<div ... if="@enabled">...</div>
```

#### full `then-else` syntax

```html
<Fragment if="@enabled">
  <Then><Case1 /></Then>
  <Else><Case2 /></Else>
</Fragment>
```

### Iterations.

`each` attribute multiplies component instances along items from given array.

```html
<ul>
  <li each="item of @data">
    <a href="/item/{@item.id}">{@item.position}. {@item.name}</span>
  </li>
</ul>
```

> - items MUST HAVE unique `id` field

### Fragment.

`<Fragment>` is a transparent container and works just like a parens for multiple components.

```html
<Fragment if="@enabled"> <innerContent1 />...<innerContentN /> </Fragment>
```

## Dynamic tags.

Used to calculate tag dunamically at runtime.

```html
<Dynamic as="{@type}Field" ...></Dynamic>
```

> use dot in type name to fallback to a basic implementation if a specific one not found `tag="Button.{@type}"`

## Properties.

Component state can be mutated different ways listed below.
State updates lead to redraw UI and notify subscribers(left arrows)
Updating data is compared with existing state values for 'sameness' (same set of same values).

### with scalar literals

`prop1="'somestring'"` puts a literal into `prop1` property.

> - 'true', 'false' values are narrowed to boolean,
> - numbers has been narrowed to number type.

### with resources values

`@@`-prefix used to refer any value in the resource bundle.

`prop="@@resId"` assigns `resId` resource value to `prop`.

### with result of expression

`prop="@prop2"` assigns value of `prop2` property of the current scope.

`prop="@data.key"` assigns value of `prop2.key`.

`prop="!@prop2"` assigns inverted value of `prop2`

`(...)="@data"` special `(...)` notation used to spread keys/values of `data` into properties of an entity.

### with result of chain of pipes

`prop="@some | pipeFn1 : 'strLiteral1' : 1 : true | pipeFn2 : @property2 | pipeFn2 : @@resourceId"` applies chain of pipes in left-to-right order.

> - Pipe functions can be chained. Result of the previous one passed as a first argument to the next one.
> - Optional colon-separated arguments can be passed to a pipe function as second, third arguments.
> - Use shortcuts like `==, && , ??, ?, >, <, []` for `equals, and, or, then, less, greater, dot` functions respectively. Priority is still left-to-right here.

### `data-*` attributes

All `data-[key]` attributes will be collected into single `data` object property under its keys.

### References.

Add `ref` attribute to any component to get refer it in `arrows` expressions.

```html
<UserService ref="user" />
...
<UserAvatar data="<- user@profile" onSave="-> user@update" />
```

## Left arrow expression

`data="<- ref@prop"` makes a hot subscription to any property of orbitrary component in the current or upper scopes.

> may use pipes to adapt received value `data="<- ref@prop | adjustFn"`.

## Right arrow expression

```html
<button ... action="-> ref@key1" data-key="val" data="@data" />

<button ... action="-> ref@key1 = @value|pipe" />
```

Right arrow creates a function, that

- `action="-> ref.submit(data)"` invokes `upperScopes[ref].submit(data)` action with an `data` object as parameter.

- `action="-> ref.submit(@prop1)"` invokes `upperScopes[ref].submit(data)` action with a value of property `prop1` as parameter.

- `action="-> ref@prop1"` updates container state for given key `upperScopes[ref].up({ prop1: data })`.

> `action="-> ref.action(data | prepare)` pipes will be applied on `data`-object before it passed to the action.

> `click="-> @opened"` if `ref` is omitted, then a target will be a scope component `scope.up({opened:data})`

> `click="-> ..."` will spread data to state of a scope component `scope.up(data)`

#### Right arrows with inline payload

Often, it is shorter to pass payload inline instead of using `data` property.

- `click="-> ...= @data | assignKeyValue:key:@value"` updates a scope properties with `data` object.
- `click="-> @prop" data="@data"` updates a given scope property of owner with `data` object.
- `click="-> @prop='literalValue'"` updates a given scope property of owner with literal.

## Connector

Special build-in `Connector` component serves for async data binding
It acts with timeout(0 by default) and debounces if any:

```html
<!-- `data` works as a `trigger`, if none specified. -->
<Connector data="<- todo@shownItems|adjust" change="-> @someData" />

<!-- `change` is invokes with `data` on `trigger` changed.  -->
<Connector data="@someData" trigger="<- todo@shownItemsCount" timeout="100" change="-> @discriminant=data|calculate" />
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
    <Slot key="key1">

    <!-- special `slot(key)` conditional expression may be used to check if non-empty slot content passed. -->
    <div class="comp" if="slot(key2)">
        <!-- <Extra2/> will be placed here -->
        <Slot key="key2">
    </div>

    <!-- <DefaultContent/> will be placed here -->
    <Slot>
</div>
```

# Custom components

There is a [Component] class that could be used an base ancestor for custom components.

While designing custom components you can

- to define life-cycle hooks;
- to add getters/setter for its properties;
- to define `__getProperty(propName)` to return value of any property by its name
- to define `__setProperty(propName, value)` to set value of any property by its name
- to define action handlers like `doSomethig(data: any): object`, which may return a delta object for updating a component state;
- to use context methods like `up(delta)`, `emit('ref-target', data)`, `defer(fn)`.

```typescript
class MyService extends Component {

    constructor(initials: Hash, ctx: ICtx) {
        Object.asign(this, initials);
        this.ctx = ctx;
    }

    // life-cycle hook called once on component is inited
    init() {
        this.cancel = api.listen(this)
        // ...or using $.defer()
        this.ctx.defer(api.listen2(this));

        // will update component state with returned result
        return {
            prop1:'value',
            // can be promise as well
            prop2: Promise.resolve(2)
        }
    }

    // life-cycle hook called once on component is done
    done (){
      this.cancel();
    }

    // property getter
    getSrc(){
        return this.url.toString()
    }

    // property setter
    setSrc(value){
      this.url = URL.parse(value)
    }

    // getter can return promise
    async getData() {
      return this.fetchData()
    }

    // action handler. To be invoked with '-> ref.someAction' notation
    onSomeAction(data: any) {
        if (asyncMode) {
            return promise.then(() => delta)
        }
        // delta object to update component state
        return {
            // instant value for 'prop'
            prop: data.value,
            // async evaluation for 'prop'. 'Promise' postfix is optional.
            propPromise: T.fetchProp(),
            // async spread
            '...': Promise.resolve({
                prop1: 'val1'
                prop2: 'val2'
            })
        }
    }

    toast (message) {
      // emit action event
      this.emit('toasters.onSend(data)', { message });
    };
}
```
