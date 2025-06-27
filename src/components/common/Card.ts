import { IEvents } from '../base/events';
import { Component } from '../base/Component';
import { ICard } from '../../types';
import { CDN_URL } from '../../utils/constants';

export class Card extends Component<ICard> {
  cardItem: HTMLElement;
  cardCategory: HTMLElement;
  cardTitle: HTMLElement;
  cardImage: HTMLImageElement;
  cardPrice: HTMLElement;
  cardDescription: HTMLElement;
  events: IEvents;
  cardId: string;
  protected addProductButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.cardCategory = this.container.querySelector('.card__category');
    this.cardTitle = this.container.querySelector('.card__title');
    this.cardImage = this.container.querySelector('.card__image');
    this.cardPrice = this.container.querySelector('.card__price');
    this.cardDescription = this.container.querySelector('.card__text');
    this.addProductButton = this.container.querySelector('.button');
    this.events = events;
    if (this.addProductButton) {
      this.addProductButton.addEventListener('click', () => {
        this.events.emit('card:addToBasket', { cardId: this.id });
        this.stateButton(true);
      });
    }
    if (!this.container.classList.contains('card_compact')) {
      this.container.addEventListener('click', () => {
        this.events.emit('card:select', { cardId: this.id });
      });
    }
  }
  set title(title: string) {
    this.cardTitle.textContent = title;
  }

  get title() {
    return this.cardTitle.textContent;
  }

  set image(link: string) {
    this.cardImage.src = CDN_URL + link;
    this.cardImage.alt = `Картинка товара ${this.title}`;
  }

  set price(price: string | null) {
    if (price === null) {
      this.cardPrice.textContent = 'Бесценно';
      if (this.addProductButton) {
        this.addProductButton.disabled = true;
      }
    } else {
      this.cardPrice.textContent = `${price} синапсов`;
    }
  }

  get price() {
    return this.cardPrice.textContent;
  }

  set id(id) {
    this.cardId = id;
  }
  get id() {
    return this.cardId;
  }

  set description(description: string | null) {
    if (this.cardDescription) {
      this.cardDescription.textContent = description;
    }
  }

  set category(category: string) {
    this.cardCategory.textContent = category;
  }
  
  stateButton(state: boolean) {
    this.addProductButton.disabled = state;
  }

  render(cardData: Partial<ICard>) {
    const { ...otherCardData } = cardData;
    return super.render(otherCardData);
  }
}
