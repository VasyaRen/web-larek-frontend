import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IFormState {
	valid: boolean;
	errors: string;
}

export class Form<T> extends Component<IFormState> {
	protected submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this.submit = container.querySelector(
			'.button[type=submit]'
		) as HTMLButtonElement;
		this._errors = container.querySelector('.form__errors') as HTMLSpanElement;
		this.container.addEventListener('input', (evt: Event) => {
			const target = evt.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;

			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (evt: Event) => {
			evt.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	protected onInputChange(field: keyof T, value: string) {
		const nameForm = this.container.name;
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			nameForm,
			field,
			value,
		});
	}

	set valid(value: boolean) {
		this.submit.disabled = !value;
	}

	set errors(value: string) {
		this._errors.textContent = value;
		this.setText(this._errors, value);
	}
	setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	render(state?: Partial<T> & IFormState) {
		if (!state) return this.container;
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}
