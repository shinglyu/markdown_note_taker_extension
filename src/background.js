function copyToClipboard( text ){
  const textarea = document.createElement('textarea');
  document.body.appendChild(textarea);
  textarea.value = text;
  textarea.focus();
  document.execCommand('SelectAll');
  document.execCommand("Copy", false, null);
  document.body.removeChild(textarea);
}

chrome.contextMenus.create({
  id: "selected_text",
  title: "Copy selected as markdown quote",
  contexts: ["selection"]
});

chrome.contextMenus.create({
  id: "selected_text_as_link",
  title: "Copy selected as title for markdown link",
  contexts: ["selection"]
});

chrome.contextMenus.create({
  id: "page_link",
  title: "Copy page title as markdown link",
  contexts: ["all"]
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
  }
});
