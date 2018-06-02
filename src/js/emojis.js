function extend(dest, source) {
        var prop;
        dest = dest || {};
        for (prop in source) {
            if (source.hasOwnProperty(prop) && !dest.hasOwnProperty(prop)) {
                dest[prop] = source[prop];
            }
        }
        return dest;
    }

    function getSelectionText(doc) {
        if (doc.getSelection) {
            return doc.getSelection().toString();
        }
        if (doc.selection && doc.selection.type !== 'Control') {
            return doc.selection.createRange().text;
        }
        return '';
    }

    function getSelectionStart(doc) {
        var node = doc.getSelection().anchorNode,
            startNode = (node && node.nodeType === 3 ? node.parentNode : node);

        return startNode;
    }

    function placeCaretAtNode(doc, node, before) {
        if (doc.getSelection !== undefined && node) {
            var range = doc.createRange(),
                selection = doc.getSelection();

            if (before) {
                range.setStartBefore(node);
            } else {
                range.setStartAfter(node);
            }

            range.collapse(false);

            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    function isInsideElementOfTag(node, tag) {
        if (!node) {
            return false;
        }

        var parentNode = node.parentNode,
            tagName = parentNode.tagName.toLowerCase();

        while (tagName !== 'body') {
            if (tagName === tag) {
                return true;
            }
            parentNode = parentNode.parentNode;

            if (parentNode && parentNode.tagName) {
                tagName = parentNode.tagName.toLowerCase();
            } else {
                return false;
            }
        }

        return false;
    }

    function getParentOf(el, tagTarget) {
        var tagName = el && el.tagName ? el.tagName.toLowerCase() : false;

        if (!tagName) {
            return false;
        }
        while (tagName && tagName !== 'body') {
            if (tagName === tagTarget) {
                return el;
            }
            el = el.parentNode;
            tagName = el && el.tagName ? el.tagName.toLowerCase() : false;
        }
    }

setBuilder: function () {
            this._range = null;
            
            var elements = this._doc.getElementsByClassName('medium-editor-emoji-builder-grid');
            $('.medium-editor-table-builder').attr('style', 'display = "none";');
            elements[0].style.display = 'block';
            elements[0].style.backgroundColor = 'black';
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.height = (COLUMN_WIDTH * this.rows + BORDER_WIDTH * 2) + 'px';
                elements[i].style.width = (COLUMN_WIDTH * this.columns + BORDER_WIDTH * 2) + 'px';
            }
            if ($(".emojislst")[0] === undefined) {
                var handlebar = window.MediumInsert.Templates['src/js/templates/emojis.hbs']().trim();
                elements[0].insertAdjacentHTML('beforeend', handlebar);
                this._onClick();
            }
        },

        _onClick: function () {
            var x = this._doc;
            $('.emojislst>li').on('click', function (e) {
                var res = e.target.innerText;
                insertHtmlAfterSelection(res, x);
            })
        }
