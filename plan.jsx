/* eslint-disable capitalized-comments */
/* eslint-disable object-curly-newline */
/* eslint-disable array-bracket-newline */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable spaced-comment */
/* eslint-disable no-warning-comments */
/* eslint-disable max-statements-per-line */
const applicationId = 'GUID';
const classId = 'GUID';
const propertyId = 'GUID';
const sectionId = 'GUID';
const nodeId = 'GUID';
const nestedNodeId = 'GUID';
const workflowId = 'GUID';
const stateId = 'GUID';
const transitionId = 'GUID';
const taskId = 'GUID';

/*
Требования:
  1. мета классов
  2. Навигация
  3. Представления
  4. Бизнесс-процессы
  5. Настройка базовая
  6. Экспорт и импорт
  7. Работа с неск.приложениями (солюшны)
  8. АПИ развертываня
  9. АПИ хранения в облаке
  10.Переработка визуального конструктора веб-стрниц для модуля portal
  11 Реализация конструкторов для geomap, report
*/

/*
План:

  1. Подготовка окружения
    * конфигурация webpuck, модули npm, бабели-реакты
    * https://medium.com/@stasonmars/%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE-%D0%BF%D0%BE-%D1%82%D1%80%D1%91%D0%BC-%D1%81%D0%BF%D0%BE%D1%81%D0%BE%D0%B1%D0%B0%D0%BC-%D1%81%D1%82%D0%B8%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8-%D0%B2-react-2ca5c0c7464b
    * Решить вопрос с оптимизацией
    * внедрение в приложение новый ejs-шаблон по-умолчанию, точка входа
    * провайдер redux, main-компонент
*/

//2.TODO Разработка хранилища, действий, редюсеров и пр. Решить вопрос локального Хранения.
  const state = {
    applications: {
      [applicationId]: {
        classes: {
          [classId]: {
            meta: {/*Мета класса (кроме аргументов)*/},
            properties: {
              [propertyId]: {/*Мета аргумента*/}
            },
            printViews: [], //TODO
            views: {
              create: {/*Мета представления*/},
              item: {/*Мета представления*/},
              list: {/*Мета представления*/}
            }
          }
        },
        navgation: {
          [sectionId]: {
            meta: {/*Мета секции*/},
            nodes: {
              [nodeId]: {
                meta: {/*Мета узла*/},
                nodes: {
                  [nestedNodeId]: {
                    meta: {/*Мета узла*/},
                    views: {
                      [classId]: {
                        create: {/*Мета представления*/},
                        item: {/*Мета представления*/},
                        list: {/*Мета представления*/}
                      }
                    }
                  }
                }
              }
            }
          }
        },
        workflows: {
          [workflowId]: {
            meta: {/*Мета бизнесс-процесса (кроме состояний и переходов)*/},
            states: {
              [stateId]: {
                meta: {/*Мета состояния*/},
                views: {
                  [classId]: {/*Мета представления редактирования*/}
                }
              }
            },
            transitions: {
              [transitionId]: {/*Мета перехода*/}
            }
          }
        },
        tasks: {//TODO
          [taskId]: {/* Конфигурация задания
            description,
            disabled,
            worker,
            launch: {check, timeout, sec/second, min/minute, day/dayOfYear/weekday, week ... },
            node,
            di
          */}
        },
        portal: {//TODO
          config: {/* Конфигурация модуля
            portalName
            needAuth
            theme
            pageTitle
            templates
            statics
            pageEndContent
            env
            default
            pageTemplates
            di
          */},
          navigation: {/*Узлы навигации портала*/}
        },
        changeLogs: [
          //TODO полагаю тут можно опереться на Redux
        ],
        deploy: {
          namespace: '',
          parametrised: true,
          deployer: 'built-in',
          globals: {
            lang: 'ru',
            theme: 'applications/azaza/themes/www',
            pageEndContent: '',
            pageTitle: 'Azaza Ololo',
            moduleTitles: {
            },
            explicitTopMenu: {
            },
            staticOptions: {
              maxAge: 3600000
            },
            plugins: {
            }
          },
          modules: {//TODO
            registry: {},
            ionadmin: {}
          }
        },
        'package': {
          //TODO
          name: 'Example',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          version: '0.0.0',
          changedState: {major: true, minor: true, patch: true}, //TODO
          ionMetaDependencies: [], //TODO
          ionModulesDependencies: [], //TODO
        }
      }
    },
    solutions: {
      [solutionId]: {
        name: 'Example Solution',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        applications: [applicationId],
        expandedElements: {
          [applicationId]: {
            classes: {[classId]: true},
            navgation: {
              [sectionId]: {
                [nodeId]: true
              }
            },
            workflows: true,
            tasks: false
          }
        },
        activeElement: `${applicationId}.classes.${classId}.properties.${propertyId}`
        //TODO Позиционирование UML тоже нужно хранить в решении.
      }
    },
    currentSolution: solution1.Id,
    solutionsManager: false,
    applicationsManager: {
      mode: 0,
    },
    showHelp: false
  };

  const actions = {
    SHOW_SOLUTIONS_MANAGER: 'SHOW_SOLUTIONS_MANAGER', //записать true в state.solutionsManager
    HIDE_SOLUTIONS_MANAGER: 'HIDE_SOLUTIONS_MANAGER', //записать false в state.solutionsManager
    SELECT_SOLUTION: 'SELECT_SOLUTION',               //записать переданное значение в state.currentSolution и false в state.solutionsManager
    CREATE_SOLUTION: 'CREATE_SOLUTION',               //записать переданный объект в state.solutionsManager
    SUBMIT_CREATE_SOLUTION: 'SUBMIT_CREATE_SOLUTION', //Создать на основе переданного объекта в state.solutions новое решение, записать false в state.solutionsManager
    EDIT_SOLUTION: 'EDIT_SOLUTION',                   //Редактировать решение из state.solutions и записать его идентификатор в state.solutionsManager
    REMOVE_SOLUTION: 'REMOVE_SOLUTION',               //Удалить из state.solutions элемент с переданным идентификатором.

    TOGGLE_APPLICATIONS_MANAGER: 'SHOW_APPLICATIONS_MANAGER', //записать переданное значение в state.applicationsManager.mode

    TOGGLE_HELP: 'SHOW_HELP', //записать в state.showHelp переданное значение

    SHOW_VIEW: 'SHOW_VIEW',                     //заптисать в текущее решение в activeElement переданный путь.
    TOGGLE_SIDEBAR_NODE: 'TOGGLE_SIDEBAR_NODE', //по переданному пути записать переданное значение в solutions.expandedElements
  };

