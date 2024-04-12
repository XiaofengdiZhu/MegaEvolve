import { gamePlayPage } from "./gameplay";
import { loc } from "../locale";
import { mainPage, menuDispatch} from "./wiki";
import { faqPage } from "./faq";
import { changeList } from "./change";
import { prestigePage } from "./prestige";
import { eventsPage } from "./events";
import { speciesPage } from "./species";
import { renderStructurePage } from "./structures";
import { renderTechPage } from "./tech";
import { arpaPage } from "./arpa";
import { renderAchievePage } from "./achieve";

const reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source), removeStartHtmlRegExp = RegExp("<[^/][^>]+>", "g"), removeEndHtmlRegExp = RegExp("</\[^>]+>", "g");

let wrapper, button, popper, input, checkbox, result, vue;
let inited = false;
let isPopperOpened = false;
let isPopperAnimating = false;
let virtualWiki = {};

let sub2Main = {};
export function initSearch(parent){
    document.getElementsByTagName("body")[0].append($(`<div id="popperWrapper"></div>`)[0]);
    parent.append('<button id="searchButton" class="button">🔍</button>');
    parent.append(`<div id='searchPopper'>
            <input id='searchPopperInput' class='input' placeholder="${loc('wiki_search_placeholder')}" v-model="searchString" v-on:input="inputChanged">
            <b-switch size="is-small" id="searchPopperCheckBox" title="${loc('wiki_search_regex')}" v-model="useRegex" v-on:input="inputChanged"></b-switch>
            <div id="searchPopperResult" class="dropdown-content" ref="searchPopperResult" v-on:scroll="scrollHandle">
                <b-loading :is-full-page="false" v-model="isLoading"></b-loading>
                <div id="searchPopperResultContainer" :style="listBlankPadding">
                    <div v-for="result in resultsForShow" :key="result.hash" class="searchPopperResultItem">
                        <div class="searchPopperResultTitle">
                         <a class="searchPopperResultMainTitle dropdown-item" v-on:click="gotoHash(result.hash)">{{result.title}}</a>
                            <a class="searchPopperResultSubTitle has-text-success dropdown-item" v-on:click="gotoHash(result.hash,true)">{{result.sub}}</a>
                            <div class="searchPopperResultSubTitle has-text-label" v-if="result.showMain">{{result.main}}</div>
                        </div>
                        <div class="searchPopperResultContent">
                            <div v-for="(paragraph, index) in result.content" :key="result.hash+index" class="searchPopperResultContentParagraph" v-on:click="gotoHash(result.hash)" v-html="paragraph"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>`);
    vue = new Vue({
        el: '#searchPopper',
        data: {
            searchString: "",
            lastSearchString: "",
            searchRegexps: null,
            useRegex: false,
            filteredResults: [],
            isLoading: true,
            start: 0,
            showCount: 0,
            resultDefaultHeight: 120
        },
        methods:{
            inputChanged: function (){
                let searchString = this.searchString.trim();
                if(searchString.length === 0){
                    this.filteredResults = Object.keys(virtualWiki).map(e=>virtualWiki[e]);
                    this.lastSearchString = "";
                    this.searchRegexps = null;
                    return;
                }
                if(searchString === this.lastSearchString){
                    return;
                }
                this.lastSearchString = searchString;
                this.filteredResults = [];
                this.searchRegexps = [];
                if(this.useRegex){
                    this.searchRegexps.push(new RegExp(searchString, "ig"));
                }else if(/\S \S/.test(searchString)){
                    searchString.split(" ").forEach(str=>{
                        this.searchRegexps.push(new RegExp(escapeRegExp(str), "ig"));
                    });
                }else{
                    this.searchRegexps.push(new RegExp(escapeRegExp(searchString), "ig"));
                }
                for(let hash in virtualWiki){
                    let content = [];
                    virtualWiki[hash].content?.forEach(paragraph => {
                        for (let regexp of this.searchRegexps) {
                            if (!regexp.test(paragraph)) {
                                return;
                            }
                        }
                        if(!paragraph.includes("</")){
                            for (let regexp of this.searchRegexps) {
                                paragraph = paragraph.replace(regexp, `<span class="has-text-warning">\$\&</span>`);
                            }
                        }
                        content.push(paragraph);
                    });
                    if(content.length === 0){
                        let title = virtualWiki[hash].title;
                        let flag = true;
                        for (let regexp of this.searchRegexps) {
                            if (!regexp.test(title)) {
                                flag = false;
                                break;
                            }
                        }
                        if(flag){
                            content.push(title);
                        }
                    }
                    if(content.length > 0){
                        let result = virtualWiki[hash];
                        this.filteredResults.push({
                            hash: result.hash,
                            title: result.title,
                            sub: result.sub,
                            main: result.main,
                            showMain: result.showMain,
                            content: content
                        });
                    }
                }
                this.$refs["searchPopperResult"].scrollTop = 0;
            },
            gotoHash: function(hash, isSub = false){
                let array = hash.split('-');
                hideSearchPopper();
                let sub = array[0];
                if(sub.startsWith("tp_")){
                    sub = sub.slice(3);
                }
                let frag = array[1];
                if(frag && frag.endsWith("_tech")){
                    if(isSub){
                        menuDispatch("tech", sub);
                    }else{
                        menuDispatch("tech", sub, frag.slice(0, -5));
                    }
                }else{
                    if(isSub){
                        menuDispatch(sub2Main[sub], sub);
                    }else{
                        menuDispatch(sub2Main[sub], sub, frag);
                    }
                }
                if(this.searchRegexps){
                    if (!CSS.highlights) {
                        console.log("CSS Custom Highlight API not supported.");
                        return;
                    }
                    CSS.highlights.clear();
                    let ranges = [];
                    let treeWalker = document.createTreeWalker(document.getElementById("content"), NodeFilter.SHOW_TEXT);
                    let currentNode = treeWalker.nextNode();
                    while (currentNode) {
                        if(currentNode instanceof Text) {
                            for (let regexp of this.searchRegexps) {
                                for (let match of currentNode.textContent.matchAll(regexp)) {
                                    let range = new Range();
                                    range.setStart(currentNode, match.index);
                                    range.setEnd(currentNode, match.index + match[0].length);
                                    ranges.push(range);
                                }
                            }
                            currentNode = treeWalker.nextNode();
                        }
                    }
                    CSS.highlights.set("search-results", new Highlight(...ranges));
                }
            },
            scrollHandle() {
                this.start = ~~(this.$refs["searchPopperResult"].scrollTop / this.resultDefaultHeight);
            },
            getResultHeight() {
                this.$nextTick(() => {
                    this.showCount = ~~(this.$refs["searchPopperResult"].offsetHeight / this.resultDefaultHeight) + 6;
                });
            }
        },
        computed: {
            end() {
                return this.filteredResults[this.start + this.showCount]
                    ? this.start + this.showCount
                    : this.filteredResults.length;
            },

            listBlankPadding() {
                return {
                    paddingTop: this.start * this.resultDefaultHeight + "px",
                    paddingBottom: (this.filteredResults.length - this.end) * this.resultDefaultHeight + "px",
                };
            },
            resultsForShow() {
                return this.filteredResults.slice(this.start, this.end);
            },
        },
        mounted() {
            window.onresize = this.getResultHeight;
        }
    });
    wrapper = document.getElementById("popperWrapper");
    popper = document.getElementById("searchPopper");
    input = document.getElementById("searchPopperInput");
    checkbox = document.getElementById("searchPopperCheckBox");
    result = document.getElementById("searchPopperResult");
    button = document.getElementById("searchButton");

    wrapper.addEventListener("click", toggleSearchPopper);
    button.addEventListener("click", toggleSearchPopper);
    button.addEventListener("mouseenter", showSearchPopper);
}

