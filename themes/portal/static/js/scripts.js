"use strict";

$(function () {

  setLanguage();

  var locales = {
    'ru': {
      datepicker: {
        language: 'ru'
      },
      datetimepicker: {
        locale: 'ru',
        format: 'DD.MM.YYYY HH:mm:ss'
      },
      dataTable: {
        "processing": "Подождите...",
        "search": "Поиск:",
        "lengthMenu": "Показать по _MENU_",
        "info": "Записи с _START_ до _END_ из _TOTAL_ записей",
        "infoEmpty": "Записи с 0 до 0 из 0 записей",
        "infoFiltered": "(всего _MAX_)",
        "infoPostFix": "",
        "loadingRecords": "Загрузка записей...",
        "zeroRecords": "Записи отсутствуют.",
        "emptyTable": "В таблице отсутствуют данные",
        "paginate": {
          "first": "<<",
          "previous": "<",
          "next": ">",
          "last": ">>"
        },
        "aria": {
          "sortAscending": ": активировать для сортировки столбца по возрастанию",
          "sortDescending": ": активировать для сортировки столбца по убыванию"
        }
      }
    }
  };
  var language = Helper.L10n.getLanguage();
  var locale = locales[language] || {};

  if ($.fn.datepicker) {
    $.extend($.fn.datepicker.defaults, {
      autoclose: true,
      todayHighlight: true
    }, locale.datepicker);
  }

  if ($.fn.datetimepicker) {
    $.fn.datetimepicker.defaultOpts = $.extend({
      format: 'MM/DD/YYYY HH:mm:ss',
      showClear: true,
      showClose: true,
      ignoreReadonly: true,
      defaultDate: false
    }, locale.datetimepicker);
  }

  if ($.fn.dataTable) {
    $.extend($.fn.dataTable.defaults, {
      paging: true,
      scrollX: true,
      lengthChange: true,
      lengthMenu: [10, 25, 50],
      searching: true,
      ordering: true,
      info: true,
      autoWidth: false,
      language: locale.dataTable
    });
    $.fn.dataTable.ext.errMode = 'none';
  }

  setTimeout(function () {
    createStudio();
  }, 100);

  function createStudio () {
    if (window.Studio) {
      $('.studio-main').each(function () {
        new Studio($(this));
      });
    }
  }

  function setLanguage () {
    var language = navigator.language || navigator.userLanguage;
    switch (location.hash) {
      case '#en': language = 'en'; break;
      case '#ru': language = 'ru'; break;
    }
    Helper.L10n.setLanguage(language);
    var $bar = $('.language-bar');
    $bar.children('[data-language="'+ Helper.L10n.getLanguage() +'"]').hide();
    $bar.show();
  }
});