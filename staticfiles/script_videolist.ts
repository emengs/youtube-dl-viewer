﻿interface OptionDef { text: string; keys: string[]; enabled: boolean;  }
interface CSSOptionDef extends OptionDef { css: string[]  }

interface DisplayModeDef   extends CSSOptionDef { }
interface OrderModeDef     extends OptionDef    { sort: (p:DataJSONVideo[]) => DataJSONVideo[] }
interface WidthModeDef     extends CSSOptionDef { }
interface ThumbnailModeDef extends OptionDef    { }
interface VideoModeDef     extends CSSOptionDef { }
interface ThemeDef         extends OptionDef    { url: string; name: string; }
interface DataDirDef       extends OptionDef    { name: string; }

interface DataJSONVideo
{
    has:                (key:string) => boolean;
    hasNonNull:         (key:string) => boolean;
    hasArrayWithValues: (key:string) => boolean;

    data: 
    {
        description: string|null,
        title: string|null,
        info: 
        {
            upload_date?: string|null;
            title?: string|null;
            categories?: string[];
            like_count?: number|null;
            dislike_count?: number|null;
            uploader?: string|null;
            channel_url?: string|null;
            uploader_url?: string|null;
            duration?: number|null;
            tags?: string[];
            webpage_url?: string|null;
            view_count?: number|null;
            extractor_key?: string|null;
            width?: number|null;
            height?: number|null;
        }
    }
    meta: 
    {
        cache_file: string|null;
        cached: boolean;
        cached_preview_fsize: number;
        cached_previews: boolean;
        cached_video_fsize: number;
        datadirindex: number;
        directory: string;
        ext_order_index: number|null;
        filename_base: string;
        path_description: string|null;
        path_json: string|null;
        path_thumbnail: string|null;
        path_video: string;
        path_video_abs: string;
        paths_subtitle: { [x: string]: string };
        previewscache_file: string|null;
        uid: string;
    }
}

interface DataJSON 
{
    meta: 
    { 
        htmltitle: string; 
        has_ext_order: boolean; 
        count_total: number; 
        count_info: number; 
        count_raw: number; 
        display_override: number|null;
        order_override: number|null;
        width_override: number|null;
        thumbnail_override: number|null;
        videomode_override: number|null; 
        theme_override: number|null;  
    };
    videos: DataJSONVideo[];
    missing: string[];
}

class VideoListModel
{
    
    Values_DisplayMode: DisplayModeDef[] =
    [
        { text: "ListStyle: Grid",      keys: ['grid',     '0' ], enabled: true, css: [ 'lstyle_grid'              ] },
        { text: "ListStyle: Compact",   keys: ['compact',  '1' ], enabled: true, css: [ 'lstyle_compact'           ] },
        { text: "ListStyle: Tabular",   keys: ['tabular',  '2' ], enabled: true, css: [ 'lstyle_tabular'           ] },
        { text: "ListStyle: Detailed",  keys: ['detailed', '3' ], enabled: true, css: [ 'lstyle_detailed'          ] },
        { text: "ListStyle: Grid (x2)", keys: ['gridx2',   '4' ], enabled: true, css: [ 'lstyle_grid', 'lstyle_x2' ] },
    ];

