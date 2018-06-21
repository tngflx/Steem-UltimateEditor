(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(window.jQuery);
    }
}(function () {
    FindnReplace = Ultimateeditor.extensions.form.extend({
        /* FindnReplace Form Options */

        /* placeholderText: [string]  (previously options.anchorInputPlaceholder)
         * text to be shown as placeholder of the anchor input.
         */
        placeholderText_find: 'Type your search keyword here',
        placeholderText_rep:'Insert characters to replace with',

        // Options for the Button base class
        name: 'fnrep',
        action: 'fnrep',
        aria: 'find and replace',
        tagNames: ['a'],
        contentDefault: '<b>#</b>',
        contentFA: '<i class="fa fa-search"></i>',

        init: function () {
            Ultimateeditor.extensions.form.prototype.init.apply(this, arguments);

            this.subscribe('editableKeydown', this.handleKeydown.bind(this));
        },

        // Called when the button the toolbar is clicked
        // Overrides ButtonExtension.handleClick
        handleClick: function (event) {
            event.preventDefault();
            event.stopPropagation();

            let range = Ultimateeditor.selection.getSelectionRange(this.document);

            if (range.startContainer.nodeName.toLowerCase() === 'a' ||
                range.endContainer.nodeName.toLowerCase() === 'a' ||
                Ultimateeditor.util.getClosestTag(Ultimateeditor.selection.getSelectedParentElement(range), 'a')) {
                return this.execAction('unlink');
            }

            if (!this.isDisplayed()) {
                this.showForm();
            }

            return false;
        },

        // Called when user hits the defined shortcut (CTRL / COMMAND + G)
        handleKeydown: function (event) {
            if (Ultimateeditor.util.isKey(event, Ultimateeditor.util.keyCode.G) && Ultimateeditor.util.isMetaCtrlKey(event) && !event.shiftKey) {
                this.handleClick(event);
            }
        },

        // Called by medium-editor to append form to the toolbar
        getForm: function () {
            if (!this.form) {
                this.form = this.createForm();
            }
            return this.form;
        },

        getTemplate: function () {
            let template = [
                '<input type="text" class="medium-editor-toolbar-find-input fnr-input" placeholder="', this.placeholderText_find, '">' +
                '<input type="text" class="medium-editor-toolbar-replace-input fnr-input" placeholder="', this.placeholderText_rep, '">'
            ];

            template.push(
                '<a href="#" class="medium-editor-toolbar-find" data-action="fnrep" title="Find!" aria-label="Find!">',
                this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-arrow-right" ></i>' : this.formSaveLabel,
                '</a>'
            );

            template.push('<a href="#" class="medium-editor-toolbar-replace" data-action="fnrep" title="Replace all" aria-label="Replace all">',
                this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-retweet"></i>' : this.formCloseLabel,
                '</a>');

            template.push('<a href="#" class="medium-editor-toolbar-fnr-close" data-action="fnrep" title="Close" aria-label="Close">',
                this.getEditorOption('buttonLabels') === 'fontawesome' ? '<i class="fa fa-times"></i>' : this.formCloseLabel,
                '</a>');

            // both of these options are slightly moot with the ability to
            // override the letious form buildup/serialize functions.


            return template.join('');

        },

        // Used by medium-editor when the default toolbar is to be displayed
        isDisplayed: function () {
            return Ultimateeditor.extensions.form.prototype.isDisplayed.apply(this);
        },

        hideForm: function () {
            Ultimateeditor.extensions.form.prototype.hideForm.apply(this);
            this.getInputRep().value = '';
        },

        showForm: function (opts) {
            let input = this.getInputRep();

            opts = opts || { value: '' };
            // TODO: This is for backwards compatability
            // We don't need to support the 'string' argument in 6.0.0
            if (typeof opts === 'string') {
                opts = {
                    value: opts
                };
            }

            this.base.saveSelection();
            this.hideToolbarDefaultActions();
            Ultimateeditor.extensions.form.prototype.showForm.apply(this);
            this.setToolbarPosition();

            input.value = opts.value;
            input.focus();

        },



        // Called by core when tearing down medium-editor (destroy)
        destroy: function () {
            if (!this.form) {
                return false;
            }

            if (this.form.parentNode) {
                this.form.parentNode.removeChild(this.form);
            }

            delete this.form;
        },

        // core methods

        getFormOpts: function () {
            // no notion of private functions? wanted `_getFormOpts`
            opts = {
                rep: this.getInputRep().value,
                find: this.getInputFind().value
            };

            return opts;
        },

        Search_key: function () {
            let opts = this.getFormOpts();
            let $place = $('p');
            let regex = new RegExp('(' + opts.find + ')', "g");

            //Trying to find out how many paragraph have such matches
            const fnrCount = Array.prototype.filter.call($place, (p) => {
                return p.innerHTML.match(regex);
            });

            //Replace content according to order and index
            if (fnrCount.length >= 1 && opts.find !== '') {
                for (let i = 0; i < $place.length; i++) {
                    $place[i].innerHTML = $place[i].innerText.replace(regex, "<span class='hlfind'>$1</span>");
                    let dest = $('p')[i].innerText;
                };
                this.selectText('hlfind', 0);
            }
            
        },

        Replace_with: function () {

            let opts = this.getFormOpts();
            let $place = $('p');
            let regex = new RegExp('(' + opts.find + ')', "g");

            //Replace content according to order and index
            if (opts.find !== '' && opts.rep !== '') {
                for (let i = 0; i < $place.length; i++) {
                    let dest = $('p')[i].innerText;
                        $place[i].innerHTML = dest.replace(regex, `<span class='hlfind'>${opts.rep}</span>`);
                };
            }
        },

        completeFormSave: function (opts) {
            this.base.restoreSelection();
            this.execAction(this.action, opts);
            this.base.checkSelection();
        },


        doFormCancel: function () {
            this.base.restoreSelection();
            this.base.checkSelection();
        },

        // form creation and event handling
        attachFormEvents: function (form) {
            let close = form.querySelector('.medium-editor-toolbar-fnr-close'),
                find = form.querySelector('.medium-editor-toolbar-find'),
                replace = form.querySelector('.medium-editor-toolbar-replace'),
                //replace_all = form.querySelector('.medium-editor-toolbar-replaceall'),
                rep_input = form.querySelector('.medium-editor-toolbar-replace-input'),
                find_input = form.querySelector('.medium-editor-toolbar-find-input');

            // Handle clicks on the form itself
            this.on(form, 'click', this.handleFormClick.bind(this));

            // Handle typing in the textbox
            this.on(rep_input, 'keyup', this.handleTextboxKeyup.bind(this));
            this.on(find_input, 'keyup', this.handleTextboxKeyup.bind(this));

            // Handle close button clicks
            this.on(close, 'click', this.handleCloseClick.bind(this));

            // Handle find button clicks (capture)
            this.on(find, 'click', this.handleFindBtn.bind(this), true);
            this.on(replace, 'click', this.handleRepBtn.bind(this), true);
            //this.on(replace_all, 'click', this.handleFindBtn.bind(this), true);

        },

        createForm: function () {
            let doc = this.document,
                form = doc.createElement('div');

            // Anchor Form (div)
            form.className = 'medium-editor-toolbar-form';
            form.id = 'medium-editor-toolbar-form-fnrep-' + this.getEditorId();
            form.innerHTML = this.getTemplate();
            this.attachFormEvents(form);

            return form;
        },

        getInputRep: function () {
            return this.getForm().querySelector('input.medium-editor-toolbar-replace-input');
        },

        getInputFind: function () {
            return this.getForm().querySelector('input.medium-editor-toolbar-find-input');
        },

        handleTextboxKeyup: function (event) {
            // For ENTER -> create the anchor
            if (event.keyCode === Ultimateeditor.util.keyCode.ENTER) {
                event.preventDefault();
                event.stopPropagation();
                this.Search_key();
                
            }

            // For ESCAPE -> close the form
            if (event.keyCode === Ultimateeditor.util.keyCode.ESCAPE) {
                event.preventDefault();
                this.doFormCancel();
                this.remHigh();
            }
        },

        handleFormClick: function (event) {
            // make sure not to hide form when clicking inside the form
            event.stopPropagation();
        },

        handleFindBtn: function (event) {
            event.preventDefault();
            event.stopPropagation();
            this.Search_key();
            
        },

        handleRepBtn: function (event) {
            event.preventDefault();
            this.Replace_with();

        },

        handleCloseClick: function (event) {
            // Click Close -> close the form
            this.remHigh();
            event.preventDefault();
            
            this.doFormCancel();
        },

        //equivalent to unwrap from jquery (faster performance)
        remHigh: function () {
            let b = document.getElementsByClassName('hlfind');

            while (b.length) {
                let parent = b[0].parentNode;
                while (b[0].firstChild) {
                    parent.insertBefore(b[0].firstChild, b[0]);
                }
                parent.removeChild(b[0]);
            }
        },

        selectText: function (node, index) {
            node = document.getElementsByClassName(node)[index];

            if(document.body.createTextRange) {
                const range = document.body.createTextRange();
                range.moveToElementText(node);
                range.select();
            } else if(window.getSelection) {
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(node);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                console.warn("Could not select text in node: Unsupported browser.");
            }
        }
    });
    return FindnReplace;
}));


