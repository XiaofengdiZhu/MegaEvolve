import {global, breakdown, virtualTree, virtualHeaders} from './vars.js';
import { deepClone, adjustCosts, messageQueue } from './functions.js';
import { races, traits } from './races.js';
import { craftCost, tradeRatio, atomic_mass, tradeBuyPrice, tradeSellPrice } from './resources.js';
import { actions, checkAffordable } from './actions.js';
import { fuel_adjust, int_fuel_adjust } from './space.js';
import { f_rate } from './industry.js';
import { armyRating } from './civics.js';
import { alevel } from './achieve.js';
import { loc } from './locale.js';

export function enableDebug(){
    if (global.settings.expose){
        window.evolve = {
            actions: deepClone(actions),
            races: deepClone(races),
            traits: deepClone(traits),
            tradeRatio: deepClone(tradeRatio),
            craftCost: deepClone(craftCost()),
            atomic_mass: deepClone(atomic_mass),
            f_rate: deepClone(f_rate),
            checkAffordable: deepClone(checkAffordable),
            adjustCosts: deepClone(adjustCosts),
            armyRating: deepClone(armyRating),
            tradeBuyPrice: deepClone(tradeBuyPrice),
            tradeSellPrice: deepClone(tradeSellPrice),
            fuel_adjust: deepClone(fuel_adjust),
            int_fuel_adjust: deepClone(int_fuel_adjust),
            alevel: deepClone(alevel),
            messageQueue: deepClone(messageQueue),
            loc: deepClone(loc),
            updateDebugData: deepClone(updateDebugData),
            global: {},
            breakdown: {},
            virtualTree :virtualTree,
            virtualHeaders: virtualHeaders.slice(0,virtualHeaders.length-1),
        };
    }
}

export function updateDebugData(){
    if (global.settings.expose){
        window.evolve.global = deepClone(global);
        window.evolve.virtualTree = virtualTree;
        window.evolve.virtualHeaders = virtualHeaders.slice(0,virtualHeaders.length-1);
        window.evolve.craftCost = deepClone(craftCost()),
        window.evolve.breakdown = deepClone(breakdown);
    }
}