    Values_OrderMode: OrderModeDef[] = 
    [
        { text: "Sorting: Date [descending]",     keys: ['date-desc',     '0'  ], enabled: true,  sort: (p) => p.sort((a,b) => CompareUtil.sortcompare(a,b,'upload_date') * -1) },
        { text: "Sorting: Date [ascending]",      keys: ['date-asc',      '1'  ], enabled: true,  sort: (p) => p.sort((a,b) => CompareUtil.sortcompare(a,b,'upload_date') * +1) },
        { text: "Sorting: Title",                 keys: ['title',         '2'  ], enabled: true,  sort: (p) => p.sort((a,b) => CompareUtil.sortcompareData(a,b,'title'))  },
        { text: "Sorting: Category",              keys: ['cat',           '3'  ], enabled: true,  sort: (p) => p.sort((a,b) => CompareUtil.sortcompare(a,b,'categories')) },
        { text: "Sorting: Views",                 keys: ['views',         '4'  ], enabled: true,  sort: (p) => p.sort((a,b) => CompareUtil.sortcompare(a,b,'view_count')) },
        { text: "Sorting: Rating",                keys: ['rating',        '5'  ], enabled: true,  sort: (p) => p.sort((a,b) => CompareUtil.sortcompareDiv(a,b,'like_count','dislike_count') * -1) },
        { text: "Sorting: Uploader",              keys: ['uploader',      '6'  ], enabled: true,  sort: (p) => p.sort((a,b) => CompareUtil.sortcompare(a,b,'uploader')) },
        { text: "Sorting: External [descending]", keys: ['ext-desc',      '7'  ], enabled: false, sort: (p) => p.sort((a,b) => CompareUtil.sortcompareMeta(a,b,'ext_order_index') * -1) },
        { text: "Sorting: External [ascending]",  keys: ['ext-asc',       '8'  ], enabled: false, sort: (p) => p.sort((a,b) => CompareUtil.sortcompareMeta(a,b,'ext_order_index') * +1) },
        { text: "Sorting: Random",                keys: ['rand',          '9'  ], enabled: true,  sort: (p) => { shuffle(p, new SeedRandom(this.shuffle_seed)); return p; } },
        { text: "Sorting: Filename [ascending]",  keys: ['filename-asc',  '10' ], enabled: true,  sort: (p) => p.sort((a,b) => CompareUtil.sortcompareMeta(a,b,'filename_base') * +1) },
        { text: "Sorting: Filename [descending]", keys: ['filename-desc', '11' ], enabled: true,  sort: (p) => p.sort((a,b) => CompareUtil.sortcompareMeta(a,b,'filename_base') * -1) },
    ];

    Values_WidthMode: WidthModeDef[] = 
    [
        { text: "Width: Small",  keys: ['small',  '0' ], enabled: true, css: [ 'lstyle_width_small'  ] },
        { text: "Width: Medium", keys: ['medium', '1' ], enabled: true, css: [ 'lstyle_width_medium' ] },
        { text: "Width: Wide",   keys: ['wide',   '2' ], enabled: true, css: [ 'lstyle_width_wide'   ] },
        { text: "Width: Full",   keys: ['full',   '3' ], enabled: true, css: [ 'lstyle_width_full'   ] },
    ];

    Values_ThumbnailMode: ThumbnailModeDef[] =
    [
        { text: "Thumbnails: Off",               keys: ['off',         '0' ], enabled: true },
        { text: "Thumbnails: On (intelligent)",  keys: ['intelligent', '1' ], enabled: true },
        { text: "Thumbnails: On (sequential)",   keys: ['sequential',  '2' ], enabled: true },
        { text: "Thumbnails: On (parallel)",     keys: ['parallel',    '3' ], enabled: true },
    ];

    Values_VideoMode: VideoModeDef[] =
    [
        { text: "Playback: Disabled",                   keys: ['disabled',     '0' ], enabled: true,  css: [ 'lstyle_videomode_0', 'lstyle_videomode_disabled',     ] },
        { text: "Playback: Seekable raw file",          keys: ['raw-seekable', '1' ], enabled: true,  css: [ 'lstyle_videomode_1', 'lstyle_videomode_raw-seekable', ] },
        { text: "Playback: Raw file",                   keys: ['raw',          '2' ], enabled: true,  css: [ 'lstyle_videomode_2', 'lstyle_videomode_raw',          ] },
        { text: "Playback: Transcoded Webm stream",     keys: ['transcoded',   '3' ], enabled: false, css: [ 'lstyle_videomode_3', 'lstyle_videomode_transcoded',   ] },
        { text: "Playback: Download file",              keys: ['download',     '4' ], enabled: true,  css: [ 'lstyle_videomode_4', 'lstyle_videomode_download',     ] },
        { text: "Playback: VLC Protocol Link (stream)", keys: ['vlc-stream',   '5' ], enabled: true,  css: [ 'lstyle_videomode_5', 'lstyle_videomode_vlc-stream',   ] },
        { text: "Playback: VLC Protocol Link (local)",  keys: ['vlc-local',    '6' ], enabled: true,  css: [ 'lstyle_videomode_6', 'lstyle_videomode_vlc-local',    ] },
        { text: "Playback: Open original Webpage",      keys: ['url',          '7' ], enabled: true,  css: [ 'lstyle_videomode_7', 'lstyle_videomode_url',          ] },
    ];