//3. Основная сетка:
  const studio = <>     {/* корневой контейнер растягивается по ширине и высоте */}
    <Header>            {/* заголовок, растягивается по ширине, фиксированная высота */}
      <Logo/>           {/* логотип */}
      <button onClick={() => actions.SHOW_SOLUTIONS_MANAGER()}/>
      <button onClick={() => actions.TOGGLE_APPLICATIONS_MANAGER(1)}/>
      <button onClick={() => actions.TOGGLE_HELP(true)}/>
      <button onClick={/*TODO SelectLanguage*/}/>
    </Header>
    <Sidebar/>              {/* растягивается по высоте, фиксированная высота */}
    <ViewSwitcher/>         {/* растягивается по высоте и ширине, отступая сверху и слева. */}
    <SolutionsManager/>     {/* модальное окно с блокировкой фона */}
    <ApplicationsManager/>  {/* модальное окно с блокировкой фона */}
    <Help/>                 {/* модальное окно с блокировкой фона, отображаемое если state.showHelp === true */}
  </>;

//4.TODO SolutionManager:
  if (state.solutionsManager === true) {
    /*
    Показать модальное окно со списком решений из state.solutions. В этом списке можно выбрать решение. Так же выводятся кнопки:
      * Создать       - Безусловно доступна. Вызывает действие CREATE_SOLUTION
      * Выбрать       - Доступна, если выбрано решение. Вызывает действие SELECT_SOLUTION
      * Редактировать - Доступна, если выбрано решение. Вызывает действие EDIT_SOLUTION
      * Удалить       - Доступна, если выбрано решение. Вызывает действие REMOVE_SOLUTION
    */
  } else if (typeof state.solutionsManager === 'object') {
    /*
    Показывать модальное окно с формой создания решения state.solutionsManager.
      * Редактирование формы вызывает действие CREATE_SOLUTION
      * Отправка формы вызывает действие SUBMIT_CREATE_SOLUTION
      * Закрытие формы вызывает действие HIDE_SOLUTIONS_MANAGER
    */
  } if (state.solutions[state.solutionsManager]) {
    /*
    Показывать модальное окно с формой редактирования решения state.solutions[state.solutionsManager].
      * Редактирование формы вызывает действие EDIT_SOLUTION и передачу в него ИД решения и данные с формыЫ
      * Закрытие формы вызывает действие HIDE_SOLUTIONS_MANAGER
    */
  } else {
    //Не показывать ничего
  }
  
