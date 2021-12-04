// This needs to be injected into a page
function injectClipboardCode( text ){
  const textarea = document.createElement('textarea');
  document.body.appendChild(textarea);
  console.log(text)
  textarea.value = text;
  textarea.focus();
  document.execCommand('SelectAll');
  document.execCommand("Copy", false, null);
  document.body.removeChild(textarea);
}

function copyToClipboard( text ){
  // Find the active tab and inject the copy script into it
  // TODO: Consider opening a blank page instead
  chrome.tabs.query({active: true, currentWindow: true}).then(tabs => {
    const tab = tabs[0]
    console.log(tab)
    console.log(tab.id)

    // Requires `"permissions": ["scripting"]` and `"host_permissions": ["*://*/*"]`
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: injectClipboardCode,
      args: [text]
    });

  })
}

chrome.contextMenus.create({
  id: "selected_text",
  title: "Copy selected as markdown QUOTE",
  contexts: ["selection"]
});

chrome.contextMenus.create({
  id: "selected_text_as_link",
  title: "Copy SELECTED as title for markdown LINK",
  contexts: ["selection"]
});

chrome.contextMenus.create({
  id: "page_link",
  title: "Copy PAGE TITLE as markdown LINK",
  contexts: ["all"]
});

chrome.contextMenus.create({
  id: "all_tabs",
  title: "Copy ALL TABS as markdown LINKS LIST",
  contexts: ["all"]
});

chrome.contextMenus.create({
  id: "selected_link",
  title: "Copy link as markdown link",
  contexts: ["link"]
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  let text = "Something went wrong with Markdown Note Taker Extension"
  switch (info.menuItemId) {
    case "selected_text":
      console.debug(info.selectionText);
      text = `> ${info.selectionText} (Reference: [${tab.title}](${tab.url}))`
      copyToClipboard(text)
      chrome.notifications.create(
        "selected_text_copied",
        {
          title: "Markdown note copied",
          message: "Selected text copied to clipboard as markdown quote",
          type: "basic",
          iconUrl: "../icon_placeholder.png"
        }
      )
      break;
    case "selected_text_as_link":
      console.debug(info.selectionText);
      text = `[${info.selectionText}](${tab.url})`
      copyToClipboard(text)
      chrome.notifications.create(
        "selected_text_copied",
        {
          title: "Markdown note copied",
          message: "Selected text copied to clipboard as markdown link",
          type: "basic",
          iconUrl: "../icon_placeholder.png"
        }
      )
      break;
    case "page_link":
      text = `[${tab.title}](${tab.url})`
      copyToClipboard(text)
      chrome.notifications.create(
        "selected_text_copied",
        {
          title: "Markdown note copied",
          message: "Page link copied to clipboard as markdown link",
          type: "basic",
          iconUrl: "../icon_placeholder.png"
        }
      )
      break;
    case "all_tabs":
      chrome.tabs.query({
        currentWindow: true
      }, function(tabs) {
        text = ""
        for (tab of tabs) {
          text += `* [${tab.title}](${tab.url})\n`
        }
        copyToClipboard(text)
        chrome.notifications.create(
          "selected_text_copied",
          {
            title: "Markdown note copied",
            message: "Page link copied to clipboard as markdown link",
            type: "basic",
            iconUrl: "../icon_placeholder.png"
          }
        )
      } );
      break;
    case "selected_link":
      text = `[something](${info.linkUrl})`
      console.debug(text)
      copyToClipboard(text)
      chrome.notifications.create(
        "selected_text_copied",
        {
          title: "Markdown note copied",
          message: "Page link copied to clipboard as markdown link",
          type: "basic",
          iconUrl: "../icon_placeholder.png"
        }
      )
      break;
  }
});
