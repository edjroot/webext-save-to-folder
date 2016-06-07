// chrome.storage.sync.clear()

const createContextMenu = () => {
  const parentId = chrome.contextMenus.create({
    title: "Save image to folder",
    contexts: ['image'],
  });

  chrome.contextMenus.create({
    title: "New folder....",
    parentId,
    onclick: () => {
      chrome.runtime.openOptionsPage();
    },
    contexts: ['image'],
  });

  chrome.storage.sync.get(null, (synced) => {
    const folders = synced.folders;

    for (let folder in folders) {
      const alias = folders[folder];
      chrome.contextMenus.create({
        title: alias || folder,
        parentId,
        onclick: (info, tab) => {
          saveImg(info, tab, folder);
        },
        contexts: ['image'],
      });
    }
  });
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.hasOwnProperty('please') && request.please === 'updateContextMenu') {
      chrome.contextMenus.removeAll(() => {
        createContextMenu();
      });
      return true;
    }
  });

const saveImg = (info, tab, folder) => {
  const imgName = url('file', info.srcUrl);

  chrome.downloads.download({
    url: info.srcUrl,
    filename: folder + '/' + imgName, // REVIEW
  }, (downloadId) => {
    if (typeof downloadId === 'undefined') {
      alert("Sorry, there was an error while trying to download this image! Did you set a valid download path?\n\n" +
        "This is the folder you chose (relative to the downloads folder):\n" +
        folder + "\n\n" +
        "And this is Chrome's error message:\n" +
        chrome.runtime.lastError.message);
    }
  });
};

chrome.storage.sync.get(null, (synced) => {
  // REVIEW: Simplify this (maybe just ditch 'folders' and sync everything at the top level?)
  if (!synced.hasOwnProperty('folders')) {
    chrome.storage.sync.set({folders: {}});
  }
});

createContextMenu();