// TODO Handle all possible chrome.runtime.lastError cases

const showMessage = (message, type) => {
  $('#message').text(message).removeAttr('class').addClass(type).stop().fadeIn();
  if (type === 'success') {
    setTimeout(() => {
      $('#message').stop().fadeOut();
    }, 1500);
  }
};

const newFolder = (folder, alias) => {
  $('#folders').append(`
    <div class='folder' data-path='${folder}'>
      <span class='save-hint' title="You haven't saved this yet!">*</span>
      <input class='alias' placeholder="Alias" title="Optional. A prettier name to identify your folder." value='${alias || ''}'>
      <input class='path' placeholder="Path" title='Required. Path relative to your downloads folder. Must be in the root ("/") or a subfolder ("just/an/example").' value='${folder || ''}'>
      <button class='save'>Save</button>
      <button class='remove' title="Remove folder">X</button>
    </div>
    `);
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

function onSave() {
  const $folder = $(this).closest('.folder');
  const path = $folder.find('.path').val().trim();
  const alias = $folder.find('.alias').val().trim();
  const valid = path !== ''; // REVIEW: Better validation here

  if (valid) {
    chrome.storage.sync.get(null, (synced) => {
      synced.folders[path] = alias;
      chrome.storage.sync.set(synced, () => {
        const error = chrome.runtime.lastError;
        if (error) {
          showMessage("Sorry, an error occurred while trying to save this folder! :(\n\n)" +
            "This is Chrome's error message:\n" +
            chrome.runtime.lastError.message, 'error');
        } else {
          const oldPath = $folder.data('path');
          if (oldPath !== path) {
            console.log('old path is different thatn new')
            chrome.storage.sync.get(null, (synced) => {
              delete synced.folders[oldPath];
              chrome.storage.sync.set(synced);
            });
          }
          $folder.data('path', path);
          showMessage("Saved!", 'success');
          $folder.find('.save-hint').hide();
          updateContextMenu();
        }
      });
    });

  } else {
    showMessage(`You must specify a path! (Type "/" to download directly to the downloads folder.)`, 'error');
  }
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
  $folder.find('.save-hint').show();
  $('#message').stop().fadeOut();
}

$(document).ready(function() {
  chrome.storage.sync.get(null, (synced) => {
    const folders = synced.folders;
    for (let folder in folders) {
      newFolder(folder, folders[folder]);
    }
    newFolderIfNotEmpty();
  });
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