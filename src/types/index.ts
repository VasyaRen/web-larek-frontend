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

export interface IDataCardBasket {
	items: TCardBasket[];
	addCard(data: TCardBasket): void;
	deleteCard(id: string): void;
	clearBasket(): void;
	getTotalAmount(): void;
	getBasketCard(cardId: string): TCardBasket;
	getCardsId(): string[];
}

export type TCardBasket = Pick<ICard, 'id' | 'title' | 'price'>;
