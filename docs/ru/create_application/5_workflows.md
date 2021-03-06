## Бизнес-процессы

Бизнес-процесс строится на основе сущностей, созданных в п. [2](docs/ru/create_application/2_class.md). Переходим в дереве приложения в пункт навигации «Бизнес-процессы», в рабочей панели выбираем действие `«Создать бизнес-процесс»`:

![27](/docs/ru/system_folder/27.png)

Открывается форма создания бизнес-процесса, заполняем обязательные поля. После сохранения формы и перехода по пункту меню созданного бизнес-процесса – в рабочей панели выбираем действие `«Создать состояние»`. Заполняем данные для состояния бизнес-процесса *"Ввод данных" [dataInput]*, в соответствии с описанием его свойств в [таблице](docs/ru/system_folder/table4.md)

Создаем еще два состояния: 
* «Проверка адреса» [addressVerification]
* «Проверен» [checked]
	
Далее, при переходе на пункт меню с наименованием состояния, на рабочей панели становится доступно действие «Создать переход». Создаем переходы для каждого состояния в соответствии с описанием его свойств в [таблице](), согласно схеме:

![38](/docs/ru/system_folder/38.png)

Также с помощью переходов по бизнес-процессу можно отправлять `SOAP запросы` во внешнюю систему. Достаточно задать условие для возможности перехода по БП, которое проверяет готовность запроса к отправке и по завершению перехода, во время которого и произойдет отправка данных, присвоить отметку об успешной отправке запроса.

Далее возвращаемся на форму редактирования бизнес-процесса в целом (для этого переходим в пункт меню `«Проверка адреса»` и на рабочей панели выбираем действие `«Редактировать бизнес-процесс»`) и задаем значение в поле свойства **«Начальное состояние» = Ввод данных [dataInput]**. Структура пунктов навигации созданного бизнес-процесса:

![30](/docs/ru/system_folder/30.png)

Для отображения схемы бизнес-процесса в рабочей области Подсистемы необходимо перейти по пункту навигации `«Бизнес-процессы»` и выбрать бизнес-процесс для отображения. После в рабочей панели отобразиться действие `«Автоматическая расстановка»`, при нажатии на кнопку данного действия элементы бизнес-процесса выстроят связи автоматически:

![31](/docs/ru/system_folder/31.png)

На рабочей панели бизнес процесса доступно действие формирования текстового документа в формате *DOCX, XSLX, PDF, или иного*. Документ заполняется на основе переменных бизнес-процесса. Шаблон создаваемого документа выбирается из списка определенных ранее, либо создается индивидуально.
