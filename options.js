// TODO Handle all possible chrome.runtime.lastError cases?

// http://stackoverflow.com/a/12034334
const entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

function escapeHtml(string) {
  if (string == null) return ''
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
}

const showMessage = (message, classes) => {
  $('#message').html(message).removeAttr('class').addClass(classes).stop().fadeIn();
  if (classes === 'success') {
    setTimeout(() => {
      hideMessage();
    }, 1500);
  }
};

const hideMessage = () => {
  $('#message').stop().fadeOut();
}

const newFolder = (folder, alias) => {
  $('#folders').append(`
    <div class='folder' data-path='${escapeHtml(folder)}'>
      <span class='save-hint' title="You haven't saved this yet!">*</span>
      <input class='alias' placeholder="Alias" title="Optional. A prettier name to identify your folder." value='${escapeHtml(alias) || ''}'>
      <input class='path' placeholder="Path (default: Downloads/)" title='Path relative to your downloads folder (subfolder: "just/a/cool example/"; empty = root).' value='${escapeHtml(folder) || ''}'>
      <button class='save'>Save</button>
      <button class='remove' title="Remove folder">✖</button>
    </div>
    `);  // TODO: <input type="file" webkitdirectory> instead of plain text
};

const newFolderIfNotEmpty = () => {
  if (!$('.folder').length) {
    newFolder();
  } else {
    const $filled = $('.folder:last-child input').filter(function() {
      return this.value.trim() !== '';
    });
    if ($filled.length) {
      newFolder();
    }
  }
  $('.folder:last-child input').first().focus();
};


const updateContextMenu = () => {
  chrome.runtime.sendMessage({
    please: 'updateContextMenu'
  });
};

// TODO: "Save all" option

function onSave() {
  const $folder = $(this).closest('.folder');
  const $path = $folder.find('.path');
  let path = $path.val().trim()
    .replace(/\\+/g, '/')  // Windows-style > UNIX-style slashes
    .split('/').reduce((p,c)=>{return p.trim()+'/'+c.trim()}) // Remove spaces next to slashes
    .replace(/\/\/+/g, '/')  // Remove duplicate slashes
    .replace(/^\/|\/$/g, '');  // Remove first and last slashes
    // TODO: Additional validation is still needed (or....: http://stackoverflow.com/a/1976050)
  path += '/';
  const alias = $folder.find('.alias').val().trim();
  
  chrome.storage.sync.get(null, (synced) => {
    synced.folders[path] = alias;
    chrome.storage.sync.set(synced, () => {
      const error = chrome.runtime.lastError;
      if (error) {
        showMessage(
          "Sorry, an error occurred while trying to save your changes! :(<br><br>" +
          "This is Chrome's error message:<br>" +
          "<strong><pre>" + chrome.runtime.lastError.message + "</pre></strong>", 'error'
        );
      } else {
        const oldPath = $folder.data('path');
        if (oldPath !== path) {
          chrome.storage.sync.get(null, (synced) => {
            console.debug(synced.folders);
            delete synced.folders[oldPath];
            console.debug(synced.folders);
            chrome.storage.sync.set(synced);
          });
        }
        $folder.data('path', path);
        $path.val(path);
        showMessage("Saved!", 'success');
        $folder.removeClass('dirty');
        updateContextMenu();
      }
    });
  });
}

function onRemove() {
  chrome.storage.sync.get(null, (synced) => {
    const $folder = $(this).closest('.folder');
    const path = $folder.data('path');
    delete synced.folders[path];
    chrome.storage.sync.set({
      folders: synced.folders
    }, () => {
      updateContextMenu();
      $(this).closest('.folder').remove();
      newFolderIfNotEmpty();
    });
  });
}

function onInput() {
  const $folder = $(this).closest('.folder');
  $folder.addClass('dirty');;
  hideMessage();
}

