export interface ICard {
	id: string;
	category: string;
	title: string;
	description: string;
	image: string;
	price: string;
}

export interface IOrder {
	payment: string;
	address: string;
	phone: string;
	email: string;
}

export interface IPage {
	counterBasket: number;
	catalogCard: HTMLElement[];
	locked: boolean;
}

export interface IDataApiCard {
	items: ICard[];
	getCard(cardId: string): ICard;
}
