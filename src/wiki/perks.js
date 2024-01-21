import { perkList } from './../achieve.js';
import { sideMenu } from './functions.js';
import { add2virtualWikiContent, add2virtualWikiTitle } from "./search";

export function perksPage(content, forSearch = false){
    if(forSearch){
        Object.keys(perkList).forEach(function (perk){
            perkDesc(null, perk, forSearch);
        });
        return;
    }
    let mainContent = $(`<div></div>`);
    let perkContent = sideMenu('create',mainContent);
    content.append(mainContent);

    Object.keys(perkList).forEach(function (perk){
        perkDesc(perkContent, perk);
        sideMenu('add',`perks-prestige`,`${perk}`,perkList[perk].name);
    });
}

function perkDesc(content, perk, forSearch){
    if(forSearch){
        let hash = `perks-${perk}`;
        add2virtualWikiTitle(hash, perkList[perk].name);
        if (perkList[perk].hasOwnProperty('group')){
            perkList[perk].group.forEach(function(subperk){
                add2virtualWikiContent(hash, subperk.desc(true), true);
            });
        }
        else {
            add2virtualWikiContent(hash, perkList[perk].desc(true), true);
        }
        if (perkList[perk].notes.length > 0){
            perkList[perk].notes.forEach(function(note){
                add2virtualWikiContent(hash, note, true);
            });
        }
        return;
    }
    let perkbox = $(`<div id="${perk}" class="infoBox"></div>`);
    if (perkList[perk].hasOwnProperty('group')){
        let gperk = $(`<div><div class="has-text-warning">${perkList[perk].name}</div></div>`);
        perkList[perk].group.forEach(function(subperk){
            gperk.append($(`<div class="perk has-text-${subperk.active() ? `success`: `danger`}">${subperk.desc(true)}</div>`));
        });
        perkbox.append(gperk);
    }
    else {
        perkbox.append($(`<div class="has-text-warning">${perkList[perk].name}</div><div class="has-text-${perkList[perk].active() ? `success`: `danger`}">${perkList[perk].desc(true)}</div>`));
    }
    if (perkList[perk].notes.length > 0){
        let notes = $(`<div class="extra"></div>`);
        perkList[perk].notes.forEach(function(note){
            notes.append(`<div>${note}</div>`);
        });
        perkbox.append(notes);
    }
    content.append(perkbox);
}