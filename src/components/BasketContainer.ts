import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IBasketContainer {
	catalog: HTMLElement[];
}

export class BasketContainer extends Component<IBasketContainer> {
	protected cardCatalog: HTMLElement;
	protected container: HTMLElement;
	events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
	}

	set catalog(items: HTMLElement[]) {
		this.container.replaceChildren(...items);
	}
}
