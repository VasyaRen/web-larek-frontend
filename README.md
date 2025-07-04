# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных 

Данные товара 
```
interface ICard {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  price: number;
}
```
Данные, передаваемые пользователем
```
interface IOrder {
  payment: string
  address: string
  phone: string
  email: string
}
```
Данные страницы 
```
interface IPage {
    counterBasket: number;
    catalogCard: HTMLElement[];
    locked: boolean;
}
```
Интерфейс для модели данных карточек
```
interface IDataApiCard {
	items: ICard[];
  total: number;
	getCard(cardId: string): ICard;
}
```
Интерфейс для модели данных корзины
```
export interface IDataCardBasket {
	items: TCardBasket[];
  addCard(data: TCardBasket) : void;
  deleteCard(id: string) : void;
  clearBasket(): void;
  getTotalAmount() : void;
  getCard(cardId: string): TCardBasket;
  getCardsId() : string[];
}
```
Данные карточки, используемые для корзины
```
export type TCardBasket = Pick<ICard, 'id' | 'title' | 'price'>;
```

## Архитектура приложения
Код разделен на три слоя в соответвии с MVP:
- слой отображения;
- слой данных; 
- презентер

### Базовый код

#### Класс Api
Содержит логику отправки запросов.В конструктор передается URL-адрес и опциональный объект с заголовками запросов.\
Методы: 
- 'get', который принимает в качестве параметра эндпоинт, выполняет GET-запрос и возвращает промис с объектом с сервера.
- 'post', который принимает: 
  1. эндпоинт;
  2. объект с данными, который передается в JSON в теле запроса и который отправляется на переданный эндпоинт;
  3. метод (задан POST)

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- on - подписка на событие;
- emit - инициализация события 

#### Слой данных

#### Класс DataCards
Отвечает за массив данных карточек и взаимодействие с этими данными. \
Поля:\
- items: : ICard[] - массив объектов карточек;
- total: number - cумма купленных карточек, для ответа сервера о заказе;
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Методы:\
- сеттер cards - позволяет сохранить данные карточек с сервера;
- геттер cards - позволяет запросить массив сохраненных данных карточек;
- метод getCard(cardId: string) : ICard  - принимает параметр cardId и с помощью него возвращает данные конкретной карточки, соотвествующей переданному id

#### Класс DataBasket
Отвечает за данные корзины и взаимодействие с этими данными.\
Поля: \
- items: TCardBasket[] - массив объектов данных карточек, добавленных в корзину, данные каждой карточки соотвествуют типу `TCardBasket`;
- amount - сумма товаров в корзине;
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.
- itemCount: number - количество карточек в корзине;

Методы:\
- addCard(data: TCardBasket) : void - добавить данные карточки в массив данны корзины. Устанавливается событие, сигнализирующее об изменении корзины;
- deleteCard(id: string) : void - удалить данные карточки в массив данны корзины. Устанавливается событие, сигнализирующее об изменении корзины;
- clearBasket(): void - очистить корзину, устанавливается событие, сигнализирующее об изменении корзины;
-  getTotalAmount() : void - посчитать сумму корзины;
-  getCard(cardId: string): TCardBasket - получить данные карточки из массива по айди (для дальнейшей проверки наличия карточки в корзине);
-  getCardsId() : string[]  - получить массив айди всех карточек, добавленных в корзину

#### Класс AppState 
Отвечает за данные заказа и взаимодействие с этими данными. \
Методы:
- initOrder(): void - инициализация данных заказа;
- setOrderField() : void - устанавливает значение каждому полученному полю, устанавливает событие, что форма изменилась;
- validateOrder() - проверяет валидность значений полей и вовзращает текст ошибки в случае невалидности


#### Представление:

#### Базовый Класс Component
Класс является родителем всех компонентов слоя представления.

#### Класс Page
Отвечает за отображение всей страницы. В конструктор передается контейнер и экземляр класса `EventEmitter`  для установки событий. В конструкторе устанавливается слушатель на интерактивный элемент.\
Поля:
- counterBasket - счетчик количества товаров на иконке корзины;
- catalogCard - контейнер, куда выводятся все карточки товара;
- wrapper: вся основаня страница;
- basketOpenButton - кнопка открытия корзины;

Методы:
- сеттер counter - устанавливает количество товаров в корзине;
- сеттер locked - управляет фиксацией страницы, для реализации открытия и закрытия модального окна

#### Класс Card 
Отвечает за отображение карточки: устанавливает название, описание, изображение, категорию, цену. Класс используется для отображения карточки на странице. \
Наследует Компонент. В конструктор передается контейнер с необходимой разметкой и экземляр класса `EventEmitter`  для установки событий. В классе устаналиваются слушатели на все интерактивные элементы.\
Методы:
- сеттеры title, image, price, id, description, category - заполняют атрибуты элементов карточки данными;
- геттер id - возращает уникальный id карточки;
- геттер price - возвращает цену товара карточки;
- stateButton(state: boolean) - делает кнопку активной или неактивной
- render():HTMLElement - принимает данные, возвращает полностью заполненную карточку со слушателями событий.


