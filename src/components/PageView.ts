import { IEvents } from './base/events';
import { Component } from './base/Component';
import {IPage} from '../types';

export class Page extends Component<IPage> {
    protected counterBasket: HTMLElement;
    protected catalogCard: HTMLElement;
    protected wrapper: HTMLElement;
    protected basketOpenButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.counterBasket = document.querySelector('.header__basket-counter');
        this.catalogCard = document.querySelector('.gallery');
        this.wrapper = document.querySelector('.page__wrapper');
        this.basketOpenButton = document.querySelector('.header__basket');

        this.basketOpenButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.counterBasket.textContent = String(value);
    }


    set catalog(items: HTMLElement[]) {
        this.catalogCard.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this.wrapper.classList.add('page__wrapper_locked');
        } else {
            this.wrapper.classList.remove('page__wrapper_locked');
        }
    }
}