//5. ApplicationsManager:
  const ApplicationsManager = () => <>
    {state.applicationsManager.mode !== 0 && <Modal>
      <button onClick={() => actions.TOGGLE_APPLICATIONS_MANAGER(0)}/>
      {/* TODO Список приложений, каждое из которых можно удалить */}
      <select value={state.applicationsManager.mode} onChange={event => actions.TOGGLE_APPLICATIONS_MANAGER(event.target.value)}>
        <option value="1">Create new application</option>
        <option value="2">Upload application</option>
        <option value="3">Load demo app</option>
        <option value="4">Load from custom URL</option>
      </select>
      {state.applicationsManager.mode === 1 && {/* TODO Форма создания приложения */}}
      {state.applicationsManager.mode === 2 && {/* TODO Кнопка загрузки файла */}}
      {state.applicationsManager.mode === 3 && {/* TODO Выбор демо-прилложения */}}
      {state.applicationsManager.mode === 4 && {/* TODO Ввод кастомного URl */}}
    </Modal>}
  </>;


//6. Sidebar:
  //Компонент sidebarNode отвечает за отображение узла в соответствии с solution.expandedElements и solution.activeElement
  //Так же он отвечает за поведения открытия/закрытия узла с использованием действия TOGGLE_SIDEBAR_NODE
  //Специфичные для разных узлов стили оформления задаются на уровне сайдбара
  const Sidebar = <ul>
    <SidebarNode caption="ТЕКУЩЕЕ РЕШЕНИЕ"
                  onClick=      {actions.SHOW_VIEW()}
                  onDoubleClick={actions.SHOW_VIEW() + 
                                  actions.EDIT_SOLUTION(state.currentSolution)}
    >
      <ul>
      <SidebarNode caption="КАЖДОЕ ПРИЛОЖЕНИЕ РЕШЕНИЯ"
                  onClick=      {actions.SHOW_VIEW(applicationId)}
                  onDoubleClick={actions.SHOW_VIEW(`${applicationId}.edit`)}
      >
        <ul>
          <SidebarNode caption="КЛАССЫ"
                  onClick=      {actions.SHOW_VIEW(`${applicationId}.classes`)}
                  onDoubleClick={actions.SHOW_VIEW(`${applicationId}.classes`)}
          >
            <ul>
            <SidebarNode caption="КАЖДЫЙ КЛАСС ПРИЛОЖЕНИЯ"
                  onClick=      {actions.SHOW_VIEW(`${applicationId}.classes.${classId}`)}
                  onDoubleClick={actions.SHOW_VIEW(`${applicationId}.classes.${classId}.edit`)}
            >
              <ul><SidebarNode caption="КАЖДЫЙ АТТРИБУТ КЛАССА"
                  onClick=      {actions.SHOW_VIEW(`${applicationId}.classes.${classId}.properties.${propertyId}`)}
                  onDoubleClick={actions.SHOW_VIEW(`${applicationId}.classes.${classId}.properties.${propertyId}.edit`)}
              /></ul>
            </SidebarNode>
            </ul>
          </SidebarNode>
          <SidebarNode caption="НАВИГАЦИЯ"
                  onClick=      {actions.SHOW_VIEW(`${applicationId}.navgation`)}
                  onDoubleClick={actions.SHOW_VIEW(`${applicationId}.navgation`)}
          >
            <ul>
            <SidebarNode caption="КАЖДАЯ НАВ.СЕКЦИЯ ПРИЛОЖЕНИЯ"
                  onClick=      {actions.SHOW_VIEW(`${applicationId}.navgation.${sectionId}`)}
                  onDoubleClick={actions.SHOW_VIEW(`${applicationId}.navgation.${sectionId}.edit`)}
            >
              <ul>
              <SidebarNode caption="КАЖДЫЙ НАВ.УЗЕЛ СЕКЦИИ"
                  onClick=      {actions.SHOW_VIEW(`${applicationId}.navgation.${sectionId}.nodes.${nodeId}`)}
                  onDoubleClick={actions.SHOW_VIEW(`${applicationId}.navgation.${sectionId}.nodes.${nodeId}.edit`)}
              >
                {/* На произвольную глубину вложенности */}
                <ul><SidebarNode caption="КАЖДЫЙ НАВ.УЗЕЛ УЗЛА"
                  onClick=      {actions.SHOW_VIEW(`${applicationId}.navgation.${sectionId}.nodes.${nodeId}.nodes.${nestedNodeId}`)}
                  onDoubleClick={actions.SHOW_VIEW(`${applicationId}.navgation.${sectionId}.nodes.${nodeId}.nodes.${nestedNodeId}.edit`)}
                /></ul>
              </SidebarNode>
              </ul>
            </SidebarNode>
            </ul>
          </SidebarNode>
          <SidebarNode caption="БИЗНЕСС-ПРОЦЕССЫ"
                  onClick=      {actions.SHOW_VIEW(`${applicationId}.workflows`)}
                  onDoubleClick={actions.SHOW_VIEW(`${applicationId}.workflows`)}
          >
            <ul>
            <SidebarNode caption="КАЖДЫЙ БИЗНЕСС-ПРОЦЕСС ПРИЛОЖЕНИЯ"
                  onClick=      {actions.SHOW_VIEW(`${applicationId}.workflows.${workflowId}`)}
                  onDoubleClick={actions.SHOW_VIEW(`${applicationId}.workflows.${workflowId}.edit`)}
            >
              <ul><SidebarNode caption="КАЖДОЕ СОСТОЯНИЕ БИЗНЕСС-ПРОЦЕССА"
                  onClick=      {actions.SHOW_VIEW(`${applicationId}.workflows.${workflowId}.states.${stateId}`)}
                  onDoubleClick={actions.SHOW_VIEW(`${applicationId}.workflows.${workflowId}.states.${stateId}.edit`)}
              /></ul>
              <ul><SidebarNode caption="КАЖДЫЙ ПЕРЕХОД БИЗНЕСС-ПРОЦЕССА"
                  onClick=      {actions.SHOW_VIEW(`${applicationId}.workflows.${workflowId}.transitions.${transitionId}`)}
                  onDoubleClick={actions.SHOW_VIEW(`${applicationId}.workflows.${workflowId}.transitions.${transitionId}.edit`)}
              /></ul>
            </SidebarNode>
            </ul>
          </SidebarNode>
          <SidebarNode caption="ПЛАНИРОВЩИК ЗАДАЧ"
                  onClick=      {actions.SHOW_VIEW(`${applicationId}.tasks`)}
                  onDoubleClick={actions.SHOW_VIEW(`${applicationId}.tasks`)}
          >
            <ul><SidebarNode caption="КАЖДАЯ ЗАДАЧА ПРИЛОЖЕНИЯ"
                  onClick=      {actions.SHOW_VIEW(`${applicationId}.tasks.${taskId}`)}
                  onDoubleClick={actions.SHOW_VIEW(`${applicationId}.tasks.${taskId}.edit`)}
            /></ul>
          </SidebarNode>
          <SidebarNode caption="PORTAL"
                  onClick=      "TODO"
                  onDoubleClick="TODO"
          >
            <ul><SidebarNode caption="КАЖДАЯ СТРАНИЦА ПОРТАЛА ПРИЛОЖЕНИЯ"
                  onClick=      "TODO"
                  onDoubleClick="TODO"
            /></ul>
          </SidebarNode>
        </ul>
      </SidebarNode>
      </ul>
    </SidebarNode>
  </ul>;

