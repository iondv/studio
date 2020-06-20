"use strict";

window.Helper = {

  generateId: function () {
    return Date.now() +'-'+ Math.round(Math.random() * 99999999);
  },

  getRandom: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  resolveTemplate: function (text, data) {
    return text.replace(/{{(\w+)}}/g, function (match, val) {
      return data.hasOwnProperty(val) ? data[val] : '';
    }).trim();
  },

  updateTemplate: function (id, $template, data) {
    Object.keys(data).forEach(function (key) {
      $template.find('[data-'+ id +'="'+ key +'"]').html(data[key]);
      const dataKey = id +'-'+ key;
      const $item = $template.find('[data-'+ dataKey +']');
      if ($item.length) {
        $item.attr($item.data(dataKey), data[key]);
      }
    });
  },

  getBaseName: function (name) {
    const pos = name.lastIndexOf('.');
    return pos !== -1 ? name.substring(0, pos) : name;
  },

  resetFormElement: function ($elem) {
    $elem.wrap('<form>').closest('form').get(0).reset();
    $elem.unwrap();
  },

  scrollToElement: function ($item, duration, complete) {
    Helper.scrollToPos($item.offset().top, duration, complete);
  },

  scrollToPos: function (pos, duration, complete) {
    duration = duration || 700;
    $('html,body').animate({scrollTop: pos}, {duration}, complete);
  },

  select2: function ($select, params) {
    $select.select2($.extend({
      'language': Helper.L10n.getLanguage(),
      'width': '100%',
      'allowClear': true,
      'placeholder': ''
    }, params));
  },

  parseNestedJson: function (data) {
    for (let key of Object.keys(data)) {
      if (typeof data[key] === 'string') {
        data[key] = Helper.parseJson(data[key]);
      } else if (data[key]) {
        Helper.parseNestedJson(data[key]);
      }
    }
  },

  parseJson: function (value) {
    if (typeof value !== 'string' || value === '') {
       return value;
    }
    try {
      return JSON.parse(value);
    } catch (err) {}
  },

  stringifyJson: function (value, spacer) {
    return typeof value === 'string' ? value : JSON.stringify(value, null, spacer);
  },

  stringifyBoolean: function (value) {
    return value === true ? 'true' : value === false ? 'false' : value;
  },

  stringifyEmpty: function (value) {
    return value === undefined || value === null ? '' : value;
  },

  confirm: function ($item) {
    var message = $item.data('confirmMessage');
    return !message || confirm(message);
  },

  isValidDate: function (date) {
    return date ? !isNaN((date instanceof Date ? date : new Date(date)).getTime()) : false;
  },

  matchAsStrings: function (a, b) {
    return Helper.stringifyJson(a) === Helper.stringifyJson(b);
  },

  createStaticUrl: function (url) {
    return document.body.dataset.static + url;
  },

  camelize: function (text) {
    text = text.replace(/[\- ]+/g, '');
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
};

// ARRAY

Helper.Array = {

  pushNotEmpty: function (items) {
    for (var i = 1; i < arguments.length; ++i) {
      var value = arguments[i];
      if (value !== null && value !== undefined && value !== '') {
        items.push(value);
      }
    }
    return items;
  },

  mapNotEmpty: function (items, handler) {
    var result = [];
    for (var i = 0; i < items.length; ++i) {
      Helper.Array.pushNotEmpty(result, handler(items[i]));
    }
    return result;
  },

  removeValue: function (value, values) {
    value = values.indexOf(value);
    if (value === -1) {
      return false;
    }
    values.splice(value, 1);
    return true;
  },

  searchByValue: function (value, key, items) {
    if (items instanceof Array) {
      for (var i = 0; i < items.length; ++i) {
        if (items[i] && items[i][key] === value) {
          return i;
        }
      }
    }
    return -1;
  },

  searchByNestedValue: function (value, key, items) {
    if (items instanceof Array) {
      for (var i = 0; i < items.length; ++i) {
        if (Helper.Object.getNestedValue(key, items[i]) === value) {
          return i;
        }
      }
    }
    return -1;
  },

  indexByKey: function (key, items, removeKeyProp) {
    var map = {};
    if (items instanceof Array) {
      for (var i = 0; i < items.length; ++i) {
        if (items[i] && items[i][key]) {
          map[items[i][key]] = items[i];
          if (removeKeyProp) {
            delete items[i][key];
          }
        }
      }
    }
    return map;
  },

  eachMethod: function () {
    return Helper.Array.execMethod.apply(this, ['forEach'].concat(Array.prototype.slice.call(arguments)));
  },

  mapMethod: function () {
    return Helper.Array.execMethod.apply(this, ['map'].concat(Array.prototype.slice.call(arguments)));
  },

  filterMethod: function () {
    return Helper.Array.execMethod.apply(this, ['filter'].concat(Array.prototype.slice.call(arguments)));
  },

  execMethod: function (action, methodName, models) {
    if (!(models instanceof Array)) {
      return [];
    }
    var params = Array.prototype.slice.call(arguments, 3);
    return models[action](function (model) {
      return model[methodName].apply(model, params);
    });
  }
};

// OBJECT

Helper.Object = {

  diff: function (d1, d2) {
    return Object.keys(Object.assign({}, d1, d2)).filter(function (key) {
      return Helper.stringifyJson(d1[key]) !== Helper.stringifyJson(d2[key]);
    });
  },

  intersectByKeys: function (data, keys) {
    var result = {};
    if (data && keys instanceof Array) {
      keys.forEach(function (key) {
        if (data.hasOwnProperty(key)) {
          result[key] = data[key];
        }
      });
    }
    return result;
  },

  getNestedValue: function (key, data, defaults) {
    if (!data || typeof key !== 'string') {
      return defaults;
    }
    if (data.hasOwnProperty(key)) {
      return data[key];
    }
    var pos = key.indexOf('.');
    if (pos > 0) {
      var destKey = key.substring(0, pos);
      if (data.hasOwnProperty(destKey)) {
        key = key.substring(pos + 1);
        if (data[destKey]) {
          return this.getNestedValue(key, data[destKey], defaults);
        }
      }
    }
    return defaults;
  },

  setNestedValue: function (key, data, value) {
    var index = key.indexOf('.');
    if (index === -1) {
      return data[key] = value;
    }
    var part = key.substring(0, index);
    if (!(data[part] instanceof Object)) {
      data[part] = {};
    }
    Helper.Object.setNestedValue(key.substring(index + 1), data[part], value);
  },

  assignProperties: function (keys, target, source) {
    for (var key of keys) {
      target[key] = source[key];
    }
  },

  assignUndefinedProperties: function (map, target) {
    for (var key in map) {
      if (map.hasOwnProperty(key) && !target.hasOwnProperty(key)) {
        target[key] = map[key];
      }
    }
  },

  getValuesWithKey: function (keyProp, map) {
    var items = [];
    if (map) {
      for (var key of Object.keys(map)) {
        if (map[key]) {
          map[key][keyProp] = key;
          items.push(map[key]);
        }
      }
    }
    return items;
  },

  sortByKeys: function (keys, data) {
    var result = {};
    if (data) {
      for (var key of keys) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          result[key] = data[key];
        }
      }
    }
    return Object.assign(result, data);
  }
};

