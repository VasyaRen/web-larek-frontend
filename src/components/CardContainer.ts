import { Component } from './base/Component';

export interface ICardsContainer {
	catalog: HTMLElement[];
}

export class CardConainer extends Component<ICardsContainer> {
	protected cardCatalog: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);
	}

	set catalog(items: HTMLElement[]) {
		this.container.replaceChildren(...items);
	}
}
