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
    solutionsManager: false
  };

  const actions = {
    SHOW_SOLUTIONS_MANAGER: 'SHOW_SOLUTIONS_MANAGER', //записать true в state.solutionsManager
    HIDE_SOLUTIONS_MANAGER: 'HIDE_SOLUTIONS_MANAGER', //записать false в state.solutionsManager
    SELECT_SOLUTION: 'SELECT_SOLUTION',               //записать переданное значение в state.currentSolution и false в state.solutionsManager
    CREATE_SOLUTION: 'CREATE_SOLUTION',               //записать переданный объект в state.solutionsManager
    SUBMIT_CREATE_SOLUTION: 'SUBMIT_CREATE_SOLUTION', //Создать на основе переданного объекта в state.solutions новое решение, записать false в state.solutionsManager
    EDIT_SOLUTION: 'EDIT_SOLUTION',                   //Редактировать решение из state.solutions и записать его идентификатор в state.solutionsManager
    REMOVE_SOLUTION: 'REMOVE_SOLUTION',               //Удалить из state.solutions элемент с переданным идентификатором.
    //TODO Как быть c state.currentSolution, если удаляется текущее решение. Тот же вопрос возникает в случае первого запуска, когда state.solutions ещё пуст.
    //какая логика выбора решения по-умолчанию и как реализоавть её без повторения кода.

    SHOW_VIEW: 'SHOW_VIEW',                     //заптисать в текущее решение в activeElement переданный путь.
    TOGGLE_SIDEBAR_NODE: 'TOGGLE_SIDEBAR_NODE', //по переданному пути записать переданное значение в solutions.expandedElements
  };

//3.TODO Основная сетка:
  const studio = <>     {/* корневой контейнер растягивается по ширине и высоте */}
    <Header>            {/* заголовок, растягивается по ширине, фиксированная высота */}
      <Logo/>           {/* логотип */}
      <SelectSolution/> {/* кнопка, вызывающая действие SHOW_SOLUTIONS_MANAGER */}
      <AddApplication/> {/* кнопка, вызывающая действие ?TODO */}
      <ShowHelp/>       {/* кнопка, вызывающая действие ?TODO */}
      <SelectLanguage/> {/* кнопка, вызывающая действие ?TODO */}
    </Header>
    <Sidebar/>              {/* растягивается по высоте, фиксированная высота */}
    <ViewSwitcher/>         {/* растягивается по высоте и ширине, отступая сверху и слева. */}
    <SolutionsManager/>     {/* модальное окно с блокировкой фона */}
    <ApplicationsManager/>  {/* модальное окно с блокировкой фона */}
    <Help/>                 {/* модальное окно с блокировкой фона */}
  </>;

//4. SolutionManager:
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
      * Редактирование формы вызывает действие EDIT_SOLUTION
      * Закрытие формы вызывает действие HIDE_SOLUTIONS_MANAGER
    */
  } else {
    //Не показывать ничего
  }
  
/*5.TODO ApplicationsManager:
  * Import External Application
  * Upload Application
  * Create New Application
  * Remove Application
*/

//6. Sidebar:
  //Компонент sidebarNode отвечает за отображение узла в соответствии с solution.expandedElements и solution.activeElement
  //Так же он отвечает за поведения открытия/закрытия узла с использованием действия TOGGLE_SIDEBAR_NODE
  //Специфичные для разных узлов стили оформления задаются на уровне сайдбара
  const Sidebar = <ul>
    <SidebarNode caption="ТЕКУЩЕЕ РЕШЕНИЕ"
                  onClick=      {actions.SHOW_VIEW()}
                  onDoubleClick={actions.SHOW_VIEW() + actions.EDIT_SOLUTION(state.currentSolution)}
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
            <ul><SidebarNode caption="КАЖДАЯ ЗАДАЧА ПРИЛОЖЕНИЯ"taskId
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
  </ul>

//7.TODO ViewSwitcher:
    switch (state.solutions[state.currentSolution].activeElement) {
      //TODO
      case '': break;
      case applicationId: break;
      case `${applicationId}.edit`: break;
      case `${applicationId}.classes`: break;
      case `${applicationId}.classes.${classId}`: break;
      case `${applicationId}.classes.${classId}.edit`: break;
      case `${applicationId}.classes.${classId}.properties.${propertyId}`: break;
      case `${applicationId}.classes.${classId}.properties.${propertyId}.edit`: break;
      case `${applicationId}.navgation`: break;
      case `${applicationId}.navgation.${sectionId}`: break;
      case `${applicationId}.navgation.${sectionId}.edit`: break;
      case `${applicationId}.navgation.${sectionId}.nodes.${nodeId}`: break;
      case `${applicationId}.navgation.${sectionId}.nodes.${nodeId}.edit`: break;
      {/* На произвольную глубину вложенности */}
      case `${applicationId}.navgation.${sectionId}.nodes.${nodeId}.nodes.${nestedNodeId}`: break;
      case `${applicationId}.navgation.${sectionId}.nodes.${nodeId}.nodes.${nestedNodeId}.edit`: break;
      case `${applicationId}.workflows`: break;
      case `${applicationId}.workflows.${workflowId}`: break;
      case `${applicationId}.workflows.${workflowId}.edit`: break;
      case `${applicationId}.workflows.${workflowId}.states.${stateId}`: break;
      case `${applicationId}.workflows.${workflowId}.states.${stateId}.edit`: break;
      case `${applicationId}.workflows.${workflowId}.transitions.${transitionId}`: break;
      case `${applicationId}.workflows.${workflowId}.transitions.${transitionId}.edit`: break;
      case `${applicationId}.tasks`: break;
      case `${applicationId}.tasks.${taskId}`: break;
      case `${applicationId}.tasks.${taskId}.edit`: break;
      default: break;
    }

//* TODO Разработка представлений