$(document).ready(function() {
  chrome.storage.sync.get(null, (synced) => {
    $('#show-path').prop('checked', synced.showPathInCtx || false);
    
    const folders = synced.folders;
    for (let folder in folders) {
      newFolder(folder, folders[folder]);
    }
    newFolderIfNotEmpty();
  });
  
  $('#show-path').on('change', function() {
    chrome.storage.sync.set({showPathInCtx: this.checked}, ()=> {
      showMessage("Saved!", 'success');
      updateContextMenu();
    });
  });
  
  $('#message').mouseup(function(e) {
    // Don't close if the user clicks on children (so messages that are supposed
    // to be copyable should be wrapped in some element)
    if (e.target !== this)
      return;
    $(this).stop().fadeOut();
  });
  
  $('.help').click(function(e) {
    // REVIEW: Do something more decent
    if ($('#message').is(':visible')) {
      hideMessage();
    } else {
      showMessage(
        // TODO: Put this in another file; improve the text: include clearer instructions on how to use symlinks; also add a caveat about Chrome being annoying by asking for confirmation before saving if the option is enabled
        `
        <div>
          <h1>Help</h1>
          
          <p>This is a very simple extension. First, you set up a list of "favorite" folders, like bookmarks. You can also give them aliases (friendlier names) to make the list more readable. Then, whenever you right-click images, videos, audio or links in any page, that list appears on your context menu under the item "Save to folder". Click one of the folders and the file will be downloaded to it.</p>
          
          <h3>Setting up folders</h3>
          <p>The most important "rule" to know here is this: By default, <strong>Chrome only allows you to download files to your default downloads folder (and its subfolders) and nowhere else.</strong> So, if your default folder is, say, "C:\\Users\\Example\\Downloads\\", you can only download to it or one of its subfolders (e.g. "C:\\Users\\Example\\Downloads\\my\\specialoads"). If you want to download to somewhere <em>outside</em> of it, <strong>there <em>is</em> a workaround — just read on.</strong> (Hint: it involves <a href="https://en.wikipedia.org/wiki/Symbolic_link">symlinks</a>.)</p>
          <p>Another thing you need to know is that <strong>all paths must be relative to the downloads folder</strong> in Chrome's settings (usually "C:\\Users\\Example\\Downloads" or something like that). So, instead of entering "C:\\Users\\Example\\Downloads\\my\\specialoads", you must type just "my\\specialoads".</p>
          <p>Needless to say, <strong>all paths should be valid</strong> if you actually want to download something to them. Just try not to use special symbols (?, %, 💩, etc.) or do anything weird like "my .\\ $uper \\ weird!\\.folder \\ \\ ". I can help make your paths <em>look</em> more correct, but it's impossible to be 100% sure before you actually try to download something because it's up to your operating system to decide what is valid and what isn't. Anyway, it's a good idea to try downloading a test file to each of your folders after you save them.
          
          <h3>Using symlinks</h3>
          <p>If you want to download files to somewhere other than your default downloads folder, you can try using <a href="https://en.wikipedia.org/wiki/Symbolic_link">symlinks</a>. Picture them as shortcuts, or "folder portals", that look like actual folders. You just need to point them to the folders you want to use and make sure they (the symlinks) are inside your downloads folder. For example, you could navigate to your downloads folder, (on Windows) open the command prompt (Shift+right click > "Open command window here") and create a symlink to "E:\\xample\\mydowns" with the following command:</p>
          <pre>mklink /D E:\\xample\\mydowns mydowns</pre>
          <p>(On Linux, the command would be something like "ln -s /e/xample/mydowns mydowns".)</p>
          <p>Then you could add that folder (and any subfolders) to the list by just entering "mydowns", "mydowns\\picz", "mydowns\\my\\mp3s", etc. Cool, huh? Now, since this is not "officially" supported by Chrome, it <em>might</em> not work. And, of course, it just <em>might</em> set your computer on fire. But that's relatively rare and doesn't happen more than once.</p>
          
          <h1>About</h1>
          <p>I made this for a friend who had just migrated from Firefox and was looking for an alternative to this much awesomer <a href="https://addons.mozilla.org/pt-br/firefox/addon/save-image-in-folder/">Firefox extension</a>. Since I had some free time (not really), I did something barebones in a few hours and published it to Chrome Web Store. He seemed satisfied enough, so I didn't touch it for some time, didn't market it or anything. It was a surprise to see that more than 70 people have installed it since then and it's even got a (1 star) review! I released this second version to see if I can make my unasked-for users a little happier, hoping for the next review to grant me at least 2 stars :)</p>
          <p>In other words, I have no ambitions with this project and may not touch it ever again, unless my urge to procrastinate reappears or if I find out that it has actually set someone's computer on fire. The good news is <strong>it's <a href="https://github.com/edjroot/chrome-save-to-folder">open source</a>, yay</strong>, so feel free to send me any feedback and contribute with new features or whatever! I may even come back to this again if you do so :)</p>
          <p>Enjoy!</p>
        </div>
        `,  // HACK: The wrapper div prevents users from closing the popup by clicking on blank spaces (see `mouseup` event)
        'large'
      );
    }
  })
});

$(document).mousedown(function(e) {
  if ($(e.target).closest('#message').length === 0) {
    hideMessage();
  }
});

$(document).arrive('.save', function() {
  $(this).click(onSave);
});

$(document).arrive('.remove', function() {
  $(this).click(onRemove);
});

$(document).arrive('input', function() {
  $(this).on('input', onInput);
});

$('#add').click(newFolderIfNotEmpty);