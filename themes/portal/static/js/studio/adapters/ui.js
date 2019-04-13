"use strict";

//Edin in IONSTUDIO-198

Studio.InterfaceAdapter = function ($container, studio) {
  this.studio = studio;
  this.menu = studio.menu;
  this.$container = $container;
  this.createEditor();
};

$.extend(Studio.InterfaceAdapter.prototype, {

  initListeners: function () {
    this.studio.events.on('changeContentMode', this.onChangeContentMode.bind(this));
    this.studio.events.on('changeActiveItem', this.onChangeActiveItem.bind(this));
  },

  toggleActive: function (state) {
    this.$container.toggleClass('active', state);
  },

  onChangeContentMode: function (event, mode) {
    this.$container.toggle(mode === 'interface');
  },

  onChangeActiveItem: function (event) {
    this.interface = this.studio.menu.getActiveInterface();
    this.editor.runCommand('core:canvas-clear');
    // this.editor.DomComponents.clear();
    if (this.interface) {
      this.toggleActive(true);
      this.editor.load();
    } else {
      this.toggleActive(false);
    }
  },

  loadData: function (keys, cb, err) {
    if (!this.interface) {
      return err('Invalid interface');
    }
    cb(this.interface.getEditorData());
  },

  storeData: function (data, cb, err) {
    if (!this.interface) {
      return err('Invalid interface');
    }
    this.interface.setEditorData(data);
    this.studio.store.save();
    cb();
  },

  // EDITOR

  createEditor: function () {
    var language = Helper.L10n.getLanguage();
    this.locale = Studio.InterfaceAdapter.locales[language] || Studio.InterfaceAdapter.locales.en;
    this.locale.pluginsOpts['grapesjs-studio'].studio = this.studio;
    this.$editor = this.$container.find('#gjs');
    this.editor = grapesjs.init($.extend(this.$container.data('options'), {
      'pluginsOpts': this.locale.pluginsOpts
    }));
    this.createEditorTooltips();
    this.editor.StorageManager.add('studio', {
      'load': this.loadData.bind(this),
      'store': this.storeData.bind(this)
    });
    //editor.runCommand('gjs-export-zip');
    this.editor.runCommand('sw-visibility');
    this.collapseEditorCategories();
    this.editor.on('load', this.onLoadEditor.bind(this));
  },

  createEditorTooltips: function () {
    this.locale.tooltips.options.forEach(this.createEditorTooltip.bind(this, 'options'));
    this.locale.tooltips.views.forEach(this.createEditorTooltip.bind(this, 'views'));
  },

  createEditorTooltip: function (type, item) {
    this.editor.Panels.getButton(type, item[0]).set('attributes', {
      'title': item[1]
    });
  },

  collapseEditorCategories: function () {
    var categories = this.editor.BlockManager.getCategories();
    categories.each(function (category) {
      category.set('open', false).on('change:open', function (opened) {
        opened.get('open') && categories.each(function (category) {
          category !== opened && category.set('open', false);
        });
      });
    });
  },

  onLoadEditor: function () {
    var bm = this.editor.BlockManager;
  },
});

