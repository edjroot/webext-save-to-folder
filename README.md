# Attention: This extension is not maintained anymore.

(But contributions are still welcome!)

But don't be sad! There's an awesome extension that does the same and much more! Go check it out: https://github.com/gyng/save-in/

Whatever you read below may have out-of-date info since the time I wrote this.

---

# "Save to folder from context menu" WebExtension

**Chrome**: https://chrome.google.com/webstore/detail/save-to-folder-from-conte/pdlkjdlbjjfmlfhijdbdpkilpdoncgdk

**Firefox**: https://addons.mozilla.org/en-US/firefox/addon/save-to-folder/

**Github**: https://github.com/edjroot/webext-save-to-folder

---

**NOTE**: For security reasons, your browser doesn't allow extensions to do certain things, such as choosing arbitrary download locations or disabling the "save as" dialog. But you can do it! I believe in you! Just read on.

---

## How to use, step-by-step
1. In the extension's settings page, set up a list of folders. These will appear on your context menu so you can download stuff directly to them.
2. ... Uhh, that's it.

---

## FAQ

### How do I download to locations outside the default downloads folder?
You just need to set up symlinks (for more info, just head to the settings page after you install the extension).

### How do I get rid of the "save as" dialog?
Just head to your browser's preferences and disable this feature.

### I find this extension so outrageously stupid. What should I do?
Feel free to complain at:
https://github.com/edjroot/webext-save-to-folder/issues

---

## Downloading to any folder
Your browser doesn't allow extensions to download files to places outside your default downloads folder, but you can achieve that by using [symlinks](https://en.wikipedia.org/wiki/Symbolic_link). Picture them as shortcuts, or "folder portals", that look like actual folders. You just need to point them to the folders you want to use and make sure they (the symlinks) are inside your downloads folder.

For example, you could navigate to your downloads folder, (on Windows) open the command prompt (`Shift`+`right click` > "Open command window here") and create a symlink to `E:\xample\mydowns` with the command `mklink /D E:\xample\mydowns mydowns`. On Linux, the command would be something like `ln -s /e/xample/mydowns mydowns`.

Then you could add that folder (and any subfolders) to the list by just entering `mydowns`, `mydowns\picz`, `mydowns\my\mp3s`, etc. Cool, huh? Now, since this is not "officially" supported by your browser, it *might* not work. And, of course, it just *might* set your computer on fire. But according to my simulations that should be relatively rare.

## About
I made this for a friend and don't use it myself, which means I have no further ambitions with this project and may not touch it ever again, unless my urge to procrastinate reappears or if I find out that it has actually set someone's computer on fire. The good news is it's open source, yay, so feel free to give feedback and contribute with new features or whatever! I may even come back to this again if you do so :)

Enjoy!
