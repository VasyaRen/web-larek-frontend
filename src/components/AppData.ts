import { IEvents } from './base/events';
import {
	ICard,
	IOrder,
	IDataApiCard,
	IDataCardBasket,
	TCardBasket,
} from '../types';

export class DataCards implements IDataApiCard {
	items: ICard[];
	events: IEvents;
	total:number;

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

export class DataBasket implements IDataCardBasket {
	items: TCardBasket[];
	amount: number;
	events: IEvents;
	itemCount: number;

	constructor(events: IEvents) {
		this.events = events;
		this.items = [];
		this.itemCount = 0;
	}

	set cards(cards: TCardBasket[]) {
		this.items = cards;
	}

	get cards() {
		return this.items;
	}

	addCard(data: TCardBasket) {
		this.itemCount =+1; //увидела комментарий, спасибо, буду думать, как лучше
		this.items.push(data);
		this.events.emit('basket:changed');
	}

	deleteCard(id: string) {
		this.items = this.items.filter((item) => item.id !== id);
		this.events.emit('basket:changed');
	}

	clearBasket() {
		this.items = [];
		this.events.emit('basket:changed');
	}

	getTotalAmount() {
		this.amount = this.items.reduce((total, item) => {
			total += Number(item.price);
			return total;
		}, 0);
	}

	getBasketCard(cardId: string) {
		return this.items.find((item) => item.id === cardId);
	}

	getCardsId() {
		const basketCardsId: string[] = [];
		this.items.forEach((item) => {
			basketCardsId.push(item.id);
		});
		return basketCardsId;
	}
}

type TFormErrors = Partial<Record<keyof IOrder, string>>;

export class AppState {
	events: IEvents;
	order: IOrder = {
		address: '',
		phone: '',
		email: '',
		payment: '',
	};

	formErrors: TFormErrors = {};

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
		this.events.emit('contacts:changed');
	}

	setOrderField(nameForm: string, field: keyof Partial<IOrder>, value: string) {
		this.order[field] = value;
		this.events.emit(`${nameForm}:changed`, { field: field });
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