/*7. PathProvider:
  const PathProvider = {
    parse: функция, принимающая строку пути и возвращающая объект с типом страницы и данными, полученными при разборе пути
    getPath: функция, принимающая тип страницы и данные, необходимые для составления пути. Возращает строку пути.
  }
*/

//8. ViewSwitcher:
  switch (state.solutions[state.currentSolution].activeElement) {
    case '': <SolutionView/>; break;
    case    applicationId:                  <Application application={applicationId}/>; break;
    case `${applicationId}.edit`:           <ApplicationForm application={applicationId}/>; break;
    case `${applicationId}.changeLog`:      <ChangeLog application={applicationId}/>; break;
    case `${applicationId}.configuration`:  <Configuration application={applicationId}/>; break;
    case `${applicationId}.classes`:                        <Classes application={applicationId}/>; break;
    case `${applicationId}.createClass`:                    <ClassCreationForm application={applicationId}/>; break;
    case `${applicationId}.classes.${classId}`:             <Class application={applicationId} class={classId}/>; break;
    case `${applicationId}.classes.${classId}.edit`:        <ClassForm application={applicationId} class={classId}/>; break;
    case `${applicationId}.classes.${classId}.views`:       <ClassViews application={applicationId} class={classId}/>; break;
    case `${applicationId}.classes.${classId}.properties`:  <Properties application={applicationId} class={calssId}/>; break;
    case `${applicationId}.classes.${classId}.properties.${propertyId}`:
                                                            <Property application={applicationId} class={classId} property={propertyId}/>; break;
    case `${applicationId}.classes.${classId}.properties.${propertyId}.edit`:
                                                            <Properties application={applicationId} class={calssId} property={propertyId}/>; break;
    case `${applicationId}.navgation`:
    case `${applicationId}.createSection`:                      <SectionCreationForm application={applicationId}/>; break;
    case `${applicationId}.navgation.${sectionId}`:
    case `${applicationId}.navgation.${sectionId}.edit`:        <SectionForm application={applicationId} section={sectionId}/>; break;
    case `${applicationId}.navgation.${sectionId}.createNode`:  <NodeCreationForm application={applicationId} section={sectionId}/>; break;
    case `${applicationId}.navgation.${sectionId}.nodes.${nodeId}...`:
    case `${applicationId}.navgation.${sectionId}.nodes.${nodeId}...edit`:
                                                                <NodeForm application={applicationId} section={sectionId} node={nodeId}/>; break;
    case `${applicationId}.navgation.${sectionId}.nodes.${nodeId}...createNode`: 
                                                                <NodeCreationForm application={applicationId} section={sectionId} node={nodeId}/>; break;
    case `${applicationId}.navgation.${sectionId}.nodes.${nodeId}...views`:
                                                                <NodeViews application={applicationId} section={sectionId} node={nodeId}/>; break;
    case `${applicationId}.workflows`:
    case `${applicationId}.createWorkflow`:                             <WorkflowCreationForm application={applicationId}/>; break;
    case `${applicationId}.workflows.${workflowId}`:                    <Workflow application={applicationId} workflow={workflowId}/>; break;
    case `${applicationId}.workflows.${workflowId}.edit`:               <WorkflowForm application={applicationId} workflow={workflowId}/>; break;
    case `${applicationId}.workflows.${workflowId}.createState`:        <StateCreationForm application={applicationId} workflow={workflowId}/>; break;
    case `${applicationId}.workflows.${workflowId}.createTransition`:   <TransitionCreationForm application={applicationId} workflow={workflowId}/>; break;
    case `${applicationId}.workflows.${workflowId}.states.${stateId}`:  <State application={applicationId} workflow={workflowId} state={stateId}/>; break;
    case `${applicationId}.workflows.${workflowId}.states.${stateId}.edit`:
                                                                        <StateForm application={applicationId} workflow={workflowId} state={stateId}/>; break;
    case `${applicationId}.workflows.${workflowId}.states.${stateId}.views`:
                                                                        <StateViews application={applicationId} workflow={workflowId} state={stateId}/>; break;
    case `${applicationId}.workflows.${workflowId}.transitions.${transitionId}`:
                                                                        <Transition application={applicationId} workflow={workflowId} transition={transitionId}/>; break;
    case `${applicationId}.workflows.${workflowId}.transitions.${transitionId}.edit`:
                                                                        <TransitionForm application={applicationId} workflow={workflowId} transition={transitionId}/>; break;
    case `${applicationId}.tasks`:                <Tasks application={applicationId}/>; break;
    case `${applicationId}.createTask`:           <TaskCreationForm application={applicationId}/>; break;
    case `${applicationId}.tasks.${taskId}`:      <Task application={applicationId} task={taskId}/>; break;
    case `${applicationId}.tasks.${taskId}.edit`: <TaskForm application={applicationId} task={taskId}/>; break;
    default: break;
  }

