// ==UserScript==
// @name         百万鼬仆刷鼠
// @version      0.1 for 超进化
// @author       销锋镝铸
// @match        http://localhost:4400/
// @match        https://xiaofengdizhu.github.io/MegaEvolve/
// @match        https://xiaofengdizhu.github.io/MegaEvolve/index.html
// @match        file:///*/MegaEvolve/index.html
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    //设置
    let enable = true;//是否启用本脚本
    let logAct = false;//是否输出建筑/研究日志
    let recordHistory = true;//是否记录之前100周目情况
    let softResetWhenStuck = false;//是否在卡住时软重置
    
    if(!enable) {
        return;
    }

    let game;
    let alertNotDisplayed1 = true, alertNotDisplayed2 = true;
    let womlingComeNotDone = true;
    let factoryNotAdjusted1 = true, factoryNotAdjusted2 = true, factoryNotAdjusted3 = true;
    let womlingComeDay, womlingLabDoneDay, womlingTechReach1Day, ringworldUnlockDay, edenCompleteDay;
    let womlingComeTime, womlingLabDoneTime, womlingTechReach1Time, ringworldUnlockTime, edenCompleteTime;

    function initialize() {
        game = window.evolve;
        if (typeof game === "undefined") {
            return false;
        }
        else {
            if (typeof window.stepByStep === "undefined") {
                if (alertNotDisplayed1) {
                    alertNotDisplayed1 = false;
                    window.alert("本脚本仅适配超进化最新版");
                }
                return false;
            }
            if (Object.keys(game.global).length === 0) {
                game.updateDebugData();
            }
            game.global.settings.pause = true;
            game.global.settings.tabLoad = true;
            if (evolve.global.resource.RNA.display) {
                step0() &&
                step1() &&
                step2() &&
                step3() &&
                step4();
            }
            else {
                if (alertNotDisplayed2) {
                    alertNotDisplayed2 = false;
                    window.alert("需要从生物进化页开始，建议软重置");
                }
                return false;
            }
        }
        return true;
    }

    if (!initialize()) {
        let gameReadyInterval = setInterval(() => {
            if (initialize()) {
                clearInterval(gameReadyInterval);
            }
        }, 100);
    }

    //开局第0.00天
    function step0() {
        let resourceRNA = game.global.resource.RNA;
        let actionRNA = game.actions.evolution.rna.action;
        let resourceDNA = game.global.resource.DNA;
        let actionDNA = game.actions.evolution.dna.action;
        for (let i = resourceDNA.amount; i < 208; i++) {//机+挑战基因+孤独幸存者所需DNA
            actionRNA();
            actionRNA();
            actionDNA();
            actionRNA();//让RNA数量和DNA数量一致
        }
        act("evolution-exterminate")//进化为机种族
        act("evolution-bunker")//打开挑战基因
        act("evolution-lone_survivor")//启用孤独幸存者
        //自定义种族所需DNA、RNA
        for (let i = resourceDNA.amount; i < 256; i++) {
            actionRNA();
            actionRNA();
            actionDNA();
        }
        for (let i = 0; i < 48; i++) {
            actionRNA();
        }
        act("evolution-custom")//进化为自定义种族
        act("evolution-s-dracnid")//仿制天龙
        //console.log("进化完成天数：" + game.global.stats.daysMega.toFixed(2))
        getVirtualElement("govModal").setGov("technocracy");//设置政体技术官僚
        getVirtualElement("tax_rates").sub(20)//设置税率0%
        act("tech-governor")//研究总督
        act("tech-alt_fanaticism")//研究狂热信仰
        act("tech-ancient_theology")//研究古代神学
        act("tech-deify")//研究神化先祖
        act("tech-replicator")//研究反物质复制器
        act("tech-outpost_boost")//研究外星前哨设备
        act("tauceti-orbital_station", 3);//合计4个轨道太空站
        act("tauceti-colony", 2);//合计3个定居点
        act("tauceti-fusion_generator", 2);//合计3个聚变发生器
        act("tauceti-tauceti_casino", 10);//合计10个赌场，等鼠来了再建6个
        //调整复制器
        game.virtualMethods.virtualLoadReplicator();
        let iReplicator = getVirtualElement("iReplicator");
        iReplicator.setVal("Unobtainium");//复制难得素
        iReplicator.more(387);//使用电量
        //任命总督
        game.virtualMethods.virtualAppointGovernor();
        let candidates = game.global.race.governor.candidates;
        for (let i = 0; i < 10; i++) {
            if (candidates[i].bg === "bureaucrat") {
                getVirtualElement("candidates").appoint(i);
            }
        }
        window.stepByStep();//进入0.05天
        return true;
    }

    //鼠来之前
    function step1() {
        //鼠来了也要先完成这些触发器，越下越后触发，需要先完成前面的
        let triggers1 = [
            {//研究认识邻居，然后为轨道平台腾出电力
                id: "tech-womling_unlock",
                count: 1,
                afterDone: () => {
                    getVirtualElement("iReplicator").less(10);
                }
            },
            {//请杰夫介绍
                id: "tauceti-introduce",
                count: 1,
                tab: "tau_red",
                afterDone: () => {
                    getVirtualElement("iReplicator").setVal("Oil");//复制器改为复制石油
                }
            },
            {//轨道平台
                id: "tauceti-orbital_platform",
                count: 5,
                tab: "tau_red"
            },
            {//牧师住宅
                id: "tauceti-overseer",
                count: 3,
                tab: "tau_red"
            },
            {//众鼬村庄
                id: "tauceti-womling_village",
                count: 5,
                tab: "tau_red"
            },
            {//众鼬农场
                id: "tauceti-womling_farm",
                count: 1,
                tab: "tau_red"
            },
            {//众鼬矿井
                id: "tauceti-womling_mine",
                count: 1,
                tab: "tau_red"
            },
            {//研究众鼬娱乐
                id: "tech-womling_fun",
                count: 1
            },
            {//圣地，鼠来了再建2个
                id: "tauceti-womling_fun",
                count: 1,
                tab: "tau_red"
            },
            {//研究天仓五种植，鼠没来最多到这
                id: "tech-tau_cultivation",
                count: 1
            }
        ];
        let count = 0;
        while (true) {
            //100天内完成
            if (count++ > 2000) {
                if (softResetWhenStuck) {
                    window.soft_reset();
                }
                return false;
            }
            if (womlingComeNotDone && game.global.race.servants && Object.keys(game.global.race.servants.jobs).length > 0) {//等待鼬仆就绪
                womlingCome();
            }
            if (doTriggers(triggers1)) {
                break;
            }
            else {
                window.stepByStep();
            }
        }
        return true;
    }

    function womlingCome() {
        womlingComeTime = Date.now();
        womlingComeDay = game.global.stats.daysMega.toFixed(2);
        //console.log(`[${womlingComeDay}]鼬仆已可用`);
        getVirtualElement("sshifter").setShape("heat");//拟态焰族
        getVirtualElement("servant-quarry_worker").add(500);//500鼬仆当石工
        getVirtualElement("servant-scavenger").add(game.global.race.servants.max - 500);//剩下鼬仆当拾荒者
        getVirtualElement("stack-Chrysotile")?.addCon("Chrysotile");//温石棉可能没储量，分配一个集装箱
        window.stepByStep();//防止拟态焰族没生效
        getVirtualElement("iReplicator").less(18);//给接下来要建的建筑腾出电力
        womlingComeNotDone = false;
    }

    //鼠来之后
    function step2() {
        //不需要先完成更上面的，但越下优先级越低
        let triggers2 = [
            {//圣地
                id: "tauceti-womling_fun",
                count: 2,
                tab: "tau_red"
            },
            {//研究众鼬科学
                id: "tech-womling_lab",
                count: 1,
                afterDone: () => {
                    getVirtualElement("iReplicator").setVal("Elerium");//复制器改为复制超铀
                }
            },
            {//众鼬农场
                id: "tauceti-womling_farm",
                count: 1,
                tab: "tau_red"
            },
            {//深空实验室6个，量力而行；完成后再造1个高新技术工厂
                id: "tauceti-womling_lab",
                count: 6,
                tab: "tau_red",
                afterDone: () => {
                    womlingLabDoneTime = Date.now();
                    womlingLabDoneDay = game.global.stats.daysMega.toFixed(2);
                    //console.log(`[${womlingLabDoneDay}]深空实验室已就绪`);
                    triggers2.push({
                        id: "tauceti-tau_factory",
                        count: 1,
                        tab: "tau_home"
                    });
                }
            },
            {//赌场
                id: "tauceti-tauceti_casino",
                count: 6,
                tab: "tau_home"
            },
            {//定居点
                id: "tauceti-colony",
                count: 2,
                tab: "tau_home"
            },
            {//研究天仓五制造
                id: "tech-tau_manufacturing",
                count: 1
            },
            {//高新技术工厂   
                id: "tauceti-tau_factory",
                count: 1,
                tab: "tau_home"
            },
            {//研究赌场老板
                id: "tech-iso_gambling",
                count: 1
            },
            {//研究文化中心
                id: "tech-cultural_center",
                count: 1,
                afterDone: () => {
                    //阶段研究全部完成，主角转职深坑矿工
                    getVirtualElement("civ-professor").sub(1);
                    getVirtualElement("civ-pit_miner").add(1);
                }
            },
            {//文化中心
                id: "tauceti-tau_cultural_center",
                count: 3,
                tab: "tau_home"
            },
            {//科学实验室，完成后再造4个文化中心
                id: "tauceti-infectious_disease_lab",
                count: 1,
                tab: "tau_home",
                afterDone: () => {
                    triggers2.push({
                        id: "tauceti-tau_cultural_center",
                        count: 4,
                        tab: "tau_home"
                    });
                }
            }
        ];
        let count = 0;
        while (true) {
            //5天内完成
            if (count++ > 100){
                if (softResetWhenStuck) {
                    window.soft_reset();
                }
                return false;
            }
            if (womlingComeNotDone) {
                if (game.global.race.servants && Object.keys(game.global.race.servants.jobs).length > 0) {//等待鼬仆就绪
                    womlingCome();
                }
                else {
                    window.stepByStep();
                    continue;//接下来操作都以鼬仆到了为前提
                }
            }
            adjustFactory();
            if (doTriggers(triggers2, true)) {
                break;
            }
            else {
                window.stepByStep();
            }
        }
        return true;
    }

    //众鼬科技等级达到1前后
    function step3() {
        let triggers3 = [
            {//研究小行星数据分析
                id: "tech-asteroid_analysis",
                count: 1
            },
            {//研究抗鲨措施
                id: "tech-shark_repellent",
                count: 1
            },
            {//巡逻船
                id: "tauceti-patrol_ship",
                count: 14,
                tab: "tau_roid"
            },
            {//研究天仓五小行星带采矿
                id: "tech-belt_mining",
                count: 1
            },
            {//矿石精炼厂
                id: "tauceti-ore_refinery",
                count: 7,
                tab: "tau_gas"
            },
            {//研究太空捕鲸
                id: "tech-space_whaling",
                count: 1
            },
            {//提取船
                id: "tauceti-mining_ship",
                count: 14,
                tab: "tau_roid",
                afterDone: () => {//提取船
                    game.virtualMethods.virtualLoadMiningShip();
                    getVirtualElement("tauRoidMiningShip").sub("rare", 47);//尽量挖奥利哈刚
                    getVirtualElement("iReplicator").setVal("Orichalcum");//复制器也改为复制奥利哈刚
                }
            },
            {//研究先进小行星带采矿
                id: "tech-adv_belt_mining",
                count: 1
            }
        ];
        let womlingTechReach1NotDone = true;
        let count = 0;
        while (true) {
            //10天内完成
            if (count++ > 200){
                if (softResetWhenStuck) {
                    window.soft_reset();
                }
                return false;
            }
            if (womlingTechReach1NotDone) {
                //等待众鼬科技等级
                if ((game.global.tech.womling_tech ?? 0) > 0) {
                    womlingTechReach1();
                    womlingTechReach1NotDone = false;
                }
                else {
                    window.stepByStep();
                    continue;
                }
            }
            adjustFactory();
            if (doTriggers(triggers3)) {
                break;
            }
            else {
                window.stepByStep();
            }
        }
        return true;
    }

    function womlingTechReach1() {
        womlingTechReach1Time = Date.now();
        womlingTechReach1Day = game.global.stats.daysMega.toFixed(2);
        //console.log(`[${womlingTechReach1Day}]众鼬科技等级达到1`);
        act("tech-system_survey");//调查天仓五
        act("tauceti-gas_contest");//气体巨星名字征集
        act("tauceti-roid_mission");//天仓五小行星带任务
        act("tauceti-gas_contest-a1");//新木星
        getVirtualElement("iReplicator").less(16);//给接下来要建的建筑腾出电力
        act("tauceti-refueling_station");//加气站
        //主角转职科学家
        getVirtualElement("civ-pit_miner").sub(1);
        getVirtualElement("civ-scientist").add(1);
    }

    //调查带外行星前后
    function step4() {
        let triggers4 = [
            {//研究出售xx
                id: "tech-food_culture",
                count: 1
            },
            {//研究先进矿石精炼厂
                id: "tech-advanced_refinery",
                count: 1
            },
            {//研究先进先进小行星采矿
                id: "tech-advanced_asteroid_mining",
                count: 1
            },
            {//环形世界，刷新研究界面，否则伊甸园研究出不来
                id: "tauceti-ringworld",
                count: 1000,
                tab: "tau_star",
                afterDone: () => {
                    game.virtualMethods.virtualDrawTech();
                }
            },
            {//研究伊甸园，完成可视为完成本周目，存档数据
                id: "tech-garden_of_eden",
                count: 1,
                afterDone: () => {
                    edenCompleteTime = Date.now();
                    edenCompleteDay = game.global.stats.daysMega.toFixed(2);
                    //console.log(`[${edenCompleteDay}]伊甸园研究完成`);
                    if (recordHistory) {
                        let history = JSON.parse(localStorage.getItem("historyByMillionWomling") ?? "[]");
                        if (history.length > 100) {
                            history = history.slice(history.length - 100, history.length - 1);
                        }
                        history.push({
                            womlingComeDay: womlingComeDay,
                            womlingComeTime: womlingComeTime,
                            womlingLabDoneDay: womlingLabDoneDay,
                            womlingLabDoneTime: womlingLabDoneTime,
                            womlingTechReach1Day: womlingTechReach1Day,
                            womlingTechReach1Time: womlingTechReach1Time,
                            edenCompleteDay: edenCompleteDay,
                            edenCompleteTime: edenCompleteTime,
                            ringworldUnlockDay: ringworldUnlockDay,
                            ringworldUnlockTime: ringworldUnlockTime
                        });
                        localStorage.setItem("historyByMillionWomling", JSON.stringify(history));
                    }
                }
            },
            {//伊甸园设施
                id: "tauceti-goe_facility",
                count: 1,
                tab: "tau_star"
            }
        ];
        let outerSurveyNotDone = true, ringworldUnlockNotDone = true;
        let count = 0;
        while (true) {
            //5天内完成
            if (count++ > 100){
                if (softResetWhenStuck) {
                    window.soft_reset();
                }
                return false;
            }
            if (outerSurveyNotDone) {
                //等待调查带外行星解锁
                if (game.global.tech.plague === 5) {
                    outerSurvey();
                    outerSurveyNotDone = false;
                }
                else {
                    window.stepByStep();
                    continue;
                }
            }
            //检测环形世界解锁并刷新天仓五页面
            if (ringworldUnlockNotDone && game.global.tech.matrix === 2) {
                ringworldUnlockTime = Date.now();
                ringworldUnlockDay = game.global.stats.daysMega.toFixed(2);
                //console.log(`[${ringworldUnlockDay}]环形世界已解锁`);
                game.virtualMethods.virtualRenderTauCeti();
                ringworldUnlockNotDone = false;
            }
            if (doTriggers(triggers4)) {
                break;
            }
            else {
                window.stepByStep();
            }
        }
        return true;
    }

    function outerSurvey() {
        act("tech-outer_tau_survey");//研究调查带外行星
        act("tauceti-gas_contest2");//2 号气体巨星名字征集
        act("tauceti-gas_contest-b1");//巨木星
        act("tauceti-alien_station_survey");//外星空间站（任务）
        act("tauceti-alien_station", 100);//外星空间站（修复）
        game.virtualMethods.virtualDrawTech();
        act("tech-alien_research");//研究研究外星人
        getVirtualElement("tauceti-alien_space_station").power_on(1);//启动外星空间站
        game.virtualMethods.virtualLoadAlienSpaceStation();
        getVirtualElement("tauGas2AlienStation").sub("focus", 45);
        getVirtualElement("iReplicator").more(333);//用外星空间站提供的额外电力复制
    }

    function adjustFactory() {
        let factory;
        //当有1个工厂
        if (factoryNotAdjusted1 && (game.support_on.tau_factory ?? 0) > 0) {
            game.virtualMethods.virtualLoadFactory()
            factory ??= getVirtualElement("iFactory");
            if (factory) {
                factory.addItem("Alloy", 1);
                factory.addItem("Polymer", 2);
                factory.addItem("Nano", 1);
                factory.addItem("Stanene", 1);
                factoryNotAdjusted1 = false;
            }
        }
        //当有2个工厂
        if (factoryNotAdjusted2 && game.support_on.tau_factory > 1) {
            factory ??= getVirtualElement("iFactory");
            factory.addItem("Alloy", 1);
            factory.addItem("Polymer", 2);
            factory.addItem("Nano", 1);
            factory.addItem("Stanene", 1);
            factoryNotAdjusted2 = false;
        }
        //工厂产物充足，关闭工厂
        if (factoryNotAdjusted3 && game.global.resource.Nano_Tube.amount > 22200000) {
            factory ??= getVirtualElement("iFactory");
            factory.subItem("Alloy", 2);
            factory.subItem("Polymer", 4);
            factory.subItem("Nano", 2);
            factory.subItem("Stanene", 2);
            factoryNotAdjusted3 = false;
        }
    }

    function getVirtualElement(id) {
        return game.virtualTree.find(el => el.id === id) ?? null;
    }

    function act(id, count = 1, tab = null, power = true) {
        //科技
        if (id.startsWith("tech")) {
            let elementInActions = game.actions.tech[id.split('-')[1]];
            if (game.global.tech[elementInActions.grant[0]] >= elementInActions.grant[1]) {
                return count;
            }
            if (game.checkAffordable(elementInActions)) {
                let elementInVirtual = getVirtualElement(id);
                if (elementInVirtual) {
                    elementInVirtual.action();
                    if (logAct) {
                        console.log(`[${game.global.stats.daysMega.toFixed(2)}]${typeof elementInActions.title === "function" ? elementInActions.title() : elementInActions.title} 研究完成`)
                    }
                    return count;
                }
            }
            return 0;
        }
        //有tab将会返回完成数量，操作会复杂得多
        if (tab) {
            let suffix = id.split('-')[1];
            let elementInActions = game.actions.tauceti[tab][suffix];
            let grant = elementInActions.grant;
            //任务
            if (grant) {
                if (game.global.tech[grant[0]] >= grant[1]) {
                    return count;
                }
                if (game.checkAffordable(elementInActions)) {
                    let elementInVirtual = getVirtualElement(id);
                    if (elementInVirtual) {
                        elementInVirtual.action();
                        if (logAct) {
                            console.log(`[${game.global.stats.daysMega.toFixed(2)}]${typeof elementInActions.title === "function" ? elementInActions.title() : elementInActions.title} 完成`)
                        }
                        return count;
                    }
                }
                return 0;
            }
            //一般建筑
            else {
                let elementInGlobal = game.global.tauceti[suffix];
                if (elementInGlobal) {
                    if (!game.checkAffordable(elementInActions)) {
                        return 0;
                    }
                    let startCount = elementInGlobal.count;
                    let elementInVirtual = getVirtualElement(id);
                    if (elementInVirtual === null) {
                        return 0;
                    }
                    elementInVirtual.action();//因为前面已经检查过1次是否可建造
                    let doneCount = 1;
                    for (; doneCount < count; doneCount++) {
                        if (game.checkAffordable(elementInActions)) {
                            elementInVirtual.action();
                        }
                        else {
                            break;
                        }
                    }
                    if (power && elementInVirtual.power_on) {
                        for (let i = 0; i < doneCount; i++) {
                            elementInVirtual.power_on();
                        }
                    }
                    if (logAct) {
                        console.log(`[${game.global.stats.daysMega.toFixed(2)}]${typeof elementInActions.title === "function" ? elementInActions.title() : elementInActions.title} 建造${doneCount}个`)
                    }
                    return doneCount;
                }
                return 0;
            }
        }
        //最简单的点击
        else {
            let elementInVirtual = getVirtualElement(id);
            if (elementInVirtual) {
                for (let i = 0; i < count; i++) {
                    elementInVirtual.action();
                }
                if (power && elementInVirtual.power_on) {
                    for (let i = 0; i < count; i++) {
                        elementInVirtual.power_on();
                    }
                }
                if (logAct) {
                    console.log(`[${game.global.stats.daysMega.toFixed(2)}]${id} 尝试建造/研究${count}次`)
                }
                return count;
            }
            return 0;
        }
    }

    function doTriggers(triggers, ignorePreviewNotDone = false) {
        let doneCount = 0;
        for (let trigger of triggers) {
            if (trigger.count === 0) {
                doneCount++;
                continue;
            }
            trigger.count -= act(trigger.id, trigger.count, trigger.tab);
            if (trigger.count > 0) {
                if (!ignorePreviewNotDone) {
                    break;
                }
            }
            else {
                doneCount++;
                if (trigger.afterDone) {
                    trigger.afterDone();
                }
            }
        }
        return doneCount === triggers.length;
    }
})();