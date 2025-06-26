import { IEvents } from "./base/events";
import { Card } from "./common/Card";

export class BasketItemView extends Card {
  events: IEvents;
  protected removeButton: HTMLButtonElement;
  protected index: HTMLElement;
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this.events = events;
    this.removeButton = container.querySelector('.basket__item-delete');
    this.index = container.querySelector('.basket__item-index');

    this.removeButton.addEventListener('click', () => {
      this.container.remove();
      this.events.emit('card:removeFromBasket', {
        price: super.price.replace(/\D/g, ''),
      });
    });
  }

  setIndex(index: number) {
    this.index.textContent = String(index);
  }
}