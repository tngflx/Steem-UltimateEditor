var syntaxHighlight = MediumEditor.extensions.button.extend({
    name: 'synHighlight',

    tagNames: ['code'], // nodeName which indicates the button should be 'active' when isAlreadyApplied() is called
    contentDefault: '<b>H</b>', // default innerHTML of the button
    contentFA: '<i class="fa fa-file-code-o"></i>', // innerHTML of button when 'fontawesome' is being used
    aria: 'highlight syntax', // used as both aria-label and title attributes
    action: 'synHighlight', // used as the data-action attribute of the button

    init: function () {
        MediumEditor.extensions.button.prototype.init.call(this);

        this.subscribe('editableInput', this.handleInput.bind(this));
        this.subscribe('keyup', this.handleCaret.bind(this));
        this.subscribe('editableKeydownEnter', this.handleParagraph);
        this.subscribe('click', this.wrapCode.bind(this));
    },
    
     handleInput: function () {
        var regex = new RegExp(/\`\`\`(\b[\w]+\b)((.|\n)+)\`\`\`/, 'gm');
        var mat_code = $('.editable').text().match(regex);
        if (mat_code) {
            var code_html = mat_code.toString();
            const language = RegExp.$1;
            const codes = RegExp.$2;
            const replace_text = "<code class=\"" + language + "\">" + "</code>";
            code_html = code_html.replace(/[\s\S]*/, replace_text);
            document.getElementsByClassName('editable')[0].innerHTML = document.getElementsByClassName('editable')[0].innerHTML.replace(regex, code_html);
            document.getElementsByTagName('code')[0].innerText = document.getElementsByTagName('code')[0].innerText.replace(/.*/g, codes);
            if (document.getElementsByTagName("code")[0].parentNode.nodeName !== 'pre') {
                $("code").wrap('<pre></pre>');
                document.getElementsByTagName("code").innerHTML = "<input type='text' />";
            }
            this.highSyn();
        }
        this.base.saveSelection();
        this.highSyn();

    highSyn: function () {
        hljs.configure({ useBR: false });
        this.base.restoreSelection();

        $('code').each(function (i, block) {
            hljs.highlightBlock(block);
        })
    },

    handleParagraph: function () {
        //var p, node = MediumEditor.selection.getSelectionStart(document);

        //if (MediumEditor.util.isKey(event, MediumEditor.util.keyCode.ENTER) &&
        //    (MediumEditor.util.getClosestTag(node, 'code') !== false) &&
        //    MediumEditor.selection.getCaretOffsets(node).right === 0) {

        //    // when cursor is at the end of <blockquote>,
        //    // then pressing enter key should create <p> tag, not <blockquote>
        //    p = document.createElement('p');
        //    p.innerHTML = '<br>';
        //    node.parentElement.insertBefore(p, node.nextSibling);

        //    // move the cursor into the new paragraph
        //    MediumEditor.selection.moveCursor(document, p);

        //    event.preventDefault();
        //}
    },

    handleCaret: function (e) {
    function rangeToPlainText(aRange) {
      // line delimiter is automatically detected by the browser
      // for each platform.
      var prettyText = window.getSelection().toString();
      var linesDelimiter = /(\r?\n)/.test(prettyText) ? RegExp.$1 : '\n';

      var text = '';
      var target = aRange.startContainer;
      if (target.nodeType == target.ELEMENT_NODE &&
          !/^(img|br)$/i.test(target.localName))
        target = target.childNodes[aRange.startOffset];

      var targets = editableNodes();
      var initialTarget = target;
      for (target of targets)
      {
        if (initialTarget) {
          if (target != initialTarget)
            continue;
          initialTarget = null;
        }

        if (target.nodeType == target.TEXT_NODE) {
          let value = target.nodeValue;
          if (target == aRange.endContainer)
            value = value.slice(0, aRange.endOffset);
          if (target == aRange.startContainer)
            value = value.slice(aRange.startOffset);
          text += value;
        }
        else if (target.localName.toUpperCase() == 'BR') {
          text += linesDelimiter;
        }
        else if (target.alt) {
          text += target.alt;
        }

        if (target.nodeType == target.TEXT_NODE ?
              target == aRange.endContainer :
              target == aRange.endContainer.childNodes[aRange.endOffset - 1])
          break;
      }
      return text;
    }

    function getCursorPosition() {
      try {
        var cursor = window.getSelection().getRangeAt(0).cloneRange();
        cursor.collapse(false);
        var firstEditable = editableNodes().next().value;
        cursor.setStart(firstEditable, 0);
        return unicodeStringToChars(rangeToPlainText(cursor)).length;
      }
      catch(e) {
        return -1;
      }
    }

    function setCursorAt(aPosition) {
      try {
        var targets = editableNodes();
        var target = targets.next().value;

        var selection = window.getSelection();
        var cursor = document.createRange();
        cursor.setStart(target, 0);
        var restCount = aPosition;
        while (target && restCount > 0)
        {
          if (target.nodeType == target.TEXT_NODE) {
            let value = target.nodeValue;
            if (value.length >= restCount) {
              cursor.setEnd(target, restCount);
              break;
            }
            restCount -= unicodeStringToChars(value).length;
          }
          else {
            restCount--;
          }
          cursor.setEndAfter(target);

          target = targets.next().value;
        }
        cursor.collapse(false);
        selection.removeAllRanges();
        selection.addRange(cursor);
      }
      catch(e) {
        console.log('failed to move cursor: ', e);
      }
    }

    function editableNodes() {
      var nodes = document.evaluate(
        'descendant::text() | descendant::*[contains("img,IMG,br,BR", local-name())]',
        gEditor,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      return (function* () {
        for (var i = 0, maxi = nodes.snapshotLength; i < maxi; i++)
        {
          yield nodes.snapshotItem(i);
        }
      })();
      
          function onKeyPress(aEvent) {
      if (aEvent.keyCode == aEvent.DOM_VK_TAB &&
          !aEvent.altKey &&
          !aEvent.ctrlKey &&
          !aEvent.metaKey &&
          !aEvent.shiftKey &&
          document.execCommand('insertText', false, '\t'))
        aEvent.preventDefault();
    }

    function onCopy(aEvent) {
      var text = rangeToPlainText(window.getSelection().getRangeAt(0));
      aEvent.clipboardData.setData('text/plain', text);
      aEvent.preventDefault();
    }

    function onCut(aEvent) {
      var text = rangeToPlainText(window.getSelection().getRangeAt(0));
      aEvent.clipboardData.setData('text/plain', text);
      if (document.execCommand('delete'))
        aEvent.preventDefault();
    }

    function onPaste(aEvent) {
      var text = aEvent.clipboardData.getData('text/plain') || '';
      var command = 'insertText';
      gEditor.focus();
      if (document.execCommand(command, false, text))
        aEvent.preventDefault();
    }
    },
});
        

