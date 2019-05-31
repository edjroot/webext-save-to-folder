# "Save to folder from context menu" WebExtension

**Chrome**: https://chrome.google.com/webstore/detail/save-to-folder-from-conte/pdlkjdlbjjfmlfhijdbdpkilpdoncgdk

**Firefox**: https://addons.mozilla.org/en-US/firefox/addon/save-to-folder/

**Github**: https://github.com/edjroot/webext-save-to-folder

*Please do read this thing before complaining about how stupid this extension is!*

This is a very simple extension:
1. In the settings page, you can set up a list of folders
2. While browsing, right-click whatever you want to download. You'll see an item on the context menu with the list of folders you set up previously. Select a folder. The file will be magically downloaded to that folder (duh).

## Common complaints (and why I'm innocent)

### I can't choose any folder I want? Stupid extension!
Sorry for this, but it's actually not my fault. First of all, **you _can_ download files to any folder you want (skip to the next section to see how)**, so this is, like, only half stupid. The thing is, your browser kinda likes to protect you against evil extensions so it won't let them download files to arbitrary folders on your computer, which means you're officially restricted to your default downloads folder. Extension developers, such as yours truly, can't do anything about that. But - you guessed it - _you have the power_! Just read on. I believe in you!

### I still see the "save as" dialog! How stupid is that?
Truly sorry, but, err, it's not my fault. It just means your browser is configured to show this dialog, and extensions can't change that setting. But _you_ can! How awesome is that? So just head to your browser's preferences and disable it.

### \[Insert complaint here\]! Stupid stupid!
I feel like I've apologized too much already, but sure, this may be my fault. But at least [open an issue here](https://github.com/edjroot/webext-save-to-folder/issues) to let me know before rating it with one-star and hurting my feelings :(

## Downloading to any folder
Your browser doesn't allow extensions to download files to places outside your default downloads folder, but you can you can achieve that by using [symlinks](https://en.wikipedia.org/wiki/Symbolic_link). Picture them as shortcuts, or "folder portals", that look like actual folders. You just need to point them to the folders you want to use and make sure they (the symlinks) are inside your downloads folder.

For example, you could navigate to your downloads folder, (on Windows) open the command prompt (`Shift`+`right click` > "Open command window here") and create a symlink to `E:\xample\mydowns` with the command `mklink /D E:\xample\mydowns mydowns`. On Linux, the command would be something like `ln -s /e/xample/mydowns mydowns`.

Then you could add that folder (and any subfolders) to the list by just entering `mydowns`, `mydowns\picz`, `mydowns\my\mp3s`, etc. Cool, huh? Now, since this is not "officially" supported by your browser, it *might* not work. And, of course, it just *might* set your computer on fire. But according to my simulations that should be relatively rare.

## About
I made this for a friend and don't use it myself, which means I have no further ambitions with this project and may not touch it ever again, unless my urge to procrastinate reappears or if I find out that it has actually set someone's computer on fire. The good news is it's open source, yay, so feel free to give feedback and contribute with new features or whatever! I may even come back to this again if you do so :)

Enjoy!
