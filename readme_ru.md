<h1 align="center"> <a href="https://www.iondv.com/"><img src="/studio_logo_mini.png" alt="IONDV. Framework" width="600" align="center"></a>
</h1>  

<h4 align="center">JS framework for rapid business application development</h4>
  
<p align="center">
<a href="http://www.apache.org/licenses/LICENSE-2.0"><img src="https://img.shields.io/badge/license-Apache%20License%202.0-blue.svg?style=flat" alt="license" title=""></a>
</p>

<div align="center">
  <h3>
    <a href="https://www.iondv.com/" target="_blank">
      Website
    </a>
    <span> | </span>
    <a href="https://www.iondv.com/portal/get-it" target="_blank">
      Get it Free
    </a>
    <span> | </span>
    <a href="https://github.com/iondv/framework/docs/en/index.md" target="_blank">
      Documentation
    </a>
  </h3>
</div>

<p align="center">
<a href="https://twitter.com/ion_dv" target="_blank"><img src="/twitter.png" height="36px" alt="" title=""></a>
<a href="https://www.facebook.com/iondv/" target="_blank"><img src="/facebook.png" height="36px" margin-left="20px" alt="" title=""></a>
<a href="https://www.linkedin.com/company/iondv/" target="_blank"><img src="/linkedin.png" height="36px" margin-left="20px" alt="" title=""></a>
<a href="https://www.instagram.com/iondv/" target="_blank"><img src="/insta.png" height="36px" margin-left="20px" alt="" title=""></a> 
</p>

# IONDV. Studio

This page on [English](/readme.md)

**Студия** является приложением IONDV. Framework. Она может использоваться как отдельное приложение node.js или как десктоп приложение.

#### Использование IONDV. Framework

