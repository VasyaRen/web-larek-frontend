import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface ISucces {
  setAmount(): void;
}

export class Succes extends Component<ISucces> {
  protected buttonClose: HTMLButtonElement;
  protected amount: HTMLElement;
  events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.amount = container.querySelector('.order-success__description');
    this.buttonClose = container.querySelector('.order-success__close');
    this.events = events;
    this.buttonClose.addEventListener('click', () => {
      this.events.emit('succes:close');
    });
  }

  setAmount(totalAmount: number) {
    this.amount.textContent = `Списано ${totalAmount} синапсов`;
  }
}
