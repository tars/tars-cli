<p align="right">
English description | <a href="../ru/update-actions.md">Описание на русском</a>
</p>

# TARS update in current project

An automatic update is available in TARS-CLI from version 1.6.0 via [tars update-project](commands.md#tars-update-project).

## Steps of updating process

* Some checks, that upate is available. Your project won't be updated in case you have the lates version of TARS already. You can update your project fom version 1.5.0
* The latest available version is downloaded. If you have used flag -s (--source), TARS will be downloaded from url, which was after that flag. Also, all file for tempalter and preprocessor is downloaded. But you can prevent it by using flags --exclude-html and --exclude-css.
* Backup of current version of your project is created.
* All config files update (tars.js, .eslintrc, .babelrc, tars-config.js and package.json) All configs just get new properties, without changing already set properties. All packages from user-package.json from current project and new version will merge into package.json. So, if you use your own version of TARS and want to udpate npm-packges during update, just add all packges, that you need into user-package.json in your fork. There will be warning, if there is no any user-package.json file. It's just warning, not an error.
* Update of all system tasks, watchers, tars/tars.js. TARS-CLI will remove all system task and watchers from current project and copy new files from new one.
* If flag --exclude-css is not used, static/{scss,stylus,less}/sprite-generator-templates update is started. 
* All files from new project separate-js to current project.
* If flag --exclude-html is not used, templates update is started.
* gulpfile.js update. Just replace old file with new gulpfile.js
* Documentation update.
* Installing of new npm-packages.
* All user's actions from custom-update-actions.json executed, if that file is exists. You can get more info about it in [documentation](custom-update-actions.md).
* Deletion of all temp files.
* Success log.

All actions will be executed synchronously to prevent problems during update.

If something gone wrong during update, please, mail to tars.builder@gmail.com Do not forget to add error text and stack trace, it would be really useful.
