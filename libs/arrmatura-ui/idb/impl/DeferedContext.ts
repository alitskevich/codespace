
/**
 * Invoke with defered context.
 */
export class DeferedContext {

  invocations = new Set<{ fn, resolve, reject }>();

  ctx = null;

  async setContext(ctx) {

    this.ctx = ctx;

    for (const { fn, resolve, reject } of this.invocations.values()) {
      try {
        const r = await fn(this.ctx, resolve, reject);
        if (r !== undefined) {
          if (r instanceof Promise) {
            r.then(resolve).catch(reject);
          } else {
            resolve(r);
          }
        }
      } catch (error) {
        reject(error)
      }
    }

    this.invocations.clear();
  }

  invoke<T>(fn): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.ctx) {
        this.invocations.add({ fn, resolve, reject });
      } else {
        try {
          const r = fn(this.ctx, resolve, reject);
          if (r !== undefined) {
            if (r instanceof Promise) {
              r.then(resolve).catch(reject);
            } else {
              resolve(r);
            }
          }
        } catch (error) {
          reject(error)
        }
      }
    });
  }
}