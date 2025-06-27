import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IBasketView {
	totalAmount(total: number): void;
}

export class Basket extends Component<IBasketView> {
	protected orderButton: HTMLButtonElement;
	events: IEvents;
	protected allPrice: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.orderButton = container.querySelector('.basket__button');
		this.orderButton.disabled = true;
		this.orderButton.addEventListener('click', () => {
			this.events.emit('basket:order');
		});
		this.allPrice = container.querySelector('.basket__price');
	}

	totalAmount(total: number) {
		this.allPrice.textContent = `${total} синапсов`;
		if (total !== 0) {
			this.orderButton.disabled = false;
		} else {
			this.orderButton.disabled = true;
		}
	}
}