Studio.InterfaceAdapter.locales = {
  en: {
    'pluginsOpts': {
      'grapesjs-studio': {
        category: 'Metadata blocks',
        treeMenu: {},
        listSearch: {},
        objectList: {},
        objectForm: {}
      }
    },
    'tooltips': {
      options: [
        ['sw-visibility', 'Show borders'],
        ['preview', 'Preview'],
        ['fullscreen', 'Fullscreen'],
        ['export-template', 'Export'],
        ['undo', 'Undo'],
        ['redo', 'Redo'],
        ['gjs-open-import-webpage', 'Import'],
        ['canvas-clear', 'Clear canvas']
      ],
      views: [
        ['open-sm', 'Style manager'],
        ['open-layers', 'Layers'],
        ['open-blocks', 'Blocks']
      ]
    }
  },
  ru: {
    'pluginsOpts': {
      'gjs-preset-webpage': {
        'modalImportTitle': 'Импорт',
        'modalImportButton': 'Импорт',
        'modalImportLabel': 'Импорт кода',
        'textCleanCanvas': 'Вы уверены, что хотите очистить созданный интерфейс',
        'textGeneral': 'Основные',
        'textLayout': 'Расположение',
        'textTypography': 'Шрифты',
        'textDecorations': 'Оформление',
        'textExtra': 'Дополнительно',
        'blocksBasicOpts': {
          "blocks": [
            'column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video'
          ],
          "category": 'Базовые',
          'labelColumn1': '1 столбец',
          'labelColumn2': '2 столбца',
          'labelColumn3': '3 столбца',
          'labelColumn37': '2 столбца 3/7',
          'labelText': 'Текст',
          'labelLink': 'Ссылка',
          'labelImage': 'Изображение',
          'labelVideo': 'Видео',
          'labelMap': 'Карта'
        },
        'formsOpts': {
          'category': 'Формa',
          'blocks': ['form', 'input', 'textarea', 'select', 'button', 'label', 'checkbox'],
          'labelTraitMethod': 'Метод',
          'labelTraitAction': 'Действие',
          'labelTraitState': 'Статус',
          'labelTraitId': 'Идентификатор',
          'labelTraitFor': 'For',
          'labelInputName': 'Поле ввода',
          'labelTextareaName': 'Текстовое поле',
          'labelSelectName': 'Выбор',
          'labelCheckboxName': 'Чекбокс',
          'labelRadioName': 'Радио',
          'labelButtonName': 'Кнопка',
          'labelTraitName': 'Название',
          'labelTraitPlaceholder': 'Место',
          'labelTraitValue': 'Значение',
          'labelTraitRequired': 'Обязательно',
          'labelTraitType': 'Тип',
          'labelTraitOptions': 'Параметры',
          'labelTraitChecked': 'Выбрано',
          'labelTypeText': 'Текст',
          'labelTypeEmail': 'эл.почта',
          'labelTypePassword': 'Пароль',
          'labelTypeNumber': 'Число',
          'labelTypeSubmit': 'Отправить',
          'labelTypeReset': 'Сбросить',
          'labelTypeButton': 'Тип кнопки',
          'labelNameLabel': 'Метка',
          'labelForm': 'Форма',
          'labelSelectOption': '- Выпадающий список -',
          'labelOption': 'Опция'
        },
        'countdownOpts': false,
        'exportOpts': {
          'btnLabel': 'Экспорт в ZIP',
          'filenamePfx': 'RAD_constructor_'
        },
        'navbarOpts': {
          'labelNavbar': 'Навигация',
          'labelNavbarContainer': 'Контейнер навигации',
          'labelMenu': 'Меню навигации',
          'labelMenuLink': 'Ссылка на меню',
          'labelBurger': 'Burger',
          'labelBurgerLine': 'Burger Line',
          'labelNavbarBlock': 'Навигация',
          'labelNavbarCategory': 'Расширения',
          'labelHome': 'Домой',
          'labelAbout': 'Описание',
          'labelContact': 'Обратная связь'
        }
      },
      //'gjs-blocks-basic': {"blocks": ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video']/* ...options */},
      //'grapesjs-plugin-forms': {"blocks": ['form', 'input', 'textarea', 'select', 'button', 'label']/* ...options */},
      //'grapesjs-plugin-export': { /* options */ },
      //'gjs-navbar': {/* ...options */},
      'grapesjs-tabs': {
        tabsBlock: {
          category: 'Расширения',
          label: 'Вкладки',
          attributes: {
            'class': 'fa fa-ellipsis-h'
          }
        }
      },
      'grapesjs-lory-slider': {
        'sliderBlock': {
          category: 'Расширения',
          label: 'Слайдер',
          attributes: {
            'class': 'fa fa-sliders'
          }
        },
        'sliderProps': {
          name: 'Слайдер'
        }
      },
      'grapesjs-custom-code': {
        'placeholderContent': 'Вставьте сюда свой код',
        'modalTitle': 'Вставьте код',
        'buttonLabel': 'Сохранить',
        'blockCustomCode': {
          'label': 'Вставить код',
          'attributes': {
            'class': 'fa fa-code'
          },
          'category': 'Расширения'
        }
      },
      'grapesjs-studio': {
        category: 'Блоки метаданных',
        treeMenu: {
          block: {
            'label': 'Боковое меню',
            'attributes': {
              'title': '',
              'class': 'fa fa-ellipsis-v'
            }
          }
        },
        listSearch: {
          block: {
            'label': 'Поиск',
            'attributes': {
              'title': 'Поиск в списке',
              'class': 'fa fa-search'
            }
          }
        },
        objectList: {
          block: {
            'label': 'Список',
            'attributes': {
              'title': 'Список объектов',
              'class': 'fa fa-list'
            }
          }
        },
        objectForm: {
          block: {
            'label': 'Форма',
            'attributes': {
              'title': 'Форма объекта',
              'class': 'fa fa-edit',
            }
          }
        }
      }
    },
    'tooltips': {
      options: [
        ['sw-visibility', 'Показать границы'],
        ['preview', 'Предпросмотр'],
        ['fullscreen', 'Полный экран'],
        ['export-template', 'Экспорт'],
        ['undo', 'Отменить действие'],
        ['redo', 'Повторить действие'],
        ['gjs-open-import-webpage', 'Импорт'],
        ['canvas-clear', 'Очистить']
      ],
      views: [
        ['open-sm', 'Менеджер стилей'],
        ['open-layers', 'Слои'],
        ['open-blocks', 'Блоки']
      ]
    }
  }
}