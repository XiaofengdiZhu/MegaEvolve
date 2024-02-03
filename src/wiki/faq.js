import { global } from './../vars.js';
import { loc } from './../locale.js';
import { clearElement } from './../functions.js';
import { races } from './../races.js';
import {add2virtualWikiContent, add2virtualWikiTitle} from "./search";

export function faqPage(forSearch = false){
    let questions = [
        'update','hotkeys','sethotkeys','offline','moonphase','orbital','lumber','farm',
        'steel','aluminium','titanium','titanium_balorg','polymer','mythril','neutronium',
        'adamantite','infernite','graphene','stanene','aerogel','crates','soft_reset',
        'hard_reset','combat','morale','stress','genetic_decay','cache','aphrodisiac',
        'religion','tax_riots','race','weather','sundial','plasmid','plasmid_keep','plasmid_earn',
        'crispr','creep','phage','phage_earn','phage_benefit','anti_plasmids','temple',
        'temple_break','demonic','celestial','mastery','challenges','perks','feats','support',
        'micro','valdi','quantum','quantum_level','exotic','soul_gem','soul_gem_spend',
        'hell_patrol','surveyors','defense','infusion','dark_energy'
    ];

    let values = {
        neutronium: [races[global.race.species].solar.gas_moon],
    };

    if(forSearch) {
        for (let i = 0; i < questions.length; i++) {
            let hash = `faq-faq${i+1}`;
            add2virtualWikiTitle(hash, `${loc("wiki_menu_faq")} ${("00"+(i+1)).slice(-2)}`);
            let tokens = [];
            if (values.hasOwnProperty(questions[i])) {
                tokens = values[questions[i]];
            }

            add2virtualWikiContent(hash, loc(`wiki_faq_q_${questions[i]}`));
            add2virtualWikiContent(hash, loc(`wiki_faq_a_${questions[i]}`, tokens));
        }
        return;
    }

    let content = $(`#content`);
    clearElement(content);

    for (let i=0; i<questions.length; i++){
        let qna = $(`<div class="question"></div>`);
        content.append(qna);
        let tokens = [];
        if (values.hasOwnProperty(questions[i])){
            tokens = values[questions[i]];
        }

        qna.append(`<h2 class="has-text-warning" id="faq${i+1}">${loc(`wiki_faq_q_${questions[i]}`)}</h2>`);
        qna.append(`<div>${loc(`wiki_faq_a_${questions[i]}`,tokens)}</div>`);
    }
}