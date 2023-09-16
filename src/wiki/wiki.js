import { global, setGlobal, save } from './../vars.js';
import { loc } from './../locale.js';
import {} from './init.js';
import {} from './../achieve.js';
import { vBind, clearElement, tagEvent } from './../functions.js';
import { faqPage } from './faq.js';
import { speciesPage } from './species.js';
import { planetsPage } from './planets.js';
import { renderStructurePage } from './structures.js';
import { renderTechPage } from './tech.js';
import { renderAchievePage } from './achieve.js';
import { gamePlayPage } from './gameplay.js';
import { prestigePage } from './prestige.js';
import { eventsPage } from './events.js';
import { arpaPage } from './arpa.js';
import { changeLog } from './change.js';

$('body').empty();
initPage();

function initPage(){
    $('body').append($(`<h1 class="is-sr-only">${loc('wiki_menu_evolve')}</h1>`));

    let wiki = $(`<div id="main" class="main wiki"></div>`)
    $('body').append(wiki);

    let menu = $(`<div id="menu" class="mainMenu"></div>`);
    wiki.append(menu);

    let menuItems = [
        {
            key: 'intro',
        },
        {
            key: 'faq',
        },
        {
            key: 'gameplay',
            submenu: [
                { key: 'basics' },
                { key: 'mechanics' },
                { key: 'government' },
                { key: 'governor' },
                { key: 'combat' },
                { key: 'challenges' },
                { key: 'resets' },
                { key: 'planets' },
                { key: 'universes' },
                { key: 'hell' }                
            ]
        },
        {
            key: 'prestige',
            submenu: [
                { key: 'resets' },
                { key: 'resources' },
                { key: 'crispr' },
                { key: 'blood' },
                { key: 'perks' }
            ]
        },
        {
            key: 'events',
            submenu: [
                { key: 'major' },
                { key: 'minor' },
                { key: 'progress' },
                { key: 'special' }              
            ]
        },
        {
            key: 'species',
            submenu: [
                { key: 'races' },
                { key: 'traits' },
                { key: 'custom' }
            ]
        },
        {
            key: 'structures',
            submenu: [
                { key: 'prehistoric' },
                { key: 'planetary' },
                { key: 'space' },
                { key: 'interstellar' },
                { key: 'intergalactic' },
                { key: 'hell' }
            ]
        },
        {
            key: 'tech',
            submenu: [
                { key: 'primitive' },
                { key: 'civilized' },
                { key: 'discovery' },
                { key: 'industrialized' },
                { key: 'globalized' },
                { key: 'early_space' },
                { key: 'deep_space' },
                { key: 'interstellar' },
                { key: 'intergalactic' },
                { key: 'dimensional' }
            ]
        },
        {
            key: 'tp_structures',
            submenu: [
                { key: 'prehistoric' },
                { key: 'planetary' },
                { key: 'space' },
                { key: 'tauceti' }
            ]
        },
        {
            key: 'tp_tech',
            submenu: [
                { key: 'primitive' },
                { key: 'civilized' },
                { key: 'discovery' },
                { key: 'industrialized' },
                { key: 'globalized' },
                { key: 'early_space' },
                { key: 'deep_space' },
                { key: 'solar' },
                { key: 'tauceti' }
            ]
        },
        {
            key: 'arpa',
            submenu: [
                { key: 'projects' },
                //{ key: 'genetics' },
                { key: 'crispr' },
                { key: 'blood' }
            ]
        },
        {
            key: 'achievements',
            submenu: [
                { key: 'list' },
                { key: 'feats' }
            ]
        },
        {
            key: 'changelog',
        }
    ];

    let wikiMenu = `<template><b-menu class="sticky has-text-caution"><b-menu-list label="${loc('wiki_menu_evolve')}">`;
    wikiMenu = wikiMenu + buiildMenu(menuItems,true,false);
    wikiMenu = wikiMenu + `</b-menu-list></b-menu></template>`;
    menu.append(wikiMenu);

    var menuData = {};
    vBind({
        el: `#menu`,
        data: menuData,
        methods: {
            loadPage(main,sub){
                menuDispatch(main,sub);
            }
        }
    });

    let content = $(`<div id="content" class="mainContent"></div>`);
    wiki.append(content);

    if (window.location.hash){
        let hash = window.location.hash.substring(1).split('-');
        if (hash.length > 1){
            hash.length > 2 ? menuDispatch(hash[1],hash[0],hash[2]) : menuDispatch(hash[1],hash[0]);
        }
        else {
            menuDispatch(hash[0]);
        }
    }
    else {
        mainPage();
    }
}

