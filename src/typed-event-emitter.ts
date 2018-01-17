// https://github.com/tenry92/typed-event-emitter

/******************************************************************************
 * The MIT License (MIT)                                                      *
 *                                                                            *
 * Copyright (c) 2016 Simon "Tenry" Burchert                                  *
 *                                                                            *
 * Permission is hereby granted, free of charge, to any person obtaining a    *
 * copy of this software and associated documentation files (the "Software"), *
 * to deal in the Software without restriction, including without limitation  *
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,   *
 * and/or sell copies of the Software, and to permit persons to whom the      *
 * Software is furnished to do so, subject to the following conditions:       *
 *                                                                            *
 * The above copyright notice and this permission notice shall be included in *
 * all copies or substantial portions of the Software.                        *
 *                                                                            *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR *
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,   *
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL    *
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER *
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING    *
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER        *
 * EALINGS IN THE SOFTWARE.                                                   *
 ******************************************************************************/

 export class Listener {
  constructor(public owner: EventEmitter,
    public event: Function,
    public listener: Function) {

  }

  unbind() {
    this.owner.removeListener(this);
  }
}

export class EventEmitter {
  private eventListeners: Map<Function, Function[]>;

  constructor() {
    this.eventListeners = new Map();
  }

  on(event: Function, listener: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [ listener ]);
    } else {
      this.eventListeners.get(event).push(listener);
    }

    return new Listener(this, event, listener);
  }

  addListener(event: Function, listener: Function) {
    return this.on(event, listener);
  }

  // removeListener();
  removeListener(id?: Listener);
  removeListener(event: Function, listener?: Function);

  removeListener() {
    if (arguments.length === 0) {
      this.eventListeners.clear();
    } else if (arguments.length === 1 && typeof arguments[0] === 'object') {
      const id = arguments[0];
      this.removeListener(id.event, id.listener);
    } else if (arguments.length >= 1) {
      const event = <Function>arguments[0];
      const listener = <Function>arguments[1];

      if (this.eventListeners.has(event)) {
        const listeners = this.eventListeners.get(event);
        let idx;
        while (!listener || (idx = listeners.indexOf(listener)) !== -1) {
          listeners.splice(idx, 1);
        }
      }
    }
  }

  /**
   * Emit event. Calls all bound listeners with args.
   */
  protected emit(event: Function, ...args) {
    if (this.eventListeners.has(event)) {
      for (const listener of this.eventListeners.get(event)) {
        listener(...args);
      }
    }
  }

  /**
   * @typeparam T The event handler signature.
   */
  registerEvent<T extends Function>() {
    const eventBinder = (handler: T) => {
      return this.addListener(eventBinder, handler);
    };

    return eventBinder;
  }
}
