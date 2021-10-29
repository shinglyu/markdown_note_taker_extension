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
  title: "Copy selected as markdown note",
  contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  switch (info.menuItemId) {
    case "selected_text":
      console.debug(info.selectionText);
      const text = `> ${info.selectionText} (Reference: [${tab.title}](${tab.url}))`
      copyToClipboard(text)
      //alert(text)
      chrome.notifications.create(
        "selected_text_copied",
        {
          title: "Markdown note copied",
          message: "Selected text copied to clipboard as markdown note",
          type: "basic",
          iconUrl: "../icon_placeholder.png"
        }
      )
      break;
  }
});
