<p align="right">
English description | <a href="../en/custom-update-actions.md">Описание на русском</a>
</p>

# User's action for project update

You might need some more options during update process from your own fork of TARS. You can do all thing by your hands, but TARS can help you in that case.

You have to create custom-update-actions.json in root directory of your fork to use custom actions during update. You have to discribe all actions there.

In general, this file looks like (json syntax):

```js
{
    "remove": [
        "path to file or folder to remove",
        ...
    ],

    "copy": [
        {
            "from": "path to file or folder to copy from",
            "to": "path to file or folder to copy to"
        },
        ...
    ],

    "rename": [
        {
            "from": "path to file or folder to rename",
            "to": "path to file or folder with new name"
        },
        ...
    ]
}
```

You have to use relative path to current directory. **You should not use absolute path!** For example, if you want to delete all pages (pages folder) from markup in current project, you sholud write:

```js
{
    "remove": [
        // This path will revealed into (example for OSX):
        // Users/%username%/project/%projectName%/markup/pages
        // Will remove folder pages in current project
        "/markup/pages"
    ]
}
```

If you need to copy a file, you have to add file name (with extension) to property "from" and to property "to" too. TARS-CLI will copy files from new version to current version of your project only.
You can rename files and folder in current project only.

```js
{
    "copy": [
        {   
            // Will copy _template.html from new version to current project
            "from": "/markup/pages/_template.html",
            "to": "/markup/pages/_template.html"
        }
    ],

    "rename": [
        {
            // Will rename _template.html to _index.html 
            // in current version of your project
            "from": "/markup/pages/_template.html",
            "to": "/markup/pages/_index.html"
        }
    ]
}
```

All actions will be executed synchronously to prevent problems with [race condition](https://en.wikipedia.org/wiki/Race_condition) during update.

**It is very important to create correct config, without any errors with files accessibility**