function menuDispatch(main,sub,frag){
    $(`#content`).removeClass('flex');

    var global_data = save.getItem('evolved') || false;
    if (global_data){
        setGlobal(JSON.parse(LZString.decompressFromUTF16(global_data)));
    }

    tagEvent('page_view',{ page_title: `Evolve Wiki - ${main}` });

    switch (main){
        case 'intro':
            mainPage();
            window.location.hash = `#${main}`;
            break;

        case 'faq':
            faqPage();
            window.location.hash = `#${main}`;
            break;

        case 'gameplay':
            gamePlayPage(sub);
            setWindowHash(main,sub,frag);
            break;

        case 'prestige':
            prestigePage(sub);
            setWindowHash(main,sub,frag);
            break;

        case 'events':
            eventsPage(sub);
            setWindowHash(main,sub,frag);
            break;

        case 'species':
            switch (sub){
                case 'planets':
                    planetsPage();
                    break;
                default:
                    speciesPage(sub);
                    break;
            }
            setWindowHash(main,sub,frag);
            break;

        case 'structures':
            renderStructurePage(sub,'standard');
            setWindowHash(main,sub,frag);
            break;

        case 'tech':
            renderTechPage(sub,'standard');
            setWindowHash(main,sub,frag);
            break;

        case 'tp_structures':
            renderStructurePage(sub,'truepath');
            setWindowHash(main,sub,frag);
            break;

        case 'tp_tech':
            renderTechPage(sub,'truepath');
            setWindowHash(main,sub,frag);
            break;

        case 'arpa':
            arpaPage(sub);
            setWindowHash(main,sub,frag);
            break;

        case 'achievements':
            switch (sub){
                case 'tracker':
                    //loadTracker();
                    break;
                default:
                    renderAchievePage(sub);
                    break;
                }
                setWindowHash(main,sub,frag);
            break;

        case 'changelog':
            changeLog();
            window.location.hash = `#${main}`;
            break;
    }
}

function setWindowHash(main,sub,frag){
    if (typeof frag === 'undefined'){
        window.location.hash = `#${sub}-${main}`;
    }
    else {
        window.location.hash = `#${sub}-${main}-${frag}`;
        setTimeout(function(){
            document.getElementById(frag).scrollIntoView({
                block: 'start',
                behavior: 'smooth'
            });
        }, 125);
        
    }
}

function buiildMenu(items,set,parent){
    let hash = window.location.hash ? window.location.hash.substring(1).split('-') : false;

    let menu = ``;
    for (let i=0; i<items.length; i++){

        if (items[i].hasOwnProperty('submenu')){
            let active = (!hash && set && i === 0) || (hash && hash.length > 1 && hash[1] === items[i].key) ? ` :active="true" expanded` : '';
            menu = menu + `<b-menu-item${active}><template slot="label" slot-scope="props">${loc(`wiki_menu_${items[i].key}`)}</template>`;
            menu = menu + buiildMenu(items[i].submenu,false,items[i].key);
            menu = menu + `</b-menu-item>`;
        }
        else {
            let active = (!hash && set && i === 0) || (hash && hash[0] === items[i].key) ? ` :active="true"` : '';
            let args = parent ? `'${parent}','${items[i].key}'` : `'${items[i].key}',false`;
            menu = menu + `<b-menu-item${active} label="${loc(`wiki_menu_${items[i].key}`)}" @click="loadPage(${args})"></b-menu-item>`
        }
    }
    return menu;
}