#### Класс CardContainer
Отвечает за отображение галереи карточек на главной странице. В констурктор передается контейнер, куда будут вставляться карточки.\
Методы:
- сеттер catalog(items: HTMLElement[]) - устанавливает переданный массив карточек


#### Класс Modal 
Отвечает за реализацию модального окна с вариативным наполнением. В констуктор передаются клон темлпейта модального окна и экземпляр `EventEmitter`  для установки событий, также устанавливаются слушатели для реализации вариантов закрытия модального окна.\
Методы:
- setContent (сontent: HTMLElement) - принимает необходимый в конкертном случае элемент и устанавливает его в контейнер;
- open() : void  - открывает модальное окно;
- close() : void  - закрывает модальное окно;
- handleEscUp () : void - закрывает модальное окно по кнопке ESC


#### Класс Basket
Отвечает за отображение корзины. \
Поля:
- orderButton - кнопка оформления заказа

Методы:
- totalAmount(total: number): void  - принимает число общей суммы товаров, устанавливает это число

#### Класс BasketItemView
Отвечает за отображение карточки товара в корзине. Наследует `Card`. Конструктор принимает клон темплейта краткой карточки товара и экземпляр `EventEmitter`  для установки событий. В констуркторе на инераткивный элемент устанавливается слушатель для реализации удаления карточки.\
Поля:
- removeButton - защищенное свойство, кнопка для удаления товара из корзины.

Методы:
- setIndex (index: number) : void  - устанавливает порядковый номер

#### Класс BasketContainer 
Отвечает за отображение массива кратких карточек добавленного товара в корзине.\
Методы:
- сеттер catalog - устанавливает в контейнер массив DOM-элементов карточек товара; 
- totalAmount(total: number) - устанавливает общую сумму заказа по переданным данным

#### Класс Form 
Общий родительский класс для всех форм.В конструктор передается клон темплейта необходимой формы и экземпляр `EventEmitter`  для установки событий. В конструкторе на форму устанавливается слушатель события 'input', сохраняющий при изменении инпута данные и передающий их в метод 'onInputChange'.\
Поля:
- submit - защищенное поле, кнопка сабмита формы;
- errors - защищенное поле, спан для ошибки формы

Методы:
- onInputChange () : void  - принимает поле и значение измененного инпута, инициализирует событие и передает эти данные;
- сеттер valid - принимает логическое значение, отвечает за активность/неактивность кнопки сабмита;
- сеттер errors - устанавливает текст ошибки;
- setText() : void - универсальный метод установки текста в указанный элемент разметки;
- render() : HTMLFormElement - отвечает за рендер формы с актуальными данными и актуальным состоянием кнопки

#### Класс PaymentForm
Отвечает за реализацию формы выбора способа опалаты и адреса доставки. В констурктор передается клон темплейта необходимой формы и экземпляр `EventEmitter`  для установки событий. Внутри конструктора на интераткивные элементы устанавливаются слушатели событий, сообщающий об изменении данных заказа в модель данных.\
Поля:
- buttonCash: - кнопка оплаты при получении;
- buttonCard: - кнопка оплаты по карте\

Методы:
- сеттер address - устанавливает значение address;


#### Класс ContactsForm
Отвечает за реализацию формы данных пользователя. В констурктор передается клон темплейта необходимой формы и экземпляр `EventEmitter` для установки событий. 
Методы:
- сеттер phone - устанавливает значение phone;
- сеттер email - устанавливает значение email

#### Succes
Отвечает за отображение модального окна об успешном оформлении заказа. В конструкторе устаналивается слушатель для интеарктивного элемента - кнопки.
Методы:
- setAmount (totalAmount: number): void - устанавливает общую сумму заказа

### Слой коммуникации
## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
- `'loadingData'` - отрисовка карточек;
- `'card:select'` - клик по карточке товара;
- `'card:addToBasket'` - добавление товара в корзину;
- `'card:removeFromBasket'` - удаление товара из корзины;
- `'modal:close'` - закрытие модального окна;
- `'modal:open'` - открытие модального окна;
- `'basket:open'` - открытие корзины;
- `'basket:order'` - оформление заказа;
- `'order:submit'` - отправка формы с данными по выбору оплаты и места доставки;
- `'contacts:submit'` - отправка формы с контактными данными пользователя, отправка данных заказа на сервер;
- `'/^order\..*:change|^contacts\..*:change/'` - изменение инпутов в обеих формах;
- `'order.payment:change'` - изменения данных заказа по выборе оплаты;
- `'order:changed'`- изменения данных заказа в форме с выбором оплаты и местом доставки;
- `'contacts:changed'`- изменения данных заказа в форме контактными данными пользователя;
- `'succes:close'` - закрытие окна об успешном оформлении заказа
