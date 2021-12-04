// This needs to be injected into a page
function injectClipboardCode( text ){
  const textarea = document.createElement('textarea');
  document.body.appendChild(textarea);
  //console.log(text)
  textarea.value = text;
  currentX= window.scrollX // Remember the current position
  currentY= window.scrollY // Remember the current position
  textarea.focus(); // This will scroll to the end
  document.execCommand('SelectAll');
  document.execCommand("Copy", false, null);
  document.body.removeChild(textarea);
  window.scrollTo(currentX, currentY) // Scroll back to to the old position
}

function injectGetLinkText(){
  //console.log(document.activeElement)
  //console.log(document.activeElement.innerText)
  return document.activeElement.innerText
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

function copyLink(linkUrl){
  // Find the active tab and inject the copy script into it
  // TODO: Consider opening a blank page instead
  chrome.tabs.query({active: true, currentWindow: true}).then(tabs => {
    const tab = tabs[0]
    console.log(tab)
    console.log(tab.id)

    // Requires `"permissions": ["scripting"]` and `"host_permissions": ["*://*/*"]`
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: injectGetLinkText,
    },
    (results) => {
      linkText = results[0].result
      text = `[${linkText}](${linkUrl})`
      copyToClipboard(text)
    }
    );
  })
}

chrome.contextMenus.create({
  id: "selected_text",
  title: "Copy selected as QUOTE",
  contexts: ["selection"]
});

chrome.contextMenus.create({
  id: "selected_text_as_link",
  title: "Copy selected as LINK text",
  contexts: ["selection"]
});

chrome.contextMenus.create({
  id: "page_link",
  title: "Copy PAGE as LINK",
  contexts: ["page"]
});

chrome.contextMenus.create({
  id: "all_tabs",
  title: "Copy ALL TABS as list",
  contexts: ["page"]
});

chrome.contextMenus.create({
  id: "selected_link",
  title: "Copy LINK",
  contexts: ["link"]
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  let text = "Something went wrong with Markdown Note Taker Extension"
  switch (info.menuItemId) {
    case "selected_text":
      console.debug(info.selectionText);
      text = `> ${info.selectionText} (Reference: [${tab.title}](${tab.url}))`
      copyToClipboard(text)
      /*
      chrome.notifications.create(
        "selected_text_copied",
        {
          title: "Markdown note copied",
          message: "Selected text copied to clipboard as markdown quote",
          type: "basic",
          iconUrl: "../icon_placeholder.png"
        }
      )
      */
      break;
    case "selected_text_as_link":
      console.debug(info.selectionText);
      text = `[${info.selectionText}](${tab.url})`
      copyToClipboard(text)
      /*
      chrome.notifications.create(
        "selected_text_copied",
        {
          title: "Markdown note copied",
          message: "Selected text copied to clipboard as markdown link",
          type: "basic",
          iconUrl: "../icon_placeholder.png"
        }
      )
      */
      break;
    case "page_link":
      text = `[${tab.title}](${tab.url})`
      copyToClipboard(text)
      /*
      chrome.notifications.create(
        "selected_text_copied",
        {
          title: "Markdown note copied",
          message: "Page link copied to clipboard as markdown link",
          type: "basic",
          iconUrl: "../icon_placeholder.png"
        }
      )
      */
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
        /*
        chrome.notifications.create(
          "selected_text_copied",
          {
            title: "Markdown note copied",
            message: "Page link copied to clipboard as markdown link",
            type: "basic",
            iconUrl: "../icon_placeholder.png"
          }
        )
        */
      });
      break;
    case "selected_link":
      copyLink(info.linkUrl)
      /*
      chrome.notifications.create(
        "selected_text_copied",
        {
          title: "Markdown note copied",
          message: "Page link copied to clipboard as markdown link",
          type: "basic",
          iconUrl: "../icon_placeholder.png"
        }
      )
      */
      break;
  }
});