/*9.TODO UML:
  https://github.com/STRML/react-draggable
  https://github.com/kdeloach/react-lineto

  * Рисовать фигуры на плоскости
  * Передвигать фигуры
  * Автоматическая расстановка фигур
  * Рисовать связи между фигурами
  * Прокладывать связи между фигурами
  * Фокусировка на элементах и связях
  * onClick и onDoubleClick
*/

//10.TODO ClassUML: Адаптер для компонента UML
  const ClassUML = ({applications, _class, property}) => <>
    {/*
      applications - приложения, классы которых будут отображены
      _class - класс под фокусом. Если не указан, то не фокусировать
      property - аттрибут под фокусом. Если не указан, то фокусировать по классу. Если не указан класс, то игнорируется.
     */}
  </>;

//11. SolutionView:
  const SolutionView = <>
    <Toolbar>
      <button onClick={actions.EDIT_SOLUTION(state.currentSolution)}/>
    </Toolbar>
    <ClassUML applications={/*Массив проектов текущего решения*/}/>
  </>

//12.TODO Представления приложения:
//#region
    //TODO Надо пересмотреть и продумать структуру представлений.
    const ApplicationTabs = active => <Tabs>
      <button onClick={actions.SHOW_VIEW(`${applicationId}`)}/>
      <button onClick={actions.SHOW_VIEW(`${applicationId}.edit`)}/>
      <button onClick={actions.SHOW_VIEW(`${applicationId}.changelog`)}/>
      <button onClick={actions.SHOW_VIEW(`${applicationId}.configuration`)}/>
    </Tabs>
    const ApplicationToolbar = <Toolbar>
      <button onClick={actions.SHOW_VIEW(`${application}.createClass`)}/>
      <button onClick={/*TODO Развернуть в песочнице*/}/>
      <button onClick={/*TODO Скачать приложение*/}/>
    </Toolbar>;

    const Application = application => <>
      <ApplicationTabs/>
      <ApplicationToolbar/>
      <ClassUML applications={[application]}/>
    </>;

    const ApplicationForm = (application) => <>
      <ApplicationTabs/>
      <ApplicationToolbar/>
      {/* TODO Edit application form */}
    </>;

    const ChangeLog = (application) => <>
      <ApplicationTabs/>
      <ApplicationToolbar/>
      {/* TODO changelog */}
    </>;

    const Configuration = (application) => <>
      <ApplicationTabs/>
      <ApplicationToolbar/>
      {/* TODO configuration */}
    </>;
