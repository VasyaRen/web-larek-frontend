import { IEvents } from "./events";
import { Component } from "./Component";
interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  events: IEvents;
  content: HTMLElement;
  closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.content = container.querySelector('.modal__content');
    this.closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
    this.events = events;
    this.closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('mousedown', (evt) => {
      if (evt.target === evt.currentTarget) { this.close(); }
    });
    this.handleEscUp = this.handleEscUp.bind(this);

  }

  setContent(content: HTMLElement) { 
    this.content.replaceChildren(content);
    this.open();
  }

  open() {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
    document.addEventListener('keyup', this.handleEscUp);
  }

  close() {
    this.container.classList.remove('modal_active');

    this.events.emit('modal:close');
  }

  handleEscUp(evt: KeyboardEvent) {
    if (evt.key === 'Escape') { this.close() };
  }
}