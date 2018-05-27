; (function ($, window, document, Util, undefined) {

    'use strict';

    /** Default values */
    var pluginName = 'mediumInsert',
        addonName = 'Separator', // first char is uppercase
        modal = document.getElementById('myModal'),
        defaults = {
            label: '<span class="fa fa-ellipsis-h"></span>',

        }

            /**
        * Separator between posts
        *
        * Sets options, variables and calls init() function
        *
        * @constructor
        * @param {DOM} el - DOM element to init the plugin on
        * @param {object} options - Options to override defaults
        * @return {void}
        */

    function Separator(el, options) {
        this.el = el;
        this.$el = $(el);
        this.templates = window.MediumInsert.Templates;
        this.core = this.$el.data('plugin_' + pluginName);

        this.options = $.extend(true, {}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        // Extend editor's functions
        //if (this.core.getEditor()) {
        //    this.core.getEditor()._serializePreEmbeds = this.core.getEditor().serialize;
        //    this.core.getEditor().serialize = this.editorSerialize;
        //}

        this.init();
    }

    /**
     * Initialization
     *
     * @return {void}
     */

    Separator.prototype.init = function () {
        var $separator = this.$el.find('.medium-insert-separator');

        $separator.attr('contenteditable', false);

        this.events();
        //this.backwardsCompatibility();
    };

    Separator.prototype.events = function () {
        $(document)
            .on('click', $.proxy(this, 'closeModal'));
    // When the user clicks on <span> (x), close the modal
        $('span.close')
            .on('click', $.proxy(this, 'closeModal'));
    };


    // When the user clicks anywhere outside of the modal, close it
    Separator.prototype.closeModal = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    
    Separator.prototype.add = function () {
        var $place = this.$el.find('.medium-insert-active');
        $place.addClass('medium-insert-separator');

        $place.html(this.templates['src/js/templates/core-empty-line.hbs']().trim());

        
        modal.style.display = "block";
    }
    
    $.fn[pluginName + addonName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName + addonName)) {
                $.data(this, 'plugin_' + pluginName + addonName, new Separator(this, options));
            }
        });
    };
    
    })(jQuery, window, document);
