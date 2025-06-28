import { Api } from './components/base/api';
import './scss/styles.scss';
import { API_URL, settings } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { cloneTemplate } from './utils/utils';
import { DataCards, AppState } from './components/AppData';
import { Modal } from './components/base/Modal';
import { Card } from './components/common/Card';
import { CardConainer } from './components/CardContainer';
import { PaymentForm } from './components/PaymentForm';
import { ContactsForm } from './components/ContactsForm';
import { Basket } from './components/Basket';
import { BasketContainer } from './components/BasketContainer';
import { ICard, IOrder, IDataApiCard } from './types';
import { Page } from './components/PageView';
import { Succes } from './components/common/ModalSucces';
import { BasketItemView } from './components/BasketItem';
import { DataBasket } from './components/AppData';

const events = new EventEmitter();
const page = new Page(document.body, events);
const cardsData = new DataCards(events);
const basketData = new DataBasket(events);
const getApi = new Api(API_URL, settings);
const appData = new AppState(events);

const сardPreviewTemplate = document.querySelector(
	'#card-catalog'
) as HTMLTemplateElement;
const сardFullTemplate = document.querySelector(
	'#card-preview'
) as HTMLTemplateElement;
const cardBasket = document.querySelector(
	'#card-basket'
) as HTMLTemplateElement;

const modalContainer = document.querySelector(
	'#modal-container'
) as HTMLElement;
const modalBasketTemlate = document.querySelector(
	'#basket'
) as HTMLTemplateElement;
const modalBasket = cloneTemplate(modalBasketTemlate) as HTMLElement;
const succesModalTemplate = cloneTemplate(
	document.querySelector('#success') as HTMLTemplateElement
) as HTMLElement;
const succes = new Succes(succesModalTemplate, events);

const paymentFormTemplate = document.querySelector(
	'#order'
) as HTMLTemplateElement;
const contactsFormTemplate = document.querySelector(
	'#contacts'
) as HTMLTemplateElement;

//Экземпляры
const cardList = new CardConainer(document.querySelector('.gallery'));
const modal = new Modal(modalContainer, events);
const basket = new Basket(modalBasket, events);
const basketList = new BasketContainer(
	modalBasket.querySelector('.basket__list'),
	events
);
const contactsForm = new ContactsForm(
	cloneTemplate(contactsFormTemplate),
	events
);
const paymentForm = new PaymentForm(cloneTemplate(paymentFormTemplate), events);

events.on('loadingData', () => {
	const cardCatalog = cardsData.cards.map((item: Partial<ICard>) => {
		const cardItem = new Card(cloneTemplate(сardPreviewTemplate), events);
		return cardItem.render(item);
	});
	cardList.render({ catalog: cardCatalog });
});

events.on('card:select', (evt: { cardId: string }) => {
	const cardItem = new Card(cloneTemplate(сardFullTemplate), events);
	if (basketData.getBasketCard(evt.cardId)) {
		cardItem.stateButton(true);
	}
	const selectedCard = cardItem.render(cardsData.getCard(evt.cardId));
	modal.setContent(selectedCard);
});

events.on('card:addToBasket', (evt: { cardId: string }) => {
	const { title, price, id } = cardsData.getCard(evt.cardId);
	basketData.addCard({ title, price, id });
});

events.on('card:removeFromBasket', (evt: { price: string; id: string }) => {
	basketData.deleteCard(evt.id);
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('basket:open', () => {
	modal.setContent(basket.render({}));
});

events.on('basket:order', () => {
	modal.setContent(paymentForm.render());
});

events.on('basket:changed', () => {
	const basketItems = basketData.cards.map((item: Partial<ICard>) => {
		const basketItem = new BasketItemView(cloneTemplate(cardBasket), events);
		basketItem.setIndex(basketData.itemCount++);
		return basketItem.render(item);
	});

	basketData.getTotalAmount();
	basket.totalAmount(basketData.amount);
	basketList.render({ catalog: basketItems });
	page.counter = basketItems.length;
});

events.on('order:submit', () => {
	modal.setContent(contactsForm.render());
});

events.on('contacts:submit', () => {
	const orderApiData = Object.assign(
		appData.order,
		{ total: basketData.amount },
		{ items: basketData.getCardsId() }
	);
	getApi.post('/order', orderApiData).then((res: Partial<IDataApiCard>) => {
		modal.setContent(succes.render({}));
		succes.setAmount(res.total);
		basketData.clearBasket();
		appData.initOrder();
	});
});

events.on(
	/^order\..*:change|^contacts\..*:change/,
	(data: { nameForm: string; field: keyof Partial<IOrder>; value: string }) => {
		appData.setOrderField(data.nameForm, data.field, data.value);
	}
);

events.on('order.payment:change', (evt: { payment: string }) => {
	appData.order.payment = evt.payment;
	events.emit('order:changed');
});

events.on('order:changed', () => {
	const { address, payment } = appData.validateOrder();
	const valid = !address && !payment;
	const errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	paymentForm.render({
		address: appData.order.address,
		payment: appData.order.payment,
		valid: valid,
		errors: errors,
	});
});

events.on('contacts:changed', () => {
	const { email, phone } = appData.validateOrder();
	const valid = !email && !phone;
	const errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');

	contactsForm.render({
		email: appData.order.email,
		phone: appData.order.phone,
		valid: valid,
		errors: errors,
	});
});

events.on('succes:close', () => {
	modal.close();
});

getApi
	.get('/product')
	.then((result: IDataApiCard) => {
		cardsData.cards = result.items;
		events.emit('loadingData');
	})
	.catch((err) => {
		console.error(err);
	});

appData.initOrder();