    Values_Themes: ThemeDef[] = 
    [
        // ... dynamic: { text: "..", keys: [..] }
    ];

    Values_DataDirs: DataDirDef[] =
    [
        // ... dynamic: { text: "..", keys: [..], url: ".." }
    ];
    
    // ----------------------------------------
    
    displaymode_default: number = -1;
    displaymode_current: number = -1;

    ordermode_default: number = -1;
    ordermode_current: number = -1;

    widthmode_default: number = -1;
    widthmode_current: number = -1;

    thumbnailmode_default: number = -1;
    thumbnailmode_current: number = -1;

    videomode_default: number = -1;
    videomode_current: number = -1;

    theme_default: number = -1;
    theme_current: number = -1;

    datadir_default: number = -1;
    datadir_current: number = -1;
    
    // ----------------------------------------

    dom_content: HTMLElement;

    // ----------------------------------------

    shuffle_seed: string = Math.random().toString().replace(/[.,]/g, '').substr(1);

    current_data: DataJSON|null = null;
    data_loadid_counter: number = 10000;
    current_data_loadid: number|null = null;
    
    //isLoadingThumbnails = false;
    //
    //
    //
    //thumbnailInvocationCounter = 0;
    //currentAnimatedPreview = '';

    // ----------------------------------------

    constructor(optionsource: HTMLElement) 
    {
        this.dom_content = $('#content');

        this.Values_Themes   = JSON.parse(optionsource.getAttribute('data-themelist'));
        this.Values_DataDirs = JSON.parse(optionsource.getAttribute('data-dirlist'));
        
        this.Values_VideoMode[3].enabled = (optionsource.getAttribute('data-has_ffmpeg').toLowerCase() === 'true');
        
        this.displaymode_current   = this.displaymode_default   = this.getIndexFromKey("DisplayMode",   this.Values_DisplayMode,   optionsource.getAttribute('data-displaymode'),   0);
        this.ordermode_current     = this.ordermode_default     = this.getIndexFromKey("OrderMode",     this.Values_OrderMode,     optionsource.getAttribute('data-ordermode'),     0);
        this.widthmode_current     = this.widthmode_default     = this.getIndexFromKey("WidthMode",     this.Values_WidthMode,     optionsource.getAttribute('data-widthmode'),     0);
        this.thumbnailmode_current = this.thumbnailmode_default = this.getIndexFromKey("ThumbnailMode", this.Values_ThumbnailMode, optionsource.getAttribute('data-thumbnailmode'), 0);
        this.videomode_current     = this.videomode_default     = this.getIndexFromKey("VideoMode",     this.Values_VideoMode,     optionsource.getAttribute('data-videomode'),     0);
        this.theme_current         = this.theme_default         = this.getIndexFromKey("Theme",         this.Values_Themes,        optionsource.getAttribute('data-theme'),         0);
        this.datadir_current       = this.datadir_default       = this.getIndexFromKey("DataDir",       this.Values_DataDirs,      optionsource.getAttribute('data-dir'),           0);
    }
    
    init()
    {
        for (const e of location.hash.replace('#','').split('&'))
        {
            const [key, val] = e.split('=');

            if (key === 'display')   this.displaymode_current   = this.getIndexFromKey("DisplayMode",   this.Values_DisplayMode,   val, this.displaymode_default);
            if (key === 'order')     this.ordermode_current     = this.getIndexFromKey("OrderMode",     this.Values_OrderMode,     val, this.ordermode_default);
            if (key === 'width')     this.widthmode_current     = this.getIndexFromKey("WidthMode",     this.Values_WidthMode,     val, this.widthmode_default);
            if (key === 'thumb')     this.thumbnailmode_current = this.getIndexFromKey("ThumbnailMode", this.Values_ThumbnailMode, val, this.thumbnailmode_default);
            if (key === 'videomode') this.videomode_current     = this.getIndexFromKey("VideoMode",     this.Values_VideoMode,     val, this.videomode_default);
            if (key === 'theme')     this.theme_current         = this.getIndexFromKey("Theme",         this.Values_Themes,        val, this.theme_default);
            if (key === 'dir')       this.datadir_current       = this.getIndexFromKey("DataDir",       this.Values_DataDirs,      val, this.datadir_default);
            if (key === 'seed')      this.shuffle_seed          = val;
        }

        this.loadData().then(()=>{});
    }

