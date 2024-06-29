# Custom components

There is a `Component` class that could be used an base ancestor for custom components.

While designing custom components you can

- to define `__init` life-cycle hook;
- to use `defer` method for adding cleanup code;
- to add `getX/setX` for its properties;
- to define `__getStateProperty(propName)` to return value of any property by its name
- to define `__stateChanged(changes)` to intercept applying state changes
- to define action handlers like `doSomethig(data: any): object`, which may return a delta object for updating a component state;
- to use context methods like `up(delta)`, `emit('ref-target', data)`, `defer(fn)`.

```typescript
class MyService extends Component {

    constructor(initials: Hash, ctx: IComponentContext) {
      super(initials, ctx);
    }

    // life-cycle hook called from constructor
    __created(initials: Hash) {
      Object.asign(this, initials);
    }

    // life-cycle hook called once on component is inited
    __init() {
      const cancel = api.subscribe(this);
      // unsubscribe when done
      this.defer(cancel);

      // will update component state with returned result
      return {
          prop1:'value',
          // can be promise as well
          prop2: Promise.resolve(2)
      }
    }

    // to intercept getting of any property
    __getStateProperty(key: string) {
      this.log('getProperty', key)
      return this[key]

    // to intercept state changes
    __stateChanged(changes: Map) {
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

    // action handler. To be invoked with 'data-> ref.doSomeAction(data)' notation
    doSomeAction(data: any) {
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
