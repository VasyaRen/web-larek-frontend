import { Form } from './common/Form';
import { IEvents } from './base/events';

interface IPaymentForm {
	address: string;
	payment: string;
}

export class PaymentForm<T> extends Form<IPaymentForm> {
	protected buttonCash: HTMLButtonElement;
	protected buttonCard: HTMLButtonElement;
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.buttonCash = this.container.querySelector('[name=cash]');
		this.buttonCard = this.container.querySelector('[name=card]');

		this.buttonCard.addEventListener('click', () => {
			events.emit(`${this.container.name}.payment:change`, { payment: 'card' });
		});
		this.buttonCash.addEventListener('click', () => {
			events.emit(`${this.container.name}.payment:change`, { payment: 'cash' });
		});
	}
	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