function showSearchPopper() {
    if(!isPopperAnimating && !isPopperOpened) {
        isPopperAnimating = true;
        button.setAttribute("popper-show", '');
        popper.setAttribute("popper-show", '');
        input.setAttribute("popper-show", '');
        checkbox.setAttribute("popper-show", '');
        setTimeout(() => {
            result.setAttribute("popper-show", '');
            wrapper.setAttribute("popper-show", '');
            setTimeout(() => {
                isPopperAnimating = false;
                initVirtualWiki(vue);
            }, 650);
        }, 400);
        isPopperOpened = true;
    }
}

function hideSearchPopper() {
    if(!isPopperAnimating && isPopperOpened) {
        isPopperAnimating = true;
        result.removeAttribute("popper-show");
        setTimeout(() => {
                wrapper.removeAttribute("popper-show");
                input.removeAttribute("popper-show");
                checkbox.removeAttribute("popper-show");
                setTimeout(() => {
                    button.removeAttribute("popper-show");
                    popper.removeAttribute("popper-show");
                    isPopperAnimating = false;
                }, 400);
        }, 600);
        isPopperOpened = false;
    }
}

function toggleSearchPopper() {
    if(!isPopperAnimating){
        isPopperOpened?hideSearchPopper():showSearchPopper();
    }
}