function mainPage(){
    let content = $(`#content`);
    clearElement(content);

    let contribute = `<span class="has-text-caution">${['Beorseder','Rodrigodd','Volch'].join('</span>, <span class="has-text-caution">').replace(/, ([^,]*)$/, `, & $1`)}</span>`;

    let version = global['beta'] ? `beta v${global.version}.${global.beta}` : 'v'+global.version;
    content.append(`<div class="title has-text-warning">${loc(`wiki_main_title`)} - ${version}</div>`);
    content.append(`<div class="paragraph has-text-advanced">${loc(`wiki_main_author`,['Demagorddon'])}</div>`);
    content.append(`<div class="paragraph has-text-advanced">${loc(`wiki_megaevolve_author`)}</div>`);
    content.append(`<div class="paragraph has-text-danger">${loc(`wiki_main_spoiler`)}</div>`);
    content.append(`<div class="paragraph">${loc(`wiki_main_blurb`)}</div>`);
    content.append(`<div class="paragraph" style="line-height: 1.6em">This Version is based on pmotschmann/Evolve, I add speed-up feature and make some small UI changes to this awesome game(no values changed). I hope you will enjoy it! 这个版本基于pmotschmann/Evolve，我给这个超赞的游戏添加了加速功能，还做了一点界面调整（没有数值调整），希望你能享受它。<br/>
Thanks to g8hh/Evolve, I used it's strings.zh-CN.json(not totally).感谢g8hh/Evolve，我使用了它的strings.zh-CN.json（不完全照抄）。<br/>
For faster speed, you will need a powerful CPU with higher Single-Core performance.如果你想要更快的加速，需要有更强劲单核性能的CPU。<br/>
To display buildings, click the title of second row of tabs to refresh the building list. Other Tabs are same.显示建筑的方法是点击第二行标签栏的标题，这将刷新建筑列表，其他页面同理。<br/>
Or set the "自动刷新" option to "是" on the right top, but this will affect the speed factor.或者设置右上角的“自动刷新”选项为“是”，但是会影响加速。</div>`);
    content.append('<div class="paragraph">Discussion讨论：<br/><ul><li><a href="https://github.com/XiaofengdiZhu/evolve-electron/discussions" target="_blank">Github Discussion</a></li><li>QQ群：810936955</li></ul></div>')
    content.append(`<div class="paragraph has-text-warning">${loc(`wiki_main_contribution`,[contribute])}</div>`);
    content.append(`<div class="paragraph">${loc(`wiki_resources`)}</div>`);
    
    let list = $(`<ul class="paragraph"></ul>`);
    content.append(list);

    list.append(`<li class="paragraph"><a href="https://wooledge.org/~greg/evolve/guide.html" target="_blank">${loc(`wiki_resources_begin_guide`)}</a> ${loc(`wiki_resources_by`,['GreyCat'])}</li>`);
    list.append(`<li class="paragraph"><a href="https://shimo.im/sheets/1Q6Qt8BHhKYp12XH" target="_blank">${loc(`wiki_resources_begin_guide`)}</a> ${loc(`wiki_resources_by`,['季涟'])}</li>`);
    //list.append(`<li class="paragraph"><a href="https://karsen777.github.io/" target="_blank">${loc(`wiki_resources_tracker`)}</a> ${loc(`wiki_resources_by`,['Karsen777'])}</li>`);
    //list.append(`<li><a href="https://zarakon.github.io/EvolveHellSim/" target="_blank">${loc(`wiki_resources_hell_sim`)}</a> ${loc(`wiki_resources_by`,['Jotun'])}</li>`);
    list.append(`<li class="paragraph" style="font-size: 1.6rem"><a href="https://github.com/XiaofengdiZhu/evolve-electron/releases" target="_blank" style="font-weight: bold;">High speed desktop client 高速桌面客户端</a> ${loc(`wiki_resources_by`,['销锋镝铸'])}</li>`);
    list.append(`<li class="paragraph"><a href="https://github.com/XiaofengdiZhu/evolve-electron/tree/main/tampermonkeyScripts" target="_blank">Automate scripts for above client 上面客户端用的自动脚本</a> ${loc(`wiki_resources_by`,['销锋镝铸等'])}</li>`);
}