// EVENTS

Helper.Events = function (prefix) {
  this.prefix = prefix;
  this.$target = $('<div></div>');
};

$.extend(Helper.Events.prototype, {

  on: function (name, handler) {
    this.$target.on(this.getName(name), handler);
  },

  one: function (name, handler) {
    this.$target.one(this.getName(name), handler);
  },

  off: function (name, handler) {
    this.$target.off(this.getName(name), handler);
  },

  trigger: function (name, data) {
    this.$target.trigger(this.getName(name), data);
  },

  getName: function (name) {
    return this.prefix + name;
  }
});

// LOCALIZATION

Helper.L10n = {

  messages: {
    ru: {}
  },

  getLanguage: function () {
    return Helper.L10n.language || 'en';
  },

  setLanguage: function (language) {
    if (typeof language === 'string') {
      language = language.split('-')[0];
      var map = this.getLanguageMap(language);
      if (map) {
        Helper.L10n.language = language;
        Helper.L10n.translateAll(map);
      }
    }
  },

  getLanguageMap: function (language) {
    language = language || Helper.L10n.language;
    return Helper.L10n.messages[language];
  },

  getMessageMap: function (category, language) {
    var map = Helper.L10n.getLanguageMap(language);
    return map && map[category || 'default'];
  },

  translate: function (message, category) {
    var map = Helper.L10n.getMessageMap(category);
    if (map && map.hasOwnProperty(message)) {
      return map[message];
    }
    return message;
  },

  translateAll: function (map) {
    this.translateContainer($(document.body), map);
  },

  translateContainer: function ($container, map) {
    map = map || this.getLanguageMap();
    $container.find('.l10n').each(function () {
      Helper.L10n.translateInner(this, map);
    });
    const attrs = [
      'title',
      'placeholder',
      'data-placeholder',
      'data-confirm-message',
      'data-select-message'
    ];
    for (let i = 0; i < attrs.length; ++i) {
      $container.find('['+ attrs[i] +']').each(function () {
        Helper.L10n.translateAttr(attrs[i], this, map);
      });
    }
  },

  translateInner: function (element, map) {
    if (map) {
      map = map[element.dataset.l10n || 'default'];
      if (map && map.hasOwnProperty(element.innerHTML)) {
        element.innerHTML = map[element.innerHTML];
      }
    }
  },

  translateAttr: function (attr, element, map) {
    if (map) {
      map = map[element.dataset.l10n || 'default'];
      if (map && map.hasOwnProperty(element.getAttribute(attr))) {
        element.setAttribute(attr, map[element.getAttribute(attr)]);
      }
    }
  }
};