//#endregion

//13. Представления классов:
//#region
    const ClassTabs = ({active}) => <Tabs>
      <button onClick={actions.SHOW_VIEW(`${applicationId}.classes.${classId}`)}/>
      <button onClick={actions.SHOW_VIEW(`${applicationId}.classes.${classId}.edit`)}/>
      <button onClick={actions.SHOW_VIEW(`${applicationId}.classes.${classId}.properties`)}/>
      <button onClick={actions.SHOW_VIEW(`${applicationId}.classes.${classId}.views`)}/>
    </Tabs>;
    const ClassToolbar = () => <Toolbar>
      <button onClick={actions.SHOW_VIEW(`${application}.createClass`)}/>
      <button onClick={/*TODO Клонировать класс*/}/>
      <button onClick={/*TODO Добавить аттрибут*/}/>
      <button onClick={/*TODO Удалить класс*/}/>
    </Toolbar>;

    const Classes = application => <>
      <Tabs>
        <button onClick={actions.SHOW_VIEW(`${application}.classes`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.createClass`)}/>
      </Tabs>
      <ClassUML applications={[application]}/>
    </>;

    const ClassCreationForm = application => <>
      <Tabs>
        <button onClick={actions.SHOW_VIEW(`${application}.classes`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.createClass`)}/>
      </Tabs>
      {/* TODO Форма создания класса */}
    </>;

    const Class = ({application, classId}) => <>
      <ClassTabs/>
      <ClassToolbar/>
      <ClassUML applications={[application]} class={classId}/>
    </>;

    const ClassForm = ({application, classId}) => <>
      <ClassTabs/>
      <ClassToolbar/>
      {/* TODO форма редактирования класса */}
    </>;

    const ClassViews = ({application, classId}) => <>
      <ClassTabs/>
      <ClassToolbar/>
      {/* TODO представление для управления представлениями класса */}
    </>;

    const Properties = ({application, classId, property}) => <>
      <ClassTabs/>
      <ClassToolbar/>
      {/* TODO список аттрибутов класса, где они вывводятся по указанному порядку. с приведением ключевых данных. С возможностью раскрыть один для редактирования, либо удалять их */}
    </>;

    const Property = ({application, classId, property}) => <>
      <ClassTabs/>
      <Toolbar>
        <button onClick={actions.SHOW_VIEW(`${application}.createClass`)}/>
        <button onClick={/*TODO Клонировать класс*/}/>
        <button onClick={/*TODO Добавить аттрибут*/}/>
        <button onClick={/*TODO Удалить класс*/}/>
        <button onClick={/*TODO Редактировать атрибут (переход на список атрибутов с открытым текущим) */}/>
        <button onClick={/*TODO Удалить атрибут (переход на список атрибутов с открытым текущим) */}/>
      </Toolbar>
      <ClassUML applications={[application]} class={classId} property={property}/>
    </>;
