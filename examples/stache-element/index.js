import StacheElement from "can-stache-element";
class Counter extends StacheElement {
  static view = `
    Count: <span data-testid="counter">{{ this.count }}</span>
    <button on:click="this.increment()">+1</button>
  `;
  static props = {
    count: 0
  };
  increment() {
    this.count++;
  }
}
customElements.define("x-counter", Counter);
