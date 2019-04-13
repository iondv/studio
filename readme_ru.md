This page on [English](/readme.md)

# IONDV. Studio

Студия является приложением IONDV. Framework

Также она может использоваться как отдельное приложение node.js или как десктоп приложение.

#### Использование IONDV. Framework

* [IONDV. Framework](https://github.com/iondv/framework/)
* [IONDV. Framework Docs](https://github.com/iondv/framework/blob/master/docs/en/index.md)

## Описакние

Приложение **Студия** используется для создания и редактирования метаданных (таких как классы, навигация, представления,
бизнес-процессы, портальные формы) которые могут быть развернуты как веб-приложение IONDV. Framework

### Демо
Для того чтобы начать работу со студией, достаточно перейти по ссылке <a href="https://studio.iondv.com">studio.iondv.com</a>.
Регистрация или учетная запись не требуются. Можно также посмотреть [упрощенную версию](https://iondv.com/portal/index#page-try)
с предзагруженным приложением.

## Использование

Для того чтобы разработать приложение на студии, вам нужно предварительно запустить его, одним из следующих способов:
* Go to https://studio.iondv.com and use.
* Запустите локально как приложение [IONDV. Framework](https://github.com/iondv/framework), получив исходные коды на 
[github](https://github.com/iondv/studio). После чего собери и разверните его согласно инструкции приложений Framework. 
Откройтейте в браузере по ссылке `http://localhost:8888`
* Запустите локального как отдельное приложение node.js согласно инструкции ниже
* Запустите как десктоп приложение, согласно инструкции ниже.
* Запустите в docker-конейтнере выполнив `docker run -d -p 8888:8888 --name studio iondv/studio`. 
Откройтейте в браузере по ссылке `http://localhost:8888`

После этого:
* В Студии разработайте ваше приложение, путем создания классов, навигации.
* Обратите внимание, что данные хранятся в локальном репозитории браузера. Экспортируйте приложение как zip-архив.
* Скачайте последнюю версию IONDV. Framework и модуля IONDV. Registry module: получить их можно c GitHub
[Framework](https://github.com/iondv/framework) и [Registry](https://github.com/iondv/registry) repositories.
* Следуйте типовой инструкции развертывания приложения из git, за исключением приложения - вместо приложения разверните 
в папку applictions ваш архив с приложением.
* Далее необходимо собрать и развернуть приложение, согласно инструкции 
[IONDV. Framework](https://github.com/iondv/framework)


## Варианты использования Студии
### Отдельное приложение node.js

Преимуществами использования отдельного приложения является отсутствие необходимости в базе данных и в IONDV. Framework.

Выполните команду `git clone https://github.com/iondv/studio.git`. Имените локальную дирректорию на `studio`. 

Выполните команду `npm install` для установки всех необходимых зависимостей, включая локальное приложение сборки `gulp`.
Пожалуйста проверьте, что глобально установлен Gulp версии `4.0`. 

Выполните команду `gulp build` для сборки приложения.

Запустите приложение командой `npm start` или `node www`. 

Перейдите в браузере по адресу  `http://localhost:8888`.

### Десктоп приложение Студии на node-webkit

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
помощью nw.exe файла (название может отличаться)

#### Формирование одного единственного исполняемого файла

1. Скачайте **Enigma virtual box** с сайта **https://enigmaprotector.com/en/downloads.html**, установите и запустите
2. Занесите в первое поле путь к исполняемому файлу вашего приложения. (Можно выбрать)
3. Занесите во второе поле путь сохранения исполняемого файла.
4. Занесите в поле Files *ВСЕ* файлы и папки из директории вашего приложения кроме исполняемого файла .exe.
5. В меню Files options.. поставьте галочку на путкте Compress...
6. Нажмите Process и дождитесь результата.

Оригинальная инструкция на английском представлена на сайте 
**https://github.com/nwjs/nw.js/wiki/How-to-package-and-distribute-your-apps** в пункте 
**An alternative way to make an executable file in Windows**

#### Ссылки

* https://github.com/iondv/studio - репозиторий приложения
* https://nwjs.io/ - сайт node-webkit
* https://github.com/nwjs/nw.js/wiki/How-to-package-and-distribute-your-apps - вики node-webkit
* https://github.com/nwjs-community/nw-builder - пакет для формирования исполняемого файла
* https://enigmaprotector.com/en/downloads.html - программа для линковки dll



--------------------------------------------------------------------------  


#### [Licence](/LICENSE) &ensp;  [Contact us](https://iondv.com) &ensp;  [English](/readme.md)   &ensp; [FAQs](/faqs.md)  
<div><img src="https://mc.iondv.com/watch/github/docs/app/studio" style="position:absolute; left:-9999px;" height=1 width=1 alt="iondv metrics"></div>         

--------------------------------------------------------------------------  

Copyright (c) 2018 **LLC "ION DV"**.  
All rights reserved. 