//#endregion

//14. Представления навигации:
//#region
    const SectionCreationForm = application => <>
      <Tabs>
        <button onClick={actions.SHOW_VIEW(`${application}.createSection`)}/>
      </Tabs>
      {/* TODO Форма добавления секции навигации */}
    </>;

    const SectionForm = ({application, section}) => <>
      <Tabs>
        <button onClick={actions.SHOW_VIEW(`${application}.navgation.${section}.edit`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.navgation.${section}.createNode`)}/>
      </Tabs>
      <Toolbar>
        <button onClick={actions.SHOW_VIEW(`${application}.createSection`)}/>
        <button onClick={/*TODO Удалить секцию*/}/>
      </Toolbar>
      {/* TODO Форма редактирования секции навигации */}
    </>;

    const NodeCreationForm = ({application, section, node}) => <>
      <Tabs>
        {!node  && <button onClick={actions.SHOW_VIEW(`${application}.navgation.${section}.edit`)}/>}
        {node   && <button onClick={actions.SHOW_VIEW(`${application}.navgation.${section}.nodes.${node}.edit`)}/>}
        <button onClick={actions.SHOW_VIEW(`${application}.navgation.${section}.createNode`)}/>
      </Tabs>
      {/* TODO Форма создания узла навигации */}
    </>;

    const NodeForm = ({application, section, node}) => <>
      <Tabs>
        <button onClick={actions.SHOW_VIEW(`${application}.navgation.${section}.nodes.${nodePath}.edit`)}/>
        {node.type === 'группа' && <button onClick={actions.SHOW_VIEW(`${application}.navgation.${section}.nodes.${nodePath}.createNode`)}/>}
        {node.type !== 'группа' && <button onClick={actions.SHOW_VIEW(`${application}.navgation.${section}.nodes.${nodePath}.views`)}/>}
      </Tabs>
      <Toolbar>
        <button onClick={actions.SHOW_VIEW(`${application}.createSection`)}/>
        <button onClick={/*TODO Удалить узел*/}/>
      </Toolbar>
      {/* TODO Форма редактирования узла навигации */}
    </>;

    const NodeViews = ({application, section, node}) => <>
      <Tabs>
        <button onClick={actions.SHOW_VIEW(`${application}.navgation.${section}.nodes.${nodePath}.edit`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.navgation.${section}.nodes.${nodePath}.views`)}/>
      </Tabs>
      <Toolbar>{/* TODO */}</Toolbar>
      {/* TODO Страница управления представлениями узла */}
    </>;
//#endregion

/*15.TODO WorkflowUML:
    *application
    *workflow - отображаемый БП. Обязательный
    *state и transition - состояние и переход для наведения фокуса. Если ни один не указан - не фокусировать. Если указаны оба - фокусировать на состоянии.
*/