* [IONDV. Framework](https://github.com/iondv/framework/)
* [IONDV. Framework Docs](https://github.com/iondv/framework/blob/master/docs/en/index.md)

<h1 align="center"> <a href="https://www.iondv.com/"><img src="/iondv-studio.png" alt="IONDV. Studio" align="center"></a>
</h1> 

## Описание

Приложение **Студия** используется для создания и редактирования метаданных (таких как классы, навигация, представления,
бизнес-процессы, портальные формы) которые могут быть развернуты как веб-приложение IONDV. Framework.

### Как создать приложение в студии?

Смотрите [видео](https://www.youtube.com/watch?v=e201ko9fkQ8&t=331s) о создании простого приложения [IONDV. Nutrition-tickets](https://github.com/iondv/nutrition-tickets) в **IONDV. Studio**. [Инструкция](https://github.com/iondv/nutrition-tickets/blob/master/tutorial/ru/index.md) доступна в репозитории **IONDV. Nutrition-Tickets**.

<a href="https://www.youtube.com/watch?v=e201ko9fkQ8&t=331s" target="_blank"><img src="/tickets_video.png" height="250px" alt="" title=""></a>

Этапы создания приложения: 

1. Нажмите на `+` чтобы приступить к созданию приложения. В всплывающем окне заполняем обязательные поля. Вкладка приложения которое вы создали появляется в левом верхнем углу и управляется по типу браузера.

2. Появляется боковое меню - рабочая панель приложения. Раздел классы нужен для создания классов и атрибутов. 

3. Создание приложения начинается с класса. Нажимаем на класс и в рабочем пространстве наживаем `+Класс`. И в всплывающем окне заполняем обязательные поля. Описание полей можно посмотреть [тут](https://github.com/iondv/framework/blob/master/docs/ru/2_system_description/metadata_structure/meta_class/meta_class_main.md).

4. У нас появился класс и автоматически создался атрибут ID. 

5. Когда класс выделен, можно добавить ему атрибуты, нажав на +атрибут. Описание свойств и типов атрибута можно посмотреть [тут](https://github.com/iondv/framework/blob/master/docs/ru/2_system_description/metadata_structure/meta_class/meta_class_attribute.md).

6. Когда у вас есть минимум 2 класса, можно настроить между ними связи. Это выполняется через настройку типа данных при создании атрибута класса. Основные типы - [Коллекция](https://github.com/iondv/framework/blob/master/docs/ru/2_system_description/metadata_structure/meta_class/atr_itemclass_backcoll.md) и [Ссылка](https://github.com/iondv/framework/blob/master/docs/ru/2_system_description/metadata_structure/meta_class/atr_ref_backref.md). Заданный тип данных у атрибута отразится в рабочей области в виде связующей линии. 

В разделе "Класс" появятся созданные вами классы и их атрибуты. Это называется дерево проекта, по которму будет легко ориентироваться когда классов приложения станет больше. 

Это базовые пункты для создания приложения. 

## Кратко об IONDV. Framework

IONDV. Framework - это опенсорный фреймворк на node.js для разработки учетных приложений 
или микросервисов на основе метаданных и отдельных модулей. Он является частью 
инструментальной цифровой платформы для создания enterprise 
(ERP) приложений состоящей из опенсорсных компонентов: самого [фреймворка](https://github.com/iondv/framework), 
[модулей](https://github.com/topics/iondv-module) и готовых приложений расширяющих его 
функциональность, визуальной среды [Studio](https://github.com/iondv/studio) для 
разработки метаданных приложений.

Подробнее об [IONDV. Framework на сайте](https://iondv.com), документация доступна в [репозитории на github](https://github.com/iondv/framework/blob/master/docs/en/index.md)

Ниже приводится краткое введение в типы метаданных. Пожалуйста, прочтите его, чтобы стать более уверенным в использовании **IONDV. Studio**.

<details>
  <summary> 
    <h3> 
      Метаданные
    </h3> 
  </summary>

[IONDV. Framework](https://iondv.com/) основан на метаданных. Метаданные (Мета) - это комплекс файлов JSON, описывающих набор структур, которые приложение использует для работы. 

### Класс

Нажмите плюс, чтобы создать новый класс, вы увидите новое окно с пятью полями для заполнения. Два из них, отмеченные красной звездочкой, обязательны для заполнения: Название и Заголовок. Другие три поля описывают свойства класса: Родительский класс, Метка времени создания и изменения.

* **Название** - системное имя.
* **Заголовок** - логическое имя отображаемое в пользовательском интерфейсе.
* **Родительский класс** - позволяет создать новый класс на основе родительского класса со всеми его атрибутами. [Подробнее](https://github.com/iondv/framework/blob/master/docs/ru/2_system_description/metadata_structure/meta_class/ancestor.md).
* **Метка времени создания**- позволяет сохранять в классе дату/время создания объекта, требует наличия соответствующего атрибута класса, "name" которого и вносится в данное поле. [Подробнее](https://github.com/iondv/framework/blob/master/docs/ru/2_system_description/metadata_structure/meta_class/time_user_tracker.md).
* **Метка времени изменения** - позволяет сохранять в классе дату/время изменения объекта, требует наличия соответствующего атрибута класса, "name" которого и вносится в данное поле. [Подробнее](https://github.com/iondv/framework/blob/master/docs/ru/2_system_description/metadata_structure/meta_class/time_user_tracker.md).

### Атрибуты 

Click plus to create a new class attribute, and you will see a new window with seven fildes to fill in.
Three of them are mandatory to fill - Name and Caption mean the same as for class.

* **Тип** - указывает тип данных, поддерживаемых атрибутом. [Подробнее](https://github.com/iondv/framework/blob/master/docs/ru/2_system_description/metadata_structure/meta_class/property_types.md).
* **Порядковый номер** - определяет позицию атрибута относительно других атрибутов того же класса.
* **Подсказка** - определяет сообщение, которое появится в пользовательском интерфейсе рядом с именем атрибута.
* **Ссылочный класс** - тип данных, который хранит простое значение и которое интерпретируется системой как ссылка на ключевой атрибут объекта другого класса. [Подробнее](https://github.com/iondv/framework/blob/master/docs/ru/2_system_description/metadata_structure/meta_class/atr_ref_backref.md).
* **Коллекция** - тип данных, позволяющий выводить в объекте списки других объектов. Данные объекты могут быть объектами любого класса включая исходный. [Подробнее](https://github.com/iondv/framework/blob/master/docs/ru/2_system_description/metadata_structure/meta_class/atr_itemclass_backcoll.md).
* **Только для чтения** - разрешает или запрещает изменение значения атрибута.
* **Допустимо пустое значение** - разрешает или запрещает пустое значение атрибута.
* **Уникальный** - является уникальным значением, которое запрещает создание двух объектов класса с одинаковыми значениями.
* **Автоматически присваемый** - разрешает или запрещает автозаполнение полей.

### IONDV. Framework Документация

Документация по платформе IONDV.Framework доступна на двух языках  - русский и english. Полная документация по [ссылке](https://github.com/iondv/framework/blob/master/docs/ru/index.md).
 </details>

### Демо
Для того чтобы начать работу со студией, достаточно перейти по ссылке <a href="https://studio.iondv.com">studio.iondv.com</a>.
Регистрация или учетная запись не требуются. Можно также посмотреть [упрощенную версию](https://iondv.com/portal/index#page-try)
с предзагруженным приложением.

## Использование

Для того чтобы разработать приложение на студии, вам нужно предварительно запустить его, одним из следующих способов:
* Используйте (демо-версию)[https://studio.iondv.com] студии.
* Запустите локально как приложение [IONDV. Framework](https://github.com/iondv/framework), получив исходные коды на 
[github](https://github.com/iondv/studio). После чего собери и разверните его согласно инструкции приложений Framework. 
* Откройте в браузере по ссылке `http://localhost:8888`.
* Запустите локального как отдельное приложение node.js согласно инструкции ниже.
* Запустите как десктоп приложение, согласно инструкции ниже.
* Запустите в docker-конейтнере выполнив `docker run -d -p 8888:8888 --name studio iondv/studio`. 
Откройтейте в браузере по ссылке `http://localhost:8888`.

После этого:
* В Студии разработайте ваше приложение, путем создания классов, навигации.
* Обратите внимание, что данные хранятся в локальном репозитории браузера. Экспортируйте приложение как zip-архив.
* Скачайте последнюю версию IONDV. Framework и модуля IONDV. Registry module: получить их можно c GitHub
[Framework](https://github.com/iondv/framework) и [Registry](https://github.com/iondv/registry) репозиториев.
* Следуйте типовой инструкции развертывания приложения из git, за исключением приложения - вместо приложения разверните 
в папку applictions ваш архив с приложением.
* Далее необходимо собрать и развернуть приложение, согласно инструкции 
[IONDV. Framework](https://github.com/iondv/framework)

### Docker

Запустите в docker-конейтнере выполнив `docker run -d -p 8888:8888 --name studio iondv/studio`. 

Откройтейте в браузере по ссылке `http://localhost:8888`

## Варианты использования Студии
### Отдельное приложение node.js

Преимуществами использования отдельного приложения является отсутствие необходимости в базе данных и в IONDV. Framework.

Выполните команду `git clone https://github.com/iondv/studio.git`. Имените локальную дирректорию на `studio`. 

Выполните команду `npm install` для установки всех необходимых зависимостей, включая локальное приложение сборки `gulp`.
Пожалуйста проверьте, что глобально установлен Gulp версии `4.0`. 

Выполните команду `gulp build` для сборки приложения.

Запустите приложение командой `npm start` или `node www` (`node standalone` для запуска приложения как [standalone](/readme-standalone_ru.md).)

Перейдите в браузере по адресу  `http://localhost:8888`.

### Десктоп приложение Студии (node-webkit)

Перед формированием десктоп приложения Студии, соберите **Отдельное приложение node.js**

#### Запуск новой студии на локальном сервере node-webkit

1. Скачайте последнюю **NORMAL** версию node-webkit c сайта **https://nwjs.io/**.
2. Распакуйте содержимое архива в любую удобную папку.
3. Воспользуйтесь одним из имеющихся способов для того, чтобы соеденить приложение и node-webkit. 
Примеры описаны в статье **https://github.com/nwjs/nw.js/wiki/How-to-package-and-distribute-your-apps** в пунктах **2a** и **2b**.

Более удобным является вариант воспользоваться пакетом **nw-builder**:**https://github.com/nwjs-community/nw-builder**. 
Пример команды: `nwbuild ./studio -p win64 -v 0.34.0 -o ./destination`. Стоит отметить, **nw-builder сам скачает 
необходимую версию node-webkit**.

В результате вы получите ваше приложение в папке с dll, которые использует nwjs. Запустить приложение можно с 
помощью nw.exe файла (название может отличаться).

#### Формирование одного единственного исполняемого файла

1. Скачайте **Enigma virtual box** с сайта **https://enigmaprotector.com/en/downloads.html**, установите и запустите
2. Занесите в первое поле путь к исполняемому файлу вашего приложения. (Можно выбрать)
3. Занесите во второе поле путь сохранения исполняемого файла.
4. Занесите в поле Files *ВСЕ* файлы и папки из директории вашего приложения кроме исполняемого файла .exe.
5. В меню Files options, поставьте галочку на путкте Compress.
6. Нажмите Process и дождитесь результата.

Оригинальная инструкция на английском представлена на сайте 
**https://github.com/nwjs/nw.js/wiki/How-to-package-and-distribute-your-apps** в пункте 
**An alternative way to make an executable file in Windows**

#### Ссылки

* [репозиторий приложения](https://github.com/iondv/studio.git)
* [Node-webkit](https://nwjs.io/)
* [Node-webkit вики](https://github.com/nwjs/nw.js/wiki/How-to-package-and-distribute-your-apps)
* [пакет для формирования исполняемого файла](https://github.com/nwjs-community/nw-builder)
* [программа для линковки dll](https://enigmaprotector.com/en/downloads.html)
* [Руководство пользователя](manuals/RP_studio.docx)
* [Запуск приложения как standalone](/readme-standalone_ru.md)
* [Инструкция по созданию ИС при помощи ION. Studio](https://github.com/iondv/nutrition-tickets/blob/master/tutorial/ru/index.md)

--------------------------------------------------------------------------  


#### [Licence](/LICENSE) &ensp;  [Contact us](https://iondv.com) &ensp;  [English](/README.md)   &ensp; [FAQs](/faqs.md)  
<div><img src="https://mc.iondv.com/watch/github/docs/app/studio" style="position:absolute; left:-9999px;" height=1 width=1 alt="iondv metrics"></div>         

--------------------------------------------------------------------------  

Copyright (c) 2018 **LLC "ION DV"**.  
All rights reserved. 


