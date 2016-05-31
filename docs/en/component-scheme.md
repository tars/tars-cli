<p align="right">
English description | <a href="../ru/commands.md">Описание на русском</a>
</p>

# Component scheme file

From TARS version 1.8.0 you can create new component which structure is based on json-file with component scheme.

Scheme-file is a simple json-file. It looks like:

```js
{
    "folders": [] // Array of objects, which discribe every folder in current folder
    "files": [] // Array of objects, which discribe every file in current folder
}
```

On the top level of scheme folder and files, which have to be in the root of new component, are discribed.

Structure of folder-object:

```js
{
    "name": "data",  // Folder name
    "files": [] // Array of objects, which discribe every file in current 
    "folders": [] // Array of objects, which discribe every folder in current 
}
```

Every folder can contain other folders and files. Structure of folder is recursive.

Structure of file-object:

```js
{
    "name": "sidebar", // File name
    "content": "<div class=\"sidebar\"></div>"  // File content
}
```

You can use three special vars in scheme file:
* **__componentName__** — will be replaced with new component name;
* **__templateExtension__** — will be replaced with main extension of selected templater;
* **__cssExtension__** — will be replaced with main extension of selected css-preprocessor.

Scheme-file example:

```js
{
    "folders": [
        {
            "name": "data",
            "files": [
                {
                    "name": "data.js",
                    "content": "__componentName__: {}"
                }
            ]
        }
    ],

    "files": [
        {
            "name": "__componentName__.__templateExtension__",
            "content": "<div class=\"__componentName__\"></div>"
        }, {
            "name": "__componentName__.__cssExtension__",
            "content": ".__componentName__ {}"
        }, {
            "name": "__componentName__.js",
            "content": ""
        }
    ]
}
```

You can create as many schemes as you need. You can set specific scheme while component creating by using flag `-s` or in interactive mode. 