    isLoaded()
    {
        return (this.current_data !== null);
    }
    
    async loadData()
    {
        this.current_data = null; 
        
        const loadid = this.data_loadid_counter++;
        this.current_data_loadid = loadid;

        try 
        {
            const response = await $ajax('GET', '/data/' + this.datadir_current + '/json');
            const json = JSON.parse(response.body) as DataJSON;
            if (this.current_data_loadid !== loadid) { console.warn("Abort no longer valid loadData Task ("+this.current_data_loadid+" <> "+loadid+")"); return; }

            for (const vid of json.videos) 
            {
                vid.has                = function(key) { return Object.hasOwnProperty.call(this, key); };
                vid.hasNonNull         = function(key) { return this.has(key) && this[key] != null; };
                vid.hasArrayWithValues = function(key) { return this.hasNonNull(key) && Object.hasOwnProperty.call(this[key], 'length') && this[key].length > 0; };
            }
            
            this.current_data = json;

            this.Values_OrderMode[7].enabled = json.meta.has_ext_order;
            this.Values_OrderMode[7].enabled = json.meta.has_ext_order;

            if (json.meta.display_override   !== null) this.displaymode_current   = json.meta.display_override;
            if (json.meta.order_override     !== null) this.ordermode_current     = json.meta.order_override;
            if (json.meta.width_override     !== null) this.widthmode_current     = json.meta.width_override;
            if (json.meta.thumbnail_override !== null) this.thumbnailmode_current = json.meta.thumbnail_override;
            if (json.meta.videomode_override !== null) this.videomode_current     = json.meta.videomode_override;
            if (json.meta.theme_override     !== null) this.theme_current         = json.meta.theme_override;

            if (!this.getCurrentDisplayMode().enabled)   this.displaymode_current   = this.displaymode_default;
            if (!this.getCurrentOrderMode().enabled)     this.ordermode_current     = this.ordermode_default;
            if (!this.getCurrentWidthMode().enabled)     this.widthmode_current     = this.widthmode_default;
            if (!this.getCurrentThumbnailMode().enabled) this.thumbnailmode_current = this.thumbnailmode_default;
            if (!this.getCurrentVideoMode().enabled)     this.videomode_current     = this.videomode_default;
            if (!this.getCurrentTheme().enabled)         this.theme_current         = this.theme_default;

            this.recreateDOM();
        } 
        catch (e) 
        {
            App.showToast('Could not load data');
            console.error(e);
        }
    }

    recreateDOM()
    {
        let videos = this.current_data.videos;

        videos = this.getCurrentOrderMode().sort(videos);

        let html = '';
        
        //TODO
    }
    
    updateHash()
    {
        let hash = [];

        if (this.displaymode_current   !== this.displaymode_default)   hash.push('display='   + this.displaymode_current);
        if (this.ordermode_current     !== this.ordermode_default)     hash.push('order='     + this.ordermode_current);
        if (this.widthmode_current     !== this.widthmode_default)     hash.push('width='     + this.widthmode_current);
        if (this.thumbnailmode_current !== this.thumbnailmode_default) hash.push('thumb='     + this.thumbnailmode_current);
        if (this.videomode_current     !== this.videomode_default)     hash.push('videomode=' + this.videomode_current);
        if (this.theme_current         !== this.theme_default)         hash.push('theme='     + this.theme_current);
        if (this.datadir_current       !== this.datadir_default)       hash.push('dir='       + this.datadir_current);
        if (this.ordermode_current     === 9)                          hash.push('seed='      + this.shuffle_seed);

        location.hash = hash.join('&');
    }
    
    getIndexFromKey(type: string, values: OptionDef[], key: string, fallback: number): number
    {
        for (let i = 0; i < values.length; i++)
        {
            if (values[i].keys.includes(key)) return i;
        }
        
        const err = "Invalid value '"+key+"' for type '"+type+"' using fallback '"+fallback+"'";
        console.warn(err)
        App.showToast(err)
        return fallback;
    }
    
