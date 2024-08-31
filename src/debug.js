import {global, breakdown, virtualTree, virtualHeaders, support_on, p_on} from './vars.js';
import { deepClone, adjustCosts, messageQueue, gameLoop } from './functions.js';
import {races, traits, virtualShapeShift} from './races.js';
import {craftCost, tradeRatio, atomic_mass, tradeBuyPrice, tradeSellPrice, virtualDrawResourceTab, virtualInitResourceTabs, virtualTradeSummary, virtualGalacticTrade, virtualInitMarket, virtualInitStorage} from './resources.js';
import {actions, checkAffordable, virtualDrawCity, virtualDrawEvolution, virtualDrawTech, virtualSetChallengeScreen} from './actions.js';
import {fuel_adjust, int_fuel_adjust, virtualDeepSpace, virtualGalaxySpace, virtualSpace} from './space.js';
import {shipCosts, virtualDrawShips, virtualRenderTauCeti} from './truepath.js';
import {f_rate, virtualLoadAlienSpaceStation, virtualLoadFactory, virtualLoadMiningShip, virtualLoadReplicator} from './industry.js';
import {armyRating, virtualDrawGovModal, virtualTaxRates} from './civics.js';
import { alevel } from './achieve.js';
import { loc } from './locale.js';
import {virtualBuildFortress, virtualDrawHellObservations, virtualDrawMechs, virtualRenderFortress} from "./portal";
import {virtualAppointGovernor} from "./governor";
import {virtualDefineJobs, virtualLoadFoundry, virtualLoadServants} from "./jobs";

export function enableDebug(){
    if (global.settings.expose){
        window.evolve = {
            /*actions: deepClone(actions),
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
            shipCosts: deepClone(shipCosts),
            updateDebugData: deepClone(updateDebugData),
            global: {},
            breakdown: {},
            virtualTree :virtualTree,
            virtualHeaders: virtualHeaders.slice(0,virtualHeaders.length-1)*/
            actions: actions,
            races: races,
            traits: traits,
            tradeRatio: tradeRatio,
            craftCost: craftCost(),
            atomic_mass: atomic_mass,
            f_rate: f_rate,
            checkAffordable: checkAffordable,
            adjustCosts: adjustCosts,
            armyRating: armyRating,
            tradeBuyPrice: tradeBuyPrice,
            tradeSellPrice: tradeSellPrice,
            fuel_adjust: fuel_adjust,
            int_fuel_adjust: int_fuel_adjust,
            alevel: alevel,
            messageQueue: messageQueue,
            loc: loc,
            shipCosts: shipCosts,
            updateDebugData: updateDebugData,
            global: {},
            breakdown: {},
            support_on: {},
            p_on: {},
            virtualTree :virtualTree,
            virtualHeaders: virtualHeaders.slice(0,virtualHeaders.length-1),
            gameLoop: gameLoop,
            virtualMethods:{
                virtualAppointGovernor: virtualAppointGovernor,
                virtualBuildFortress: virtualBuildFortress,
                virtualDeepSpace: virtualDeepSpace,
                virtualDefineJobs: virtualDefineJobs,
                virtualDrawCity: virtualDrawCity,
                virtualDrawEvolution: virtualDrawEvolution,
                virtualDrawGovModal: virtualDrawGovModal,
                virtualDrawHellObservations: virtualDrawHellObservations,
                virtualDrawMechs: virtualDrawMechs,
                virtualDrawShips: virtualDrawShips,
                virtualDrawTech: virtualDrawTech,
                virtualDrawResourceTab: virtualDrawResourceTab,
                virtualGalacticTrade: virtualGalacticTrade,
                virtualGalaxySpace: virtualGalaxySpace,
                virtualInitMarket: virtualInitMarket,
                virtualInitResourceTabs: virtualInitResourceTabs,
                virtualInitStorage: virtualInitStorage,
                virtualLoadAlienSpaceStation: virtualLoadAlienSpaceStation,
                virtualLoadMiningShip: virtualLoadMiningShip,
                virtualLoadFactory: virtualLoadFactory,
                virtualLoadFoundry: virtualLoadFoundry,
                virtualLoadReplicator: virtualLoadReplicator,
                virtualLoadServants: virtualLoadServants,
                virtualRenderFortress: virtualRenderFortress,
                virtualRenderTauCeti: virtualRenderTauCeti,
                virtualSetChallengeScreen: virtualSetChallengeScreen,
                virtualShapeShift: virtualShapeShift,
                virtualSpace: virtualSpace,
                virtualTaxRates: virtualTaxRates
            }
        };
    }
}

export function updateDebugData(){
    if (global.settings.expose){
        /*window.evolve.global = deepClone(global);
        window.evolve.virtualTree = virtualTree;
        window.evolve.virtualHeaders = virtualHeaders.slice(0,virtualHeaders.length-1);
        window.evolve.craftCost = deepClone(craftCost());
        window.evolve.breakdown = deepClone(breakdown);*/
        window.evolve.global = global;
        window.evolve.virtualTree = virtualTree;
        window.evolve.virtualHeaders = virtualHeaders.slice(0,virtualHeaders.length-1);
        window.evolve.craftCost = craftCost();
        window.evolve.breakdown = breakdown;
        window.evolve.support_on = support_on;
        window.evolve.p_on = p_on;
    }
}