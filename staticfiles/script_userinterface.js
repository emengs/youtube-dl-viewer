"use strict";
class UserInterfaceModel {
    constructor() {
        this.currentDropdownType = null;
        this.dropDownIDCounter = 10000;
        this.toastTimeoutID = null;
        this.dom_apppath_span = $('.apppath span');
        this.dom_font_test_header = $('#font_test_header');
        this.dom_apppath_dropdown = $('#apppath_dropdown');
        this.dom_apppath = $('.apppath');
        this.dom_apppath_icon = $('.apppath i');
        this.dom_option_dropdown = $('#option_dropdown');
        this.dom_dropdown_background = $('#dropdown_background');
        this.dom_toast = $('#toast');
    }
    init() {
        this.refreshPathCombobox();
        this.createPathDropDown();
        this.initPathDropdownWidth();
        this.initHeaderEvents();
    }
    createPathDropDown() {
        let html = '';
        for (const dir of App.VIDEOLIST.Values_DataDirs) {
            html += '<div class="row datadir_dropdown_row_' + dir.index + '" data-name="' + dir.name + '" data-idx="' + dir.index + '">' + escapeHtml(dir.name) + '</div>';
        }
        this.dom_apppath_dropdown.innerHTML = html;
    }
    initPathDropdownWidth() {
        let len_dropdown = 0;
        for (const n of App.VIDEOLIST.Values_DataDirs) {
            this.dom_font_test_header.innerText = n.name;
            len_dropdown = Math.max(len_dropdown, this.dom_font_test_header.clientWidth);
        }
        len_dropdown = (len_dropdown + 1 + 4 + 4 + 1 + 10 + 14);
        this.dom_apppath_dropdown.style.width = len_dropdown + "px";
        this.dom_apppath.classList.remove('invisible');
        this.dom_apppath.style.width = len_dropdown + "px";
        this.dom_apppath.style.float = "inherit";
    }
    initHeaderEvents() {
        var _a;
        $('.btn-display').addEventListener('click', () => {
            this.toggleOptionDropDown($('.btn-display'), 'DisplayMode', App.VIDEOLIST.Values_DisplayMode, App.VIDEOLIST.displaymode_current, v => { App.VIDEOLIST.setDisplayMode(v, true); });
        });
        $('.btn-width').addEventListener('click', () => {
            this.toggleOptionDropDown($('.btn-width'), 'WidthMode', App.VIDEOLIST.Values_WidthMode, App.VIDEOLIST.widthmode_current, v => { App.VIDEOLIST.setWidthMode(v, true); });
        });
        $('.btn-order').addEventListener('click', () => {
            this.toggleOptionDropDown($('.btn-order'), 'OrderMode', App.VIDEOLIST.Values_OrderMode, App.VIDEOLIST.ordermode_current, v => { App.VIDEOLIST.setOrderMode(v, true, true); });
        });
        $('.btn-loadthumbnails').addEventListener('click', () => {
            this.toggleOptionDropDown($('.btn-loadthumbnails'), 'ThumbnailMode', App.VIDEOLIST.Values_ThumbnailMode, App.VIDEOLIST.thumbnailmode_current, v => { App.VIDEOLIST.setThumbnailMode(v, true); });
        });
        $('.btn-videomode').addEventListener('click', () => {
            this.toggleOptionDropDown($('.btn-videomode'), 'VideoMode', App.VIDEOLIST.Values_VideoMode, App.VIDEOLIST.videomode_current, v => { App.VIDEOLIST.setVideoMode(v, true); });
        });
        $('.btn-theme').addEventListener('click', () => {
            this.toggleOptionDropDown($('.btn-theme'), 'Theme', App.VIDEOLIST.Values_Themes, App.VIDEOLIST.theme_current, v => { App.VIDEOLIST.setTheme(v, true); });
        });
        $('.btn-refresh').addEventListener('click', async () => {
            await App.VIDEOLIST.loadData();
        });
        $('#dropdown_background').addEventListener('click', () => {
            this.hideDropDown();
        });
        if (App.VIDEOLIST.Values_DataDirs.length > 1) {
            this.dom_apppath.addEventListener('click', () => {
                if (this.currentDropdownType === 'DataDir')
                    this.hideDropDown();
                else
                    this.showPathDropDown();
            });
            for (const dir of App.VIDEOLIST.Values_DataDirs) {
                (_a = $("#apppath_dropdown .datadir_dropdown_row_" + dir.index)) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                    this.hideDropDown();
                    App.VIDEOLIST.setDataDir(dir.index, true);
                });
            }
        }
    }
    toggleOptionDropDown(src, type, options, current, evt) {
        if (type === this.currentDropdownType)
            this.hideDropDown();
        else
            this.showOptionDropDown(src, type, options, current, evt);
    }
    showOptionDropDown(src, type, options, current, evt) {
        var _a;
        if (this.currentDropdownType !== null)
            this.hideDropDown();
        if (!App.VIDEOLIST.isLoaded())
            return;
        this.currentDropdownType = type;
        let ids = [];
        let html = '';
        for (const elem of options) {
            if (!elem.enabled)
                continue;
            const elemid = 'drow_' + (this.dropDownIDCounter++);
            let cls = 'row';
            if (elem.index === current)
                cls += ' active';
            html += '<div id="' + elemid + '" class="' + cls + '">' + escapeHtml(elem.text) + '</div>';
            ids.push([elem.index, elemid]);
        }
        this.dom_option_dropdown.innerHTML = html;
        this.dom_option_dropdown.style.right = '';
        this.dom_option_dropdown.classList.remove('hidden');
        const left_btn = src.getBoundingClientRect().left;
        const left_dd = this.dom_option_dropdown.getBoundingClientRect().left;
        if (left_btn < left_dd) {
            this.dom_option_dropdown.style.right = (document.documentElement.clientWidth - left_btn - this.dom_option_dropdown.getBoundingClientRect().width) + 'px';
        }
        else {
            // @ts-ignore
            this.dom_option_dropdown.style.right = '';
        }
        for (const [i, id] of ids) {
            (_a = $('#' + id)) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                this.hideDropDown();
                evt(i);
            });
        }
        this.dom_dropdown_background.classList.remove('hidden');
    }
    hideDropDown() {
        // datadir dropdown
        this.dom_apppath_icon.classList.add('fa-chevron-down');
        this.dom_apppath_icon.classList.remove('fa-chevron-up');
        this.dom_apppath_dropdown.classList.add('hidden');
        // option dropdown
        this.dom_option_dropdown.classList.add('hidden');
        // common
        this.dom_dropdown_background.classList.add('hidden');
        // --
        this.currentDropdownType = null;
    }
    showPathDropDown() {
        if (this.currentDropdownType !== null)
            this.hideDropDown();
        this.currentDropdownType = "DataDir";
        this.dom_apppath_icon.classList.remove('fa-chevron-down');
        this.dom_apppath_icon.classList.add('fa-chevron-up');
        this.dom_apppath_dropdown.classList.remove('hidden');
        this.dom_dropdown_background.classList.remove('hidden');
    }
    clearToast() {
        if (this.toastTimeoutID != null)
            clearTimeout(this.toastTimeoutID);
        this.dom_toast.classList.add('vanished');
        this.toastTimeoutID = null;
    }
    showToast(txt) {
        if (this.toastTimeoutID != null)
            clearTimeout(this.toastTimeoutID);
        this.dom_toast.innerText = txt;
        this.dom_toast.classList.add('vanished');
        this.dom_toast.classList.remove('active');
        this.toastTimeoutID = setTimeout(() => App.UI.clearToast(), 2000);
        setTimeout(() => { this.dom_toast.classList.remove('vanished'); this.dom_toast.classList.add('active'); }, 10);
    }
    refreshPathCombobox() {
        if (this.currentDropdownType !== null)
            this.hideDropDown();
        this.dom_apppath_span.innerHTML = escapeHtml(App.VIDEOLIST.getCurrentDataDir().name);
    }
}