//16. Представления бизнесс-процессов
//#region
    const WorkflowCreationForm = application => <>
      <Tabs>
        <button onClick={actions.SHOW_VIEW(`${application}.createWorkflow`)}/>
      </Tabs>
      {/* TODO Форма добавления бизнесс-процесса */}
    </>;

    const Workflow = ({application, workflow}) => <>
      <Tabs>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.edit`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.createState`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.createTransition`)}/>
      </Tabs>
      <Toolbar>
        <button onClick={actions.SHOW_VIEW(`${application}.createWorkflow`)}/>
        <button onClick={/* TODO Клонировать */}/>
        <button onClick={/* TODO Удалить */}/>
      </Toolbar>
      <WorkflowUML application={application} workflow={workflow}/>
    </>;

    const WorkflowForm = ({application, workflow}) => <>
      <Tabs>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.edit`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.createState`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.createTransition`)}/>
      </Tabs>
      <Toolbar>
        <button onClick={actions.SHOW_VIEW(`${application}.createWorkflow`)}/>
        <button onClick={/* TODO Клонировать */}/>
        <button onClick={/* TODO Удалить */}/>
      </Toolbar>
      {/* TODO Форма редактирования бизнесс-процесса */}
    </>;

    const StateCreationForm = application => <>
      <Tabs>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.edit`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.createState`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.createTransition`)}/>
      </Tabs>
      {/* TODO Форма добавления состояния бизнесс-процесса */}
    </>;

    const TransitionCreationForm = application => <>
      <Tabs>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.edit`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.createState`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.createTransition`)}/>
      </Tabs>
      {/* TODO Форма добавления перехода бизнесс-процесса */}
    </>;

    const State = ({application, workflow, state}) => <>
      <Tabs>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.states.${state}`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.states.${state}.edit`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.states.${state}.views`)}/>
      </Tabs>
      <Toolbar>
        <button onClick={actions.SHOW_VIEW(`${application}.createWorkflow`)}/>
        <button onClick={/* TODO Удалить */}/>
      </Toolbar>
      <WorkflowUML application={application} workflow={workflow} state={state}/>
    </>;

    const StateForm = ({application, workflow, state}) => <>
      <Tabs>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.states.${state}`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.states.${state}.edit`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.states.${state}.views`)}/>
      </Tabs>
      <Toolbar>
        <button onClick={actions.SHOW_VIEW(`${application}.createWorkflow`)}/>
        <button onClick={/* TODO Удалить */}/>
      </Toolbar>
      {/* TODO Форма редактирования состояния бизнесс-процесса */}
    </>;

    const StateViews = ({application, workflow, state}) => <>
      <Tabs>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.states.${state}`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.states.${state}.edit`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.states.${state}.views`)}/>
      </Tabs>
      <Toolbar>
        <button onClick={actions.SHOW_VIEW(`${application}.createWorkflow`)}/>
        <button onClick={/* TODO Удалить */}/>
      </Toolbar>
      {/* TODO Страница управления представлениями состояния бизнесс-процесса */}
    </>;

    const Transition = ({application, workflow, transition}) => <>
    <Tabs>
      <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.transitions.${transition}`)}/>
      <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.transitions.${transition}.edit`)}/>
    </Tabs>
    <Toolbar>
      <button onClick={actions.SHOW_VIEW(`${application}.createWorkflow`)}/>
      <button onClick={/* TODO Удалить */}/>
    </Toolbar>
    <WorkflowUML application={application} workflow={workflow} transition={transition}/>
    </>;

    const TransitionForm = ({application, workflow, transition}) => <>
    <Tabs>
      <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.transitions.${transition}`)}/>
      <button onClick={actions.SHOW_VIEW(`${application}.workflows.${workflow}.transitions.${transition}.edit`)}/>
    </Tabs>
    <Toolbar>
      <button onClick={actions.SHOW_VIEW(`${application}.createWorkflow`)}/>
      <button onClick={/* TODO Удалить */}/>
    </Toolbar>
    {/* TODO Форма редактирования перехода бизнесс-процесса */}
    </>;
//#endregion

//17. Представления задач
//#region
    const Tasks = application => <>
      <Tabs>
        <button onClick={actions.SHOW_VIEW(`${application}.tasks`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.createTask`)}/>
      </Tabs>
      <Toolbar>
        <button onClick={/*TODO импортировать*/}/>
      </Toolbar>
      {/* TODO Список задач */}
    </>;

    const TaskCreationForm = application => <>
      <Tabs>
        <button onClick={actions.SHOW_VIEW(`${application}.tasks`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.createTask`)}/>
      </Tabs>
      <Toolbar>
        <button onClick={/*TODO импортировать*/}/>
      </Toolbar>
      {/* TODO Форма добавления задачи*/}
    </>;

    const Task = ({application, task}) => <>
      <Tabs>
        <button onClick={actions.SHOW_VIEW(`${application}.tasks.${task}`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.tasks.${task}.edit`)}/>
      </Tabs>
      <Toolbar>
        <button onClick={/*TODO удалить*/}/>
      </Toolbar>
      {/* TODO Список задач c фокусом на задаче */}
    </>;

    const TaskForm = ({application, task}) => <>
      <Tabs>
        <button onClick={actions.SHOW_VIEW(`${application}.tasks.${task}`)}/>
        <button onClick={actions.SHOW_VIEW(`${application}.tasks.${task}.edit`)}/>
      </Tabs>
      <Toolbar>
        <button onClick={/*TODO удалить*/}/>
      </Toolbar>
      {/* TODO Форма редактирования задачи */}
    </>;
//#endregion
