/* eslint-disable capitalized-comments */
/* eslint-disable object-curly-newline */
/* eslint-disable array-bracket-newline */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable spaced-comment */
/* eslint-disable no-warning-comments */
/* eslint-disable max-statements-per-line */

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
    * Решить вопрос с стилизацией
    * Решить вопрос с оптимизацией
    * внедрение в приложение новый ejs-шаблон по-умолчанию, точка входа
    * провайдер redux, main-компонент
*/

//2.TODO Разработка хранилища, действий, редюсеров и пр. Решить вопрос локального Хранения.
  const state = {
    applications: {
      [applicationId]: {
        classes: {
          [class1Id]: {
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
          [section1Id]: {
            meta: {/*Мета секции*/},
            nodes: {
              [node1Id]: {
                meta: {/*Мета узла*/},
                nodes: {
                  [node11Id]: {
                    meta: {/*Мета узла*/},
                    views: {
                      [class1Id]: {
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
          [workflow1Id]: {
            meta: {/*Мета бизнесс-процесса (кроме состояний и переходов)*/},
            states: {
              [sate1Id]: {
                meta: {/*Мета состояния*/},
                views: {
                  [class1Id]: {/*Мета представления редактирования*/}
                }
              }
            },
            transitions: {
              [transition1Id]: {/*Мета перехода*/}
            }
          }
        },
        tasks: {//TODO
          [task1.Id]: {/* Конфигурация задания
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
            classes: {[class1Id]: true},
            navgation: {
              [section1Id]: {
                [node1Id]: true
              },
              [section2Id]: true
            },
            workflows: true,
            tasks: false
          }
        },
        activeElement: `${applicationId}.classes.${class1Id}.properties.propertyId`
        //TODO Позиционирование UML тоже нужно хранить в решении.
      }
    },
    currentSolution: solution1.Id,
    solutionsManager: false
  };

  const stateActions = {
    SHOW_SOLUTIONS_MANAGER: 'SHOW_SOLUTIONS_MANAGER', //записать true в state.solutionsManager
    HIDE_SOLUTIONS_MANAGER: 'HIDE_SOLUTIONS_MANAGER', //записать false в state.solutionsManager
    SELECT_SOLUTION: 'SELECT_SOLUTION',               //записать переданное значение в state.currentSolution и false в state.solutionsManager
    CREATE_SOLUTION: 'CREATE_SOLUTION',               //записать переданный объект в state.solutionsManager
    SUBMIT_CREATE_SOLUTION: 'SUBMIT_CREATE_SOLUTION', //Создать на основе переданного объекта в state.solutions новое решение, записать false в state.solutionsManager
    EDIT_SOLUTION: 'EDIT_SOLUTION',                   //Редактировать решение из state.solutions и записать его идентификатор в state.solutionsManager
    REMOVE_SOLUTION: 'REMOVE_SOLUTION',               //Удалить из state.solutions элемент с переданным идентификатором.
                                                      //TODO Как быть c state.currentSolution, если удаляется текущее решение. Тот же вопрос возникает в случае первого запуска, когда state.solutions ещё пуст.
                                                      //какая логика выбора решения по-умолчанию и как реализоавть её без повторения кода.
  };

/*3.TODO Основная сетка:
  <Studio> - растягивается по ширине и высоте
    <Header> - растягивается по ширине, фиксированная высота
      <Logo/> - логотип
      <SelectSolution/> - кнопка, вызывающая действие SHOW_SOLUTIONS_MANAGER
      <AddApplication/> - кнопка, вызывающая действие ?
      <ShowHelp/>       - кнопка, вызывающая действие ?
      <SelectLanguage/> - кнопка, вызывающая действие ?
    </Header>
    <Sidebar/> - растягивается по высоте, фиксированная высота
    <ViewSwitcher/> - растягивается по высоте и ширине, отступая сверху и слева.
    <SolutionsManager/>    - модальное окно с блокировкой фона
    <ApplicationsManager/> - модальное окно с блокировкой фона
    <Help/>                - модальное окно с блокировкой фона
  </Studio>
*/

//4. SolutionManager:
  if (state.solutionsManager === true) {
    /*
    Показать модальное окно со списком решений из state.solutions. В этом списке можно выбрать решение. Так же выводятся кнопки:
      * Создать       - Безусловно доступна. Вызывает действие CREATE_SOLUTION
      * Выбрать       - Доступна, если выбрано решение. Вызывает действие SELECT_SOLUTION
      * Редактировать - Доступна, если выбрано решение. Вызывает действие EDIT_SOLUTION
      * Удалить       - Доступна, если выбрано решение. Вызывает действие REMOVE_SOLUTION
    */
  } else if (typeof state.solutionsManager === object) {
    /*
    Показывать модальное окно с формой создания решения state.solutionsManager
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

/*6.TODO Sidebar: Опиши дерево.Настройки и конфигурации перенести в редактирование приложения
  * Выводит следующую древовидную структуру:
    Узел                                onclick         onDoubleClick
    - state.currentSolution
      - каждое приложение решения
        - узел "Классы"
          - каждый класс приложения
            - каждый аттрибут класса
        -
        
*/

//7.TODO ViewSwitcher:
    switch (path) {
      case '': 'UML-диаграмма всех классов решения';
      //TODO
      default: 'Пустое представление';
    }

//* TODO Разработка представлений
