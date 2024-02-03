import { global } from './../vars.js';
import { loc } from './../locale.js';
import { clearElement, svgIcons, svgViewBox, format_emblem, getBaseIcon, sLevel } from './../functions.js';
import { achievements, feats, universeAffix } from './../achieve.js';
import { races, biomes, genus_traits } from './../races.js';
import { monsters } from './../portal.js';
import { vBind, popover } from './../functions.js';
import {add2virtualWikiContent, add2virtualWikiTitle} from "./search";

export function renderAchievePage(zone, forSearch){
    if(forSearch){
        achievePage(null, null, true);
        featPage(true);
        return;
    }
    let content = $(`#content`);
    clearElement(content);

    switch (zone){
        case 'list':
            achievePage();
            break;
        case 'feats':
            featPage();
            break;
    }
}

const universeExclusives = {
    cross: ['antimatter'],
    vigilante: ['evil'],
    squished: ['micro'],
    macro: ['micro'],
    marble: ['micro'],
    double_density: ['heavy'],
    heavyweight: ['heavy'],
    whitehole: ['standard'],
    heavy: ['heavy'],
    canceled: ['antimatter'],
    eviltwin: ['evil'],
    microbang: ['micro'],
    pw_apocalypse: ['magic'],
    pass: ['magic'],
    fullmetal: ['magic'],
    soul_sponge: ['magic'],
    nightmare: ['magic']
};

const achieveDescData = {
    trade: [750,50]
};

function achievePage(universe, filter, forSearch){

    let uAffix = universeAffix(universe || 'standard');

    let types = {};
    Object.keys(achievements).forEach(function (achievement){
        if (!universe || !universeExclusives[achievement] || universeExclusives[achievement].indexOf(universe) > -1){
            if (filter === 'missing' && global.stats.achieve[achievement] && global.stats.achieve[achievement][uAffix] && global.stats.achieve[achievement][uAffix] > 0) return;
            if (filter === 'obtained' && !(global.stats.achieve[achievement] && global.stats.achieve[achievement][uAffix] && global.stats.achieve[achievement][uAffix] > 0)) return;
            if (filter === 'incomplete' && universe && global.stats.achieve[achievement] && global.stats.achieve[achievement][uAffix] && global.stats.achieve[achievement][uAffix] > 4) return;
            if (filter === 'completed' && universe && !(global.stats.achieve[achievement] && global.stats.achieve[achievement][uAffix] && global.stats.achieve[achievement][uAffix] > 4)) return;
            if ((filter === 'incomplete' || filter === 'completed') && !universe) {
                let max = achievements[achievement].type === 'universe' ? 10 : 30;
                if (achievement === 'whitehole') max = 5;
                if (global.stats.achieve[achievement])
                    Object.keys(global.stats.achieve[achievement]).forEach(uni => max -= global.stats.achieve[achievement][uni]);
                if (filter === 'incomplete' && max <= 0) return;
                if (filter === 'completed' && max > 0) return;
            }

            if (types.hasOwnProperty(achievements[achievement].type)) {
                types[achievements[achievement].type].push(achievement);
            }
            else {
                types[achievements[achievement].type] = [achievement];
            }
        }
    });

    if(forSearch){
        Object.keys(types).forEach(function (type){
            types[type].forEach(function(achievement){
                let hash = "list-a_" + achievement;
                add2virtualWikiTitle(hash, achievements[achievement].name);
                add2virtualWikiContent(hash, `${loc(`wiki_achieve_${type}`)} | <span class="icons">${format_emblem(achievement,16,false,false,universe)}</span>`);
                achieveDescForSearch(achievement, global.stats.achieve[achievement] && global.stats.achieve[achievement][uAffix] && global.stats.achieve[achievement][uAffix] > 0, universe);
            });
        });
        return;
    }
    let content = $(`#content`);
    clearElement(content);
    
    let filtering = `
    <div id="filtering" class="b-tabs">
        <nav class="tabs">
            <ul>
                <li class="${filter ? '' : 'is-active'}"><a @click="filterSwap()">All</a></li>
                <li class="${filter && filter === 'missing' ? 'is-active' : ''}"><a @click="filterSwap('missing')">${loc('wiki_achievements_missing')}</a></li>
                <li class="${filter && filter === 'obtained' ? 'is-active' : ''}"><a @click="filterSwap('obtained')">${loc('wiki_achievements_obtained')}</a></li>
                <li class="${filter && filter === 'incomplete' ? 'is-active' : ''}"><a @click="filterSwap('incomplete')">${loc('wiki_achievements_incomplete')}</a></li>
                <li class="${filter && filter === 'completed' ? 'is-active' : ''}"><a @click="filterSwap('completed')">${loc('wiki_achievements_completed')}</a></li>
            </ul>
        </nav>
        <nav class="tabs">
            <ul>
                <li class="${universe ? '' : 'is-active'}"><a @click="universeSwap()">${loc('universe_all')}</a></li>
                <li class="${universe && universe === 'standard' ? 'is-active' : ''}"><a @click="universeSwap('standard')">${loc('universe_standard')}</a></li>
                <li class="${universe && universe === 'evil' ? 'is-active' : ''}"><a @click="universeSwap('evil')">${loc('universe_evil')}</a></li>
                <li class="${universe && universe === 'antimatter' ? 'is-active' : ''}"><a @click="universeSwap('antimatter')">${loc('universe_antimatter')}</a></li>
                <li class="${universe && universe === 'micro' ? 'is-active' : ''}"><a @click="universeSwap('micro')">${loc('universe_micro')}</a></li>
                <li class="${universe && universe === 'heavy' ? 'is-active' : ''}"><a @click="universeSwap('heavy')">${loc('universe_heavy')}</a></li>
                <li class="${universe && universe === 'magic' ? 'is-active' : ''}"><a @click="universeSwap('magic')">${loc('universe_magic')}</a></li>
            </ul>
        </nav>
    </div>
    `;
    
    content.append(filtering);
    
    vBind({
        el: `#filtering`,
        methods: {
            universeSwap(universe) {
                achievePage(universe, filter);
            },
            filterSwap(filter) {
                achievePage(universe, filter);
            }
        }
    });
    
    Object.keys(types).forEach(function (type){
        content.append($(`<h2 class="header achievements has-text-caution">${loc(`wiki_achieve_${type}`)}</h2>`));
        let list = $(`<div class="achieveList"></div>`);
        content.append(list);

        types[type].forEach(function(achievement){
            let achieve = $(`<div class="achievement"></div>`);
            list.append(achieve);

            let color = global.stats.achieve[achievement] && global.stats.achieve[achievement][uAffix] && global.stats.achieve[achievement][uAffix] > 0 ? 'warning' : 'fade';
            achieve.append(`<span id="a_${achievement}" class="achieve has-text-${color}">${achievements[achievement].name}</span>`);

            let emblems = format_emblem(achievement,16,false,false,universe);
            achieve.append(`<span class="icons">${emblems}</span>`);
            
            achieveDesc(achievement, color === 'warning' ? true : false, universe);
        });
    });
}