    setDisplayMode(key: number|string, showtoast: boolean = false)
    {
        const value = this.getIndexFromKey("DisplayMode", this.Values_DisplayMode, key.toString(), this.displaymode_default); 
        
        if (value === this.displaymode_current) return;
        
        this.displaymode_current = value;

        for (const v of this.Values_DisplayMode) this.dom_content.classList.remove(...v.css);
        this.dom_content.classList.add(...this.Values_DisplayMode[this.displaymode_current].css);
        
        if (showtoast) App.showToast(this.Values_DisplayMode[value].text);
        
        this.updateHash();
    }

    setOrderMode(key: number|string, showtoast: boolean = false)
    {
        const value = this.getIndexFromKey("OrderMode", this.Values_OrderMode, key.toString(), this.ordermode_default);

        if (value === this.ordermode_current) return;

        this.ordermode_current = value;

        if (showtoast) App.showToast(this.Values_OrderMode[value].text);

        this.updateHash();
        this.recreateDOM();
    }

    setWidthMode(key: number|string, showtoast: boolean = false)
    {
        const value = this.getIndexFromKey("WidthMode", this.Values_WidthMode, key.toString(), this.widthmode_default);

        if (value === this.widthmode_current) return;

        this.widthmode_current = value;

        for (const v of this.Values_WidthMode) this.dom_content.classList.remove(...v.css);
        this.dom_content.classList.add(...this.Values_WidthMode[this.displaymode_current].css);

        if (showtoast) App.showToast(this.Values_WidthMode[value].text);

        this.updateHash();
    }

    setThumbnailMode(key: number|string, showtoast: boolean = false)
    {
        const value = this.getIndexFromKey("ThumbnailMode", this.Values_ThumbnailMode, key.toString(), this.thumbnailmode_default);

        if (value === this.thumbnailmode_current) return;

        this.thumbnailmode_current = value;

        if (showtoast) App.showToast(this.Values_WidthMode[value].text);

        this.updateHash();
        
        //TODO
    }

    setVideoMode(key: number|string, showtoast: boolean = false)
    {
        const value = this.getIndexFromKey("VideoMode", this.Values_VideoMode, key.toString(), this.videomode_default);

        if (value === this.videomode_current) return;

        this.videomode_current = value;

        for (const v of this.Values_VideoMode) this.dom_content.classList.remove(...v.css);
        this.dom_content.classList.add(...this.Values_VideoMode[this.videomode_current].css);

        if (showtoast) App.showToast(this.Values_VideoMode[value].text);

        this.updateHash();
    }

    setTheme(key: number|string, showtoast: boolean = false)
    {
        const value = this.getIndexFromKey("Theme", this.Values_Themes, key.toString(), this.theme_default);

        if (value === this.theme_current) return;

        this.theme_current = value;

        let new_theme = this.Values_Themes[value].url;
        $('#theme_style_obj').setAttribute('href', new_theme);

        if (showtoast) App.showToast(this.Values_Themes[value].text);

        this.updateHash();
    }

    setDataDir(key: number|string, showtoast: boolean = false)
    {
        const value = this.getIndexFromKey("DataDir", this.Values_DataDirs, key.toString(), this.datadir_default);

        if (value === this.datadir_current) return;

        this.datadir_current = value;

        if (showtoast) App.showToast(this.Values_DataDirs[value].text);

        App.USERINTERFACE.refreshPathCombobox();
        
        this.updateHash();
        this.loadData().then(() => { });
    }

    getCurrentDisplayMode():   DisplayModeDef   { return this.Values_DisplayMode[this.displaymode_current];     }
    getCurrentOrderMode():     OrderModeDef     { return this.Values_OrderMode[this.ordermode_current];         }
    getCurrentWidthMode():     WidthModeDef     { return this.Values_WidthMode[this.widthmode_current];         }
    getCurrentThumbnailMode(): ThumbnailModeDef { return this.Values_ThumbnailMode[this.thumbnailmode_current]; }
    getCurrentVideoMode():     VideoModeDef     { return this.Values_VideoMode[this.videomode_current];         }
    getCurrentTheme():         ThemeDef         { return this.Values_Themes[this.theme_current];                }
    getCurrentDataDir():       DataDirDef       { return this.Values_DataDirs[this.datadir_current];            }
}