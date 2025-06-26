import { Component } from "./base/Component";

export interface ICardsContainer {
catalog: HTMLElement[];
}

export class CardConainer extends Component<ICardsContainer> { //отвечает за вывод массив карточек на странице
protected cardCatalog: HTMLElement;
protected container: HTMLElement;

constructor (container: HTMLElement) {
super(container);   
}

set catalog(items: HTMLElement[]){ //передаем объект массив карточек 
this.container.replaceChildren(...items);}

render(data: Partial<ICardsContainer>) {
Object.assign(this, data);
return this.container;
}
}