function featPage(forSearch){
    if(forSearch){
        Object.keys(feats).forEach(function (feat){
            let hash = "feats-f_" + feat;
            add2virtualWikiTitle(hash, feats[feat].name);
            let baseIcon = getBaseIcon(feat,'feat');
            let star = global.stats.feat[feat] > 1 ? `<p class="flair" title="${sLevel(global.stats.feat[feat])} ${loc(baseIcon)}"><svg class="star${global.stats.feat[feat]}" version="1.1" x="0px" y="0px" width="16px" height="16px" viewBox="${svgViewBox(baseIcon)}" xml:space="preserve">${svgIcons(baseIcon)}</svg></p>` : '';
            featDescForSearch(feat, global.stats.feat[feat] && global.stats.feat[feat], star);
        });
        return;
    }
    let content = $(`#content`);
    clearElement(content);

    let list = $(`<div class="achieveList"></div>`);
    content.append(list);

    Object.keys(feats).forEach(function (feat){
        let achieve = $(`<div class="achievement"></div>`);
        list.append(achieve);

        let color = global.stats.feat[feat] && global.stats.feat[feat] > 0 ? 'warning' : 'fade';
        let baseIcon = getBaseIcon(feat,'feat');
        let star = global.stats.feat[feat] > 1 ? `<p class="flair" title="${sLevel(global.stats.feat[feat])} ${loc(baseIcon)}"><svg class="star${global.stats.feat[feat]}" version="1.1" x="0px" y="0px" width="16px" height="16px" viewBox="${svgViewBox(baseIcon)}" xml:space="preserve">${svgIcons(baseIcon)}</svg></p>` : '';
        achieve.append(`<span id="f_${feat}" class="achieve has-text-${color}">${feats[feat].name}</span>${star}`);

        featDesc(feat, color === 'warning' ? true : false);
    });
}

