import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { Modal } from "../base/Modal";

interface ISucces {

}

export class Succes extends Component<ISucces>{
  amount: HTMLElement;
  container: HTMLElement;
  protected buttonClose: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.amount = container.querySelector('.order-success__description');
    this.buttonClose = container.querySelector('.order-success__close')

    this.buttonClose.addEventListener('click', ()=>
    {})
  }

  setAmount (totalAmount: number) {
    this.amount.textContent = `Списано ${totalAmount} синапсов`;
  }
}