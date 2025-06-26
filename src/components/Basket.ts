import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IBasketView {
	basket: HTMLElement;
}

export class Basket extends Component<IBasketView> {
	orderButton: HTMLButtonElement;
	events: IEvents;
	container: HTMLElement;
	allPrice: HTMLElement;
	amount: number;
	total: number;
	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.orderButton = container.querySelector('.basket__button');
		this.orderButton.addEventListener('click', () => {
			this.events.emit('basket:order');
		});
		this.allPrice = container.querySelector('.basket__price');
	}

	totalAmount(total: number) {
		this.allPrice.textContent = `${total} синапсов`;
	}
}