function achieveDesc(achievement,showFlair,universe){
    let uAffix = universeAffix(universe || 'standard');
    
    let flair = showFlair ? `<div class="has-text-flair">${achievements[achievement].flair}</div>` : ``;
    if (achievement === 'mass_extinction' || achievement === 'vigilante'){
        let killed = `<div class="flexed wide">`;
        Object.keys(races).sort(function(a,b){
            if (races[a].hasOwnProperty('name') && races[b].hasOwnProperty('name')){
                return races[a].name.localeCompare(races[b].name);
            }
            else {
                return 0;
            }            
        }).forEach(function (key){
            if (key !== 'protoplasm' && (key !== 'custom' || (key === 'custom' && global.stats.achieve['ascended']))){
                if (global.stats.achieve[`extinct_${key}`] 
                    && (
                        achievement === 'mass_extinction'
                        ? global.stats.achieve[`extinct_${key}`][uAffix] >= 0
                        : global.stats.achieve[`extinct_${key}`].hasOwnProperty('e') && global.stats.achieve[`extinct_${key}`].e >= 0
                        )
                    ){
                    killed = killed + `<span class="wide iclr${global.stats.achieve[`extinct_${key}`][achievement === 'mass_extinction' ? [uAffix] : 'e']}">${races[key].name}</span>`;
                }
                else {
                    killed = killed + `<span class="wide has-text-danger">${races[key].name}</span>`;
                }
            }
        });
        killed = killed + `</div>`;
        popover(`a_${achievement}`,$(`<div class="has-text-label">${achievements[achievement].desc}</div><div>${loc(`wiki_achieve_${achievement}`)}</div>${killed}${flair}`),{
            wide: true
        });
    }
    else if (achievement === 'explorer'){
        let biome_list = `<div class="flexed">`;
        Object.keys(biomes).sort((a,b) => biomes[a].label.localeCompare(biomes[b].label)).forEach(function (key){
            if (!universe || (key !== 'hellscape' && key !== 'eden') || (key === 'hellscape' && universe !== 'evil') || (key === 'eden' && universe === 'evil')){
                if (global.stats.achieve[`biome_${key}`] && global.stats.achieve[`biome_${key}`][uAffix] >= 0){
                    biome_list = biome_list + `<span class="wide iclr${global.stats.achieve[`biome_${key}`][uAffix]}">${biomes[key].label}</span>`;
                }
                else {
                    biome_list = biome_list + `<span class="wide has-text-danger">${biomes[key].label}</span>`;
                }
            }
        });
        biome_list = biome_list + `</div>`;
        popover(`a_${achievement}`,$(`<div class="has-text-label">${achievements[achievement].desc}</div><div>${loc(`wiki_achieve_${achievement}`)}</div>${biome_list}${flair}`));
    }
    else if (achievement === 'creator' || achievement === 'heavyweight'){
        let genus = `<div class="flexed">`;
        Object.keys(genus_traits).sort().forEach(function (key){
            let label = ['carnivore','herbivore','omnivore'].includes(key) ? loc(`evo_${key}_title`) : loc(`genelab_genus_${key}`);
            if (achievement === 'creator' ? global.stats.achieve[`genus_${key}`] && global.stats.achieve[`genus_${key}`][uAffix] >= 0 : global.stats.achieve[`genus_${key}`] && global.stats.achieve[`genus_${key}`].h >= 0){
                genus = genus + `<span class="wide iclr${achievement === 'creator' ? global.stats.achieve[`genus_${key}`][uAffix] : global.stats.achieve[`genus_${key}`].h}">${label}</span>`;
            }
            else {
                genus = genus + `<span class="wide has-text-danger">${label}</span>`;
            }
        });
        genus = genus + `</div>`;
        popover(`a_${achievement}`,$(`<div class="has-text-label">${achievements[achievement].desc}</div><div>${loc(`wiki_achieve_${achievement}`)}</div>${genus}${flair}`));
    }
    else if (achievement === 'enlightenment'){
        let genus = {};
        if (global['pillars']){
            Object.keys(global.pillars).forEach(function(race){
                if (races[race]){
                    if (!genus[races[race].type] || global.pillars[race] > genus[races[race].type]){
                        genus[races[race].type] = global.pillars[race];
                    }
                }
            });
        }
        let checked = `<div class="flexed">`;    
        Object.keys(genus_traits).sort().forEach(function (key){
            let label = ['carnivore','herbivore','omnivore'].includes(key) ? loc(`evo_${key}_title`) : loc(`genelab_genus_${key}`);
            if (genus[key] && genus[key] >= 1){
                checked = checked + `<span class="wide iclr${genus[key]}">${label}</span>`;
            }
            else {
                checked = checked + `<span class="wide has-text-danger">${label}</span>`;
            }
        });
        checked = checked + `</div>`;
        popover(`a_${achievement}`,$(`<div class="wide has-text-label">${achievements[achievement].desc}</div><div>${loc(`wiki_achieve_${achievement}`)}</div>${checked}${flair}`));
    }
    else if (achievement === 'gladiator'){
        let defeated = `<div class="flexed wide">`;
        let list = {};
        if (global.stats['spire']){
            Object.keys(global.stats.spire).forEach(function(uni){
                if (!universe || uAffix === uni){
                    Object.keys(global.stats.spire[uni]).forEach(function(boss){
                        if (monsters[boss]){
                            if (!list.hasOwnProperty(boss) || list[boss] < global.stats.spire[uni][boss]){
                                list[boss] = global.stats.spire[uni][boss];
                            }
                        }
                    });
                }
            });
        }
        Object.keys(monsters).forEach(function (boss){
            if (list[boss] && list[boss] > 0){
                defeated = defeated + `<span class="swide iclr${list[boss]}">${loc(`portal_mech_boss_${boss}`)}</span>`;
            }
            else {
                defeated = defeated + `<span class="swide has-text-danger">${loc(`portal_mech_boss_${boss}`)}</span>`;
            }
        });
        defeated = defeated + `</div>`;
        popover(`a_${achievement}`,$(`<div class="has-text-label">${achievements[achievement].desc}</div><div>${loc(`wiki_achieve_${achievement}`)}</div>${defeated}${flair}`),{
            wide: true
        });
    }
    else if (achievement === 'banana'){
        let checklist = `<div class="list">`;
        checklist = checklist + `<div class="has-text-${global.stats.banana.b1[uAffix] ? `success` : `danger`}">${loc(`wiki_achieve_banana1`)}</div>`;
        checklist = checklist + `<div class="has-text-${global.stats.banana.b2[uAffix] ? `success` : `danger`}">${loc(`wiki_achieve_banana2`)}</div>`;
        checklist = checklist + `<div class="has-text-${global.stats.banana.b3[uAffix] ? `success` : `danger`}">${loc(`wiki_achieve_banana3`)}</div>`;
        checklist = checklist + `<div class="has-text-${global.stats.banana.b4[uAffix] ? `success` : `danger`}">${loc(`wiki_achieve_banana4`,[500])}</div>`;
        checklist = checklist + `<div class="has-text-${global.stats.banana.b5[uAffix] ? `success` : `danger`}">${loc(`wiki_achieve_banana5`,[50])}</div>`;
        checklist = checklist + `</div>`;
        popover(`a_${achievement}`,$(`<div class="has-text-label">${achievements[achievement].desc}</div><div>${loc(`wiki_achieve_${achievement}`)}</div>${checklist}${flair}`));
    }
    else if (achievement === 'pathfinder'){
        let path = `<div class="flexed">`;
        ['ashanddust','exodus','obsolete','bluepill','retired'].forEach(function (key){
            let label = loc(`achieve_${key}_name`);
            if (global.stats.achieve[key] && global.stats.achieve[key][uAffix] >= 5){
                path = path + `<span class="wide iclr${global.stats.achieve[key][uAffix]}">${label}</span>`;
            }
            else {
                path = path + `<span class="wide has-text-danger">${label}</span>`;
            }
        });
        path = path + `</div>`;
        popover(`a_${achievement}`,$(`<div class="has-text-label">${achievements[achievement].desc}</div><div>${loc(`wiki_achieve_${achievement}`)}</div>${path}${flair}`));
    }
    else if (achievement === 'overlord'){
        let wom_list = `<div class="flexed">`;
        let womling = {
            'subjugate': 'lord',
            'contact': 'friend',
            'introduced': 'god',
        };

        let uAffix = universeAffix(universe || 'standard');

        Object.keys(womling).forEach(function (key){
            if (global.stats.womling[womling[key]] && global.stats.womling[womling[key]][uAffix] > 0){
                wom_list = wom_list + `<span class="wide iclr5">${loc(`wiki_achieve_overlord_${key}`)}</span>`;
            }
            else {
                wom_list = wom_list + `<span class="wide has-text-danger">${loc(`wiki_achieve_overlord_${key}`)}</span>`;
            }
        });
        wom_list = wom_list + `</div>`;
        popover(`a_${achievement}`,$(`<div class="has-text-label">${achievements[achievement].desc}</div><div>${loc(`wiki_achieve_${achievement}`)}</div>${wom_list}${flair}`));
    }
    else if (achievement.includes('extinct_') && achievement.substring(8) !== 'custom'){
        let race = achievement.substring(8);
        popover(`a_${achievement}`,$(`<div class="has-text-label">${achievements[achievement].desc}</div><div>${loc('wiki_achieve_extinct_race',[loc(`race_${race}`)])}</div>${flair}`));
    }
    else if (achievement.includes('genus_')){
        let genus = achievement.substring(6);
        popover(`a_${achievement}`,$(`<div class="has-text-label">${achievements[achievement].desc}</div><div>${loc('wiki_achieve_genus_type',[loc(`genelab_genus_${genus}`)])}</div>${flair}`));
    }
    else if (achievement.includes('biome_') || achievement.includes('atmo_')){
        let planet = achievement.substring(achievement.indexOf('_') + 1);
        popover(`a_${achievement}`,$(`<div class="has-text-label">${achievements[achievement].desc}</div><div>${loc('wiki_achieve_planet_type',[achievement.substring(0,1) === 'b' ? loc(`biome_${planet}_name`) : loc(`planet_${planet}`)])}</div>${flair}`));
    }
    else {
        let desc = achieveDescData[achievement] ? loc(`wiki_achieve_${achievement}`,achieveDescData[achievement]) : loc(`wiki_achieve_${achievement}`);
        popover(`a_${achievement}`,$(`<div class="has-text-label">${achievements[achievement].desc}</div><div>${desc}</div>${flair}`));
    }
}

