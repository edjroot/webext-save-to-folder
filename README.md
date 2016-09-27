# Help

This is a very simple extension. First, you set up a list of "favorite" folders, like bookmarks. You can also give them aliases (friendlier names) to make the list more readable. Then, whenever you right-click images, videos, audio or links in any page, that list appears on your context menu under the item "Save to folder". Click one of the folders and the file will be downloaded to it.

## Setting up folders
The most important "rule" to know here is this: By default, **Chrome only allows you to download files to your default downloads folder (and its subfolders) and nowhere else.** So, if your default folder is, say, `C:\Users\Example\Downloads\`, you can only download to it or one of its subfolders (e.g. `C:\Users\Example\Downloads\my\specialoads`. If you want to download to somewhere *outside* of it, **there *is* a workaround — just read on.** (Hint: it involves <a href=`https://en.wikipedia.org/wiki/Symbolic_link`>symlinks</a>.)

Another thing you need to know is that **all paths must be relative to the downloads folder** in Chrome's settings (usually `C:\Users\Example\Downloads` or something like that). So, instead of entering  `C:\Users\Example\Downloads\my\specialoads`, you must type just `my\specialoads`.

Needless to say, **all paths should be valid** if you actually want to download something to them. Just try not to use special symbols (`?`, `%`, `💩`, etc.) or do anything weird like `my .\ $uper \ weird!\.folder \ \ `. I can help make your paths *look* more correct, but it's impossible to be 100% sure before you actually try to download something because it's up to your operating system to decide what is valid and what isn't. Anyway, it's a good idea to try downloading a test file to each of your folders after you save them.

## Using symlinks
If you want to download files to somewhere other than your default downloads folder, you can try using [symlinks](https://en.wikipedia.org/wiki/Symbolic_link). Picture them as shortcuts, or "folder portals", that look like actual folders. You just need to point them to the folders you want to use and make sure they (the symlinks) are inside your downloads folder. For example, you could navigate to your downloads folder, (on Windows) open the command prompt (`Shift`+`right click` > "Open command window here") and create a symlink to `E:\xample\mydowns` with the following command:

`mklink /D E:\xample\mydowns mydowns`

(On Linux, the command would be something like `ln -s /e/xample/mydowns mydowns`.)

Then you could add that folder (and any subfolders) to the list by just entering `mydowns`, `mydowns\picz`, `mydowns\my\mp3s`, etc. Cool, huh? Now, since this is not "officially" supported by Chrome, it *might* not work. And, of course, it just *might* set your computer on fire. But that's relatively rare and doesn't happen more than once.

# About
I made this for a friend who had just migrated from Firefox and was looking for an alternative to this much awesomer <a href=`https://addons.mozilla.org/pt-br/firefox/addon/save-image-in-folder/`>Firefox extension</a>. Since I had some free time (not really), I did something barebones in a few hours and published it to Chrome Web Store. He seemed satisfied enough, so I didn't touch it for some time, didn't market it or anything. It was a surprise to see that more than 70 people have installed it since then and it's even got a (1 star) review! I released this second version to see if I can make my unasked-for users a little happier, hoping for the next review to grant me at least 2 stars :)

In other words, I have no ambitions with this project and may not touch it ever again, unless my urge to procrastinate reappears or if I find out that it has actually set someone's computer on fire. The good news is **it's <a href=`https://github.com/edjroot/chrome-save-to-folder`>open source</a>, yay**, so feel free to send me any feedback and contribute with new features or whatever! I may even come back to this again if you do so :)

Enjoy!