// HTML

Helper.Html = {

  createSelectItems: function (data) {
    data = $.extend({
      hasEmpty: true,
      items: []
    }, data);
    var result = data.hasEmpty ? '<option></option>' : '';
    data.items.forEach(function (item) {
      result += '<option value="'+ item.value +'" title="'
        + (item.title === undefined ? '' : item.title)
        + '">'+ item.text +'</option>';
    });
    return result;
  },

  getSelectOptionMap: function ($select) {
    var data = {};
    $select.children().each(function () {
      data[this.getAttribute('value')] = this.innerHTML;
    });
    return data;
  }
};

// FILE

Helper.File = {

  get: function (id) {
    return store.get(this.getStoreId(id));
  },

  store: function (id, name, size, content) {
    store.set(this.getStoreId(id), {
      'name': name,
      'size': size,
      'content': content
    });
  },

  remove: function (id) {
    store.remove(this.getStoreId(id));
  },

  sync: function (map) {
    const prefix = Helper.File.getStoreId('');
    const unusedKeys = [];
    store.each(function (value, key) {
      if (key.indexOf(prefix) === 0 && !map.hasOwnProperty(key.substring(prefix.length))) {
        unusedKeys.push(key);
      }
    });
    unusedKeys.forEach(function (key) {
      store.remove(key);
    });
  },

  getStoreId: function (id) {
    return 'Studio.FileStore.'+ id;
  },

  getDataUrl: function (file, cb) {
    var reader = new FileReader;
    reader.onload = function () {
      cb(null, reader.result);
    };
    reader.onerror = cb;
    reader.readAsDataURL(file);
  },

  getBlob: function (data) {
    try {
      var parts = data.split(',');
      var byteString = atob(parts[1]);
      var mime = parts[0].split(':')[1].split(';')[0];
      var buffer = new ArrayBuffer(byteString.length);
      var view = new Uint8Array(buffer);
      for (var i = 0; i < byteString.length; ++i) {
        view[i] = byteString.charCodeAt(i);
      }
      return new Blob([buffer], {
        type: mime
      });
    } catch (err) {
      console.error(err);
    }
  },

  formatSize: function (size) {
    if (typeof size !== 'number') {
      return size;
    }
    if (size > 1048576) {
      return parseInt(size / 1048576) + ' Mb';
    }
    if (size > 1024) {
      return parseInt(size / 1024) + ' Kb';
    }
    return size + ' B';
  }
};

// FORMAT

Helper.Format = {

  boolean: function (value) {
    return Helper.L10n.translate(value ? 'Yes' : 'No');
  },

  json: function (value, trimLength) {
    value = typeof value !== 'string' ? JSON.stringify(value) : value;
    value = value === undefined ? '' : value;
    trimLength = 100;
    if (value.length > trimLength) {
      value = value.substring(0, trimLength) + '...';
    }
    return value;
  },

  timestamp: function (value) {
    return value ? moment(value).format(Helper.L10n.translate('YYYY-MM-DD HH:mm:ss')) : '';
  }
};

// DATATABLE

Helper.DataTable = {

  formatTimestamp: function (data, type, col) {
    return data && type === 'display' ? Helper.Format.timestamp(data) : data;
  },

  formatJson: function (data, type, col) {
    return data ? Helper.Format.json(data) : data;
  }
};

// SEMVER

Helper.Semver = {

  addByType: function (type, value) {
    var index = type === 'major' ? 0 : type === 'minor' ? 1 : 2;
    return Helper.Semver.addByIndex(index, value);
  },

  addByIndex: function (index, value) {
    var nums = Helper.Semver.parse(value);
    nums[index] = nums[index] + 1;
    return nums.join('.');
  },

  isValid: function (value) {
    return /^[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}$/.test(value);
  },

  parse: function (value) {
    return Helper.Semver.isValid(value)
      ? value.split('.').map(function (num) {
        return parseInt(num);
      })
      : [0,0,0];
  }
};