function achieveDescForSearch(achievement,showFlair,universe){
    let hash = "list-a_" + achievement;
    let uAffix = universeAffix(universe || 'standard');

    let flair = showFlair ? achievements[achievement].flair : false;
    if (achievement === 'mass_extinction' || achievement === 'vigilante'){
        let killed = [];
        let notKilled = [];
        Object.keys(races).sort(function(a,b){
            if (races[a].hasOwnProperty('name') && races[b].hasOwnProperty('name')){
                return races[a].name.localeCompare(races[b].name);
            }
            else {
                return 0;
            }
        }).forEach(function (key){
            if (key !== 'protoplasm' && (key !== 'custom' || (key === 'custom' && global.stats.achieve['ascended']))){
                if (global.stats.achieve[`extinct_${key}`]
                    && (
                        achievement === 'mass_extinction'
                            ? global.stats.achieve[`extinct_${key}`][uAffix] >= 0
                            : global.stats.achieve[`extinct_${key}`].hasOwnProperty('e') && global.stats.achieve[`extinct_${key}`].e >= 0
                    )
                ){
                    killed.push(races[key].name);
                }
                else {
                    notKilled.push(races[key].name);
                }
            }
        });
        add2virtualWikiContent(hash, achievements[achievement].desc);
        add2virtualWikiContent(hash, loc(`wiki_achieve_${achievement}`));
        if(killed.length > 0){
            add2virtualWikiContent(hash, `${loc("wiki_achievements_obtained")}: ${killed.join(", ")}`);
        }
        if(notKilled.length > 0){
            add2virtualWikiContent(hash, `${loc("wiki_achievements_missing")}: ${notKilled.join(", ")}`);
        }
        if(flair){
            add2virtualWikiContent(hash, flair);
        }
    }
    else if (achievement === 'explorer'){
        let biome_list = [];
        let notBiome_list = [];
        Object.keys(biomes).sort((a,b) => biomes[a].label.localeCompare(biomes[b].label)).forEach(function (key){
            if (!universe || (key !== 'hellscape' && key !== 'eden') || (key === 'hellscape' && universe !== 'evil') || (key === 'eden' && universe === 'evil')){
                if (global.stats.achieve[`biome_${key}`] && global.stats.achieve[`biome_${key}`][uAffix] >= 0){
                    biome_list.push(biomes[key].label);
                }
                else {
                    notBiome_list.push(biomes[key].label);
                }
            }
        });
        add2virtualWikiContent(hash, achievements[achievement].desc);
        add2virtualWikiContent(hash, loc(`wiki_achieve_${achievement}`));
        if(biome_list.length > 0){
            add2virtualWikiContent(hash, `${loc("wiki_achievements_obtained")}: ${biome_list.join(", ")}`);
        }
        if(notBiome_list.length > 0){
            add2virtualWikiContent(hash, `${loc("wiki_achievements_missing")}: ${notBiome_list.join(", ")}`);
        }
        if(flair){
            add2virtualWikiContent(hash, flair);
        }
    }
    else if (achievement === 'creator' || achievement === 'heavyweight'){
        let genus = [];
        let notGenus = [];
        Object.keys(genus_traits).sort().forEach(function (key){
            let label = ['carnivore','herbivore','omnivore'].includes(key) ? loc(`evo_${key}_title`) : loc(`genelab_genus_${key}`);
            if (achievement === 'creator' ? global.stats.achieve[`genus_${key}`] && global.stats.achieve[`genus_${key}`][uAffix] >= 0 : global.stats.achieve[`genus_${key}`] && global.stats.achieve[`genus_${key}`].h >= 0){
                genus.push(label);
            }
            else {
                notGenus.push(label);
            }
        });
        add2virtualWikiContent(hash, achievements[achievement].desc);
        add2virtualWikiContent(hash, loc(`wiki_achieve_${achievement}`));
        if(genus.length > 0){
            add2virtualWikiContent(hash, `${loc("wiki_achievements_obtained")}: ${genus.join(", ")}`);
        }
        if(notGenus.length > 0){
            add2virtualWikiContent(hash, `${loc("wiki_achievements_missing")}: ${notGenus.join(", ")}`);
        }
        if(flair){
            add2virtualWikiContent(hash, flair);
        }
    }
    else if (achievement === 'enlightenment'){
        let genus = {};
        if (global['pillars']){
            Object.keys(global.pillars).forEach(function(race){
                if (races[race]){
                    if (!genus[races[race].type] || global.pillars[race] > genus[races[race].type]){
                        genus[races[race].type] = global.pillars[race];
                    }
                }
            });
        }
        let checked = [];
        let notChecked = [];
        Object.keys(genus_traits).sort().forEach(function (key){
            let label = ['carnivore','herbivore','omnivore'].includes(key) ? loc(`evo_${key}_title`) : loc(`genelab_genus_${key}`);
            if (genus[key] && genus[key] >= 1){
                checked.push(label);
            }
            else {
                notChecked.push(label);
            }
        });
        add2virtualWikiContent(hash, achievements[achievement].desc);
        add2virtualWikiContent(hash, loc(`wiki_achieve_${achievement}`));
        if(checked.length > 0){
            add2virtualWikiContent(hash, `${loc("wiki_achievements_obtained")}: ${checked.join(", ")}`);
        }
        if(notChecked.length > 0){
            add2virtualWikiContent(hash, `${loc("wiki_achievements_missing")}: ${notChecked.join(", ")}`);
        }
        if(flair){
            add2virtualWikiContent(hash, flair);
        }
    }
    else if (achievement === 'gladiator'){
        let defeated = [];
        let notDefeated = [];
        let list = {};
        if (global.stats['spire']){
            Object.keys(global.stats.spire).forEach(function(uni){
                if (!universe || uAffix === uni){
                    Object.keys(global.stats.spire[uni]).forEach(function(boss){
                        if (monsters[boss]){
                            if (!list.hasOwnProperty(boss) || list[boss] < global.stats.spire[uni][boss]){
                                list[boss] = global.stats.spire[uni][boss];
                            }
                        }
                    });
                }
            });
        }
        Object.keys(monsters).forEach(function (boss){
            if (list[boss] && list[boss] > 0){
                defeated.push(loc(`portal_mech_boss_${boss}`));
            }
            else {
                notDefeated.push(loc(`portal_mech_boss_${boss}`));
            }
        });
        add2virtualWikiContent(hash, achievements[achievement].desc);
        add2virtualWikiContent(hash, loc(`wiki_achieve_${achievement}`));
        if(defeated.length > 0){
            add2virtualWikiContent(hash, `${loc("wiki_achievements_obtained")}: ${defeated.join(", ")}`);
        }
        if(notDefeated.length > 0){
            add2virtualWikiContent(hash, `${loc("wiki_achievements_missing")}: ${notDefeated.join(", ")}`);
        }
        if(flair){
            add2virtualWikiContent(hash, flair);
        }
    }
    else if (achievement === 'banana'){
        add2virtualWikiContent(hash, achievements[achievement].desc);
        add2virtualWikiContent(hash, loc(`wiki_achieve_${achievement}`));
        for(let i = 1; i < 6; i++) {
            if(global.stats.banana["b"+i][uAffix]){
                add2virtualWikiContent(hash, loc("wiki_achieve_banana"+i));
            }
        }
        if(flair){
            add2virtualWikiContent(hash, flair);
        }
    }
    else if (achievement === 'pathfinder'){
        let path = [];
        let notPath = [];
        ['ashanddust','exodus','obsolete','bluepill','retired'].forEach(function (key){
            let label = loc(`achieve_${key}_name`);
            if (global.stats.achieve[key] && global.stats.achieve[key][uAffix] >= 5){
                path.push(label);
            }
            else {
                notPath.push(label);
            }
        });
        add2virtualWikiContent(hash, achievements[achievement].desc);
        add2virtualWikiContent(hash, loc(`wiki_achieve_${achievement}`));
        if(path.length > 0){
            add2virtualWikiContent(hash, `${loc("wiki_achievements_obtained")}: ${path.join(", ")}`);
        }
        if(notPath.length > 0){
            add2virtualWikiContent(hash, `${loc("wiki_achievements_missing")}: ${notPath.join(", ")}`);
        }
        if(flair){
            add2virtualWikiContent(hash, flair);
        }
    }
    else if (achievement === 'overlord'){
        let wom_list = [];
        let notWom_list = [];
        let womling = {
            'subjugate': 'lord',
            'contact': 'friend',
            'introduced': 'god',
        };

        Object.keys(womling).forEach(function (key){
            if (global.stats.womling[womling[key]] && global.stats.womling[womling[key]][uAffix] > 0){
                wom_list.push(loc(`wiki_achieve_overlord_${key}`));
            }
            else {
                notWom_list.push(loc(`wiki_achieve_overlord_${key}`));
            }
        });
        add2virtualWikiContent(hash, achievements[achievement].desc);
        add2virtualWikiContent(hash, loc(`wiki_achieve_${achievement}`));
        if(wom_list.length > 0){
            add2virtualWikiContent(hash, `${loc("wiki_achievements_obtained")}: ${wom_list.join(", ")}`);
        }
        if(notWom_list.length > 0){
            add2virtualWikiContent(hash, `${loc("wiki_achievements_missing")}: ${notWom_list.join(", ")}`);
        }
        if(flair){
            add2virtualWikiContent(hash, flair);
        }
    }
    else if (achievement.includes('extinct_') && achievement.substring(8) !== 'custom'){
        let race = achievement.substring(8);
        add2virtualWikiContent(hash, achievements[achievement].desc);
        add2virtualWikiContent(hash, loc('wiki_achieve_extinct_race',[loc(`race_${race}`)]));
        if(flair){
            add2virtualWikiContent(hash, flair);
        }
    }
    else if (achievement.includes('genus_')){
        let genus = achievement.substring(6);
        add2virtualWikiContent(hash, achievements[achievement].desc);
        add2virtualWikiContent(hash, loc('wiki_achieve_genus_type',[loc(`genelab_genus_${genus}`)]));
        if(flair){
            add2virtualWikiContent(hash, flair);
        }
    }
    else if (achievement.includes('biome_') || achievement.includes('atmo_')){
        let planet = achievement.substring(achievement.indexOf('_') + 1);
        add2virtualWikiContent(hash, achievements[achievement].desc);
        add2virtualWikiContent(hash, loc('wiki_achieve_planet_type',[achievement.substring(0,1) === 'b' ? loc(`biome_${planet}_name`) : loc(`planet_${planet}`)]));
        if(flair){
            add2virtualWikiContent(hash, flair);
        }
    }
    else {
        add2virtualWikiContent(hash, achievements[achievement].desc);
        add2virtualWikiContent(hash, achieveDescData[achievement] ? loc(`wiki_achieve_${achievement}`,achieveDescData[achievement]) : loc(`wiki_achieve_${achievement}`));
        if(flair){
            add2virtualWikiContent(hash, flair);
        }
    }
}
function featDesc(feat,showFlair){
    let flair = showFlair ? `<div class="has-text-flair">${feats[feat].flair}</div>` : ``;
    if (feat === 'egghunt'){
        const date = new Date();
        let year = date.getFullYear();
        let eggs = `<div class="has-text-warning">${loc('wiki_feat_egghunt_found')}</div><div class="flexed">`;
        for (let i=1; i<=18; i++){
            let egg = global.special.egg[year][`egg${i}`] ? 'has-text-success' : 'has-text-danger';
            eggs = eggs + `<span class="${egg}">${loc('wiki_feat_egghunt_num',[i])}</span>`
        }
        eggs = eggs + `</div>`;
        popover(`f_${feat}`,$(`<div class="has-text-label">${feats[feat].desc}</div><div>${loc(`wiki_feat_${feat}`)}</div>${eggs}${flair}`));
    }
    else if (feat === 'trickortreat'){
        const date = new Date();
        let year = date.getFullYear();
        let tricks = `<div class="has-text-warning">${loc('wiki_feat_trickortreat_found')}</div><div class="flexed">`;
        for (let i=1; i<=7; i++){
            let treat = global.special.trick[year][`treat${i}`] ? 'has-text-success' : 'has-text-danger';   
            tricks = tricks + `<span class="wide ${treat}">${loc('wiki_feat_treat_num',[i])}</span>`
        }
        for (let i=1; i<=7; i++){
            let trick = global.special.trick[year][`trick${i}`] ? 'has-text-success' : 'has-text-danger';   
            tricks = tricks + `<span class="wide ${trick}">${loc('wiki_feat_trick_num',[i])}</span>`
        }
        tricks = tricks + `</div>`;
        popover(`f_${feat}`,$(`<div class="has-text-label">${feats[feat].desc}</div><div>${loc(`wiki_feat_${feat}`)}</div>${tricks}${flair}`));
    }
    else if (feat === 'equilibrium'){
        let species = {};
        if (global['pillars']){
            Object.keys(global.pillars).forEach(function(race){
                if (races[race]){
                    species[race] = global.pillars[race];
                }
            });
        }
        let checked = `<div class="flexed wide">`;    
        Object.keys(races).sort(function(a,b){
            if (races[a].hasOwnProperty('name') && races[b].hasOwnProperty('name')){
                return (races[a].name || 'Zombie').localeCompare(races[b].name);
            }
            else {
                return 0;
            }
        }).forEach(function (key){
            if (key !== 'protoplasm' && (key !== 'custom' || (key === 'custom' && global.stats.achieve['ascended']))){
                if (species[key] && species[key] >= 1){
                    checked = checked + `<span class="wide iclr${species[key]}">${races[key].name}</span>`;
                }
                else {
                    checked = checked + `<span class="wide has-text-danger">${races[key].name}</span>`;
                }
            }
        });
        checked = checked + `</div>`;
        popover(`f_${feat}`,$(`<div class="wide has-text-label">${feats[feat].desc}</div><div>${loc(`wiki_feat_${feat}`)}</div>${checked}${flair}`),{
            wide: true
        });
    }
    else {
        popover(`f_${feat}`,$(`<div class="has-text-label">${feats[feat].desc}</div><div>${loc(`wiki_feat_${feat}`)}</div>${flair}`));
    }
}
function featDescForSearch(feat,showFlair,star){
    let hash = "feats-f_" + feat;
    let flair = showFlair ? feats[feat].flair : false;
    if (feat === 'egghunt'){
        const date = new Date();
        let year = date.getFullYear();
        let eggs = [];
        let notEggs = [];
        for (let i=1; i<=18; i++){
            if(global.special.egg[year][`egg${i}`]){
                eggs.push(loc('wiki_feat_egghunt_num',[i]));
            }else{
                notEggs.push(loc('wiki_feat_egghunt_num',[i]));
            }
        }
        add2virtualWikiContent(hash, star + feats[feat].desc);
        add2virtualWikiContent(hash, loc(`wiki_feat_${feat}`));
        if(eggs.length > 0){
            add2virtualWikiContent(hash, `${year} ${loc("year")} ${loc("wiki_achievements_obtained")}: ${eggs.join(", ")}`);
        }
        if(notEggs.length > 0){
            add2virtualWikiContent(hash, `${year} ${loc("year")} ${loc("wiki_achievements_missing")}: ${notEggs.join(", ")}`);
        }
        if(flair){
            add2virtualWikiContent(hash, flair);
        }
    }
    else if (feat === 'trickortreat'){
        const date = new Date();
        let year = date.getFullYear();
        let tricks = [];
        let notTricks = [];
        for (let i=1; i<=7; i++){
            if(global.special.trick[year][`treat${i}`]){
                tricks.push(loc('wiki_feat_treat_num',[i]));
            }else{
                notTricks.push(loc('wiki_feat_treat_num',[i]));
            }
        }
        for (let i=1; i<=7; i++){
            if(global.special.trick[year][`trick${i}`]){
                notTricks.push(loc('wiki_feat_trick_num',[i]));
            }else{
                notTricks.push(loc('wiki_feat_trick_num',[i]));
            }
        }
        add2virtualWikiContent(hash, star + feats[feat].desc);
        add2virtualWikiContent(hash, loc(`wiki_feat_${feat}`));
        if(tricks.length > 0){
            add2virtualWikiContent(hash, `${year} ${loc("year")} ${loc("wiki_achievements_obtained")}: ${tricks.join(", ")}`);
        }
        if(notTricks.length > 0){
            add2virtualWikiContent(hash, `${year} ${loc("year")} ${loc("wiki_achievements_missing")}: ${notTricks.join(", ")}`);
        }
        if(flair){
            add2virtualWikiContent(hash, flair);
        }
    }
    else if (feat === 'equilibrium'){
        let species = {};
        if (global['pillars']){
            Object.keys(global.pillars).forEach(function(race){
                if (races[race]){
                    species[race] = global.pillars[race];
                }
            });
        }
        let checked = [];
        let notChecked = [];
        Object.keys(races).sort((a,b) => races[a].name?.localeCompare(races[b].name)).forEach(function (key){
            if (key !== 'protoplasm' && (key !== 'custom' || (key === 'custom' && global.stats.achieve['ascended']))){
                if (species[key] && species[key] >= 1){
                    checked.push(races[key].name);
                }
                else {
                    notChecked.push(races[key].name);
                }
            }
        });
        add2virtualWikiContent(hash, star + feats[feat].desc);
        add2virtualWikiContent(hash, loc(`wiki_feat_${feat}`));
        if(checked.length > 0){
            add2virtualWikiContent(hash, `${loc("wiki_achievements_obtained")}: ${checked.join(", ")}`);
        }
        if(notChecked.length > 0){
            add2virtualWikiContent(hash, `${loc("wiki_achievements_missing")}: ${notChecked.join(", ")}`);
        }
        if(flair){
            add2virtualWikiContent(hash, flair);
        }
    }
    else {
        popover(`f_${feat}`,$(`<div class="has-text-label">${feats[feat].desc}</div><div>${loc(`wiki_feat_${feat}`)}</div>${flair}`));
        add2virtualWikiContent(hash, star + feats[feat].desc);
        add2virtualWikiContent(hash, loc(`wiki_feat_${feat}`));
        if(flair){
            add2virtualWikiContent(hash, flair);
        }
    }
}
