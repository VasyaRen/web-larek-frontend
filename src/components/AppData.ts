import { EventEmitter, IEvents } from './base/events';
import { ICard, IOrder, IDataApiCard } from '../types';

export class DataCards implements IDataApiCard {
	items: ICard[];
	events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set cards(cards: ICard[]) {
		this.items = cards;
	}

	get cards() {
		return this.items;
	}

	getCard(cardId: string) {
		return this.items.find((item) => item.id === cardId);
	}
}

type FormErrors = Partial<Record<keyof IOrder, string>>;

export class AppState {
	events: IEvents;

	basket: {
		total: number;
		_counter: number;
	};

	order: IOrder = {
		address: '',
		phone: '',
		email: '',
		payment: '',
	};
	formErrors: FormErrors = {};

	constructor(events: IEvents) {
		this.events = events;
	}

	initOrder() {
		this.order = {
			email: '',
			phone: '',
			address: '',
			payment: '',
		};
		this.events.emit('order:changed'); 
		this.basket = {
			total: 0,
			_counter: 0,
		};
	}

	changeCounterProduct(counter: number) {
		this.basket._counter = this.basket._counter + counter;
		this.events.emit('counterProduct:change', {
			counter: this.basket._counter,
		});
	}

	changeTotalAmount(price: number) {
		this.basket.total = this.basket.total + price;
		this.events.emit('totalAmount:change', { total: this.basket.total });
	}

	setOrderField(nameForm: string, field: keyof Partial<IOrder>, value: string) {
		this.order[field] = value;
		this.events.emit(`${nameForm}:changed`, { field: field });
	}

	clearBasket() {
		this.events.emit('counterProduct:change', { counter: 0 });
		this.events.emit('basket:cleared', {});
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		return errors;
	}
}
