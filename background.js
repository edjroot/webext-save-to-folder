// const contexts = ['image', 'audio', 'video', 'link'];
const contexts = ["all"]  // REVIEW: Does this always work?

const createContextMenu = () => {
  const parentId = chrome.contextMenus.create({
    title: "Save to folder",
    contexts,
  });

  chrome.contextMenus.create({
    title: "New folder / manage folders....",
    parentId,
    onclick: () => {
      chrome.runtime.openOptionsPage();
    },
    contexts,
  });

  chrome.contextMenus.create({
    type: 'separator',
    parentId,
    contexts
  });

  chrome.storage.sync.get(synced => {
    const folders = synced.folders;

    // TODO: Manual sorting

    for (let folder in folders) {
      const alias = folders[folder];
      chrome.contextMenus.create({
        // NOTE: I chose this symbol so users can quickly tell URLs from aliases (bad idea?)
        title: alias ? alias + (synced.showPathInCtx ? ' • ' + folder : '') : '• ' + folder,
        parentId,
        onclick: (info, tab) => {
          download(info, tab, folder);
        },
        contexts,
      });
    }
  });
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.hasOwnProperty('please') && request.please === 'updateContextMenu') {
    chrome.contextMenus.removeAll(() => {
      createContextMenu();
    });
    return true;
  }
});

const download = (info, tab, folder) => {
  const url = (info.srcUrl || info.linkUrl || info.frameUrl || info.pageUrl)
  const payload = { url }

  // FIXME: filename should be determined by onDeterminingFilename
  if (is.firefox) {
    console.log("Firefox detected. Trying to get filename from URL!")
    const sp = unescape(url).split('/')
    const filename = folder + sp[sp.length - 1]
    Object.assign(payload, { filename })
  }

  chrome.downloads.download(payload, (downloadId) => {
    if (downloadId == null) {
      alert(
        "Sorry, an error occurred while trying to download this! Did you set a valid download path?\n\n" +
        "This is the folder you chose (relative to the downloads folder):\n" +
        folder + "\n\n" +
        "And this is Chrome's error message:\n" +
        chrome.runtime.lastError.message
      );
    } else {
      downloadContext = {info, tab, folder, downloadId};
    }
  });
};

// FIXME: `onDeterminingFilename` is unsupported by Firefox
if (!is.firefox) {
  console.log("Some non-Firefox browser detected. Getting filename!")
  // Let Chrome set the download's filename and then prepend the chosen folder
  let downloadContext = null;  // REVIEW: Turn this into a function or something?
  chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
    if (item.id === downloadContext.downloadId) {
      const folder = (downloadContext.folder === '/' ? '' : downloadContext.folder);
      suggest({
        filename: folder + item.filename
      });
      downloadContext = null;
    }
  });
} else {
  console.log("Firefox detected. Skipping \"native\" filename!")
}

chrome.storage.sync.get(synced => {
  if (!synced.hasOwnProperty('folders')) {
    // Initialize settings
    chrome.storage.sync.set({
      folders: {}
    });
  }
});

createContextMenu();