function initVirtualWiki(vue){
    if(inited)return;
    mainPage(true);
    faqPage(true);
    gamePlayPage(null, true);
    prestigePage(null, true);
    eventsPage(null, true);
    speciesPage(null, true);
    renderStructurePage(null, "standard", true);
    ["primitive","civilized","discovery","industrialized","globalized","early_space","deep_space","interstellar","intergalactic","dimensional"].forEach(era => renderTechPage(era, "standard", true));
    renderStructurePage(null, "truepath", true);
    ["primitive","civilized","discovery","industrialized","globalized","early_space","deep_space","solar","tauceti"].forEach(era => renderTechPage(null, "truepath", true));
    arpaPage(null, true);
    renderAchievePage(null, true);
    changeLog();
    for(let hash in virtualWiki){
        let array = hash.split('-');
        let sub = array[0];
        let subForLoc = sub;
        if(subForLoc.startsWith("tp_")){
            subForLoc = subForLoc.slice(3);
        }
        let frag = array[1];
        if(frag && frag.endsWith("_tech")){
            virtualWiki[hash].main = loc(`wiki_menu_tech`);
        }else{
            virtualWiki[hash].main = loc(`wiki_menu_${sub2Main[sub]}`);
        }
        virtualWiki[hash].sub = loc(`wiki_menu_${subForLoc}`);
        if(sub !== sub2Main[sub]){
            virtualWiki[hash].showMain = true;
        }
    }
    vue.$data.filteredResults = Object.keys(virtualWiki).map(e=>virtualWiki[e]);
    vue.$data.isLoading = false;
    vue.getResultHeight();
    inited = true;
}

export function add2virtualWikiContent(hash, content, removeHtml){
    if(removeHtml){
        content = content.replace(removeStartHtmlRegExp,"").replace(removeEndHtmlRegExp,"&emsp;");
    }
    if(virtualWiki[hash]){
        if(virtualWiki[hash].content){
            virtualWiki[hash].content.push(content);
        }else{
            virtualWiki[hash].content = [content];
        }
    }else{
        virtualWiki[hash] = {
            hash: hash,
            content: [content]
        };
    }
}

export function add2virtualWikiTitle(hash, title){
    if(virtualWiki[hash]){
        virtualWiki[hash].title = title;
    }else{
        virtualWiki[hash] = {
            hash: hash,
            title: title
        };
    }
}

export function addSub2Main(main, sub){
    sub2Main[sub] = main;
}

function escapeRegExp(string) {
    return (string && reHasRegExpChar.test(string))
        ? string.replace(reRegExpChar, '\\$&')
        : string;
}

function changeLog() {
    for (let i = 0; i < changeList.length; i++) {
        let hash = `changelog-changelog${i}`;
        let revision = changeList[i].hasOwnProperty('revision') ? changeList[i].revision : '';
        add2virtualWikiTitle(hash, `${changeList[i].version}${revision}`);
        add2virtualWikiContent(hash, changeList[i].date);

        for (let j = 0; j < changeList[i].changes.length; j++) {
            add2virtualWikiContent(hash, changeList[i].changes[j]);
        }
    }
}