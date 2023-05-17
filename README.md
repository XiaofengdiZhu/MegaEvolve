# MegaEvolve 超进化

## Play 开玩
https://xiaofengdizhu.github.io/MegaEvolve/
## Top Announcement 置顶公告
Developing and not completed, if you have any questions, please submit an issue or start a discussion.
开发中，未完成，有任何问题请先看此说明后提交issue或Discussions中发帖询问。
## About 关于
This Version is based on [pmotschmann/Evolve](https://github.com/pmotschmann/Evolve), I add speed-up feature and make some small UI changes to this awesome game(no values changed). I hope you will enjoy it!
这个版本基于[pmotschmann/Evolve](https://github.com/pmotschmann/Evolve)，我给这个超赞的游戏添加了加速功能，还做了一点界面调整（没有数值调整），希望你能享受它。

Thanks to [g8hh/Evolve](https://github.com/g8hh/evolve), I used it's `strings.zh-CN.json`(not totally).感谢[g8hh/Evolve](https://github.com/g8hh/evolve)，我使用了它的`strings.zh-CN.json`（不完全照抄）。

For faster speed, you will need a powerful CPU with higher Single-Core performance.如果你想要更快的加速，需要有更强劲单核性能的CPU。

To display buildings, click the title of second row of tabs to refresh the building list.显示建筑的方法是点击第二行标签栏的标题，这将刷新建筑列表。  
Or set the "自动刷新" option to "是" on the right top, but this will affect the speed factor.或者设置右上角的“自动刷新”选项为“是”，但是会影响加速。

I also make an offline client for this我还为它做了一个离线客户端: [evolve-electron](https://github.com/XiaofengdiZhu/evolve-electron/)  
Tampermonkey scripts for the client客户端用的油猴脚本: [Click me](https://github.com/XiaofengdiZhu/evolve-electron/tree/main/tampermonkeyScripts)

Below is original readme.以下是原版介绍。

An incremental game about evolving a civilization from primordial ooze into a space faring empire.
Evolve combines elements of a clicker with an idler and has lots of micromanagement.

What will you evolve into?

## Submitting Issues
If you think you have discovered a bug or have some other issue with the game then you can open an issue here on Github.
Please do not open Github issues to ask gameplay questions, use Reddit or Discord for that.
Links for both can be found in the footer of the game.

## Contributing a Language file
If you are interested in a contributing a new language for Evolve the process is fairly straight forward (although a bit tedious).

Make a copy of strings/strings.json and name the copy as strings/strings.\<locale\>.json (EX: strings.es_US.json). The locale format is the language alpha-2 code joined with the country alpha-2 code.

The strings are stored in a json format and will look like this:
```
"job_farmer_desc": "Farmers create food to feed your population. Each farmer generates %0 food per second.",
```
If you are unfamiliar with json the first part is a **key** and cannot be altered, **do not translate or modify the key in any way**. The second part is the string to be translated. Many game strings use **tokens** (**%0**, **%1**, **%2**, etc) to represent game values, as such these tokens must remain in the final translated string. Their position can be moved accordingly, the number represents a specific value and not its position in the string.

To enable your language translation in the game you must add it to the locales constant in locale.js (bottom of the file).

Once you feel your translation file is ready send a pull request with it to the Evolve main branch.


## Contributing to the game
Bug fixes, additional translations, themes, or UI improvements can simply be submitted as pull requests; once reviewed and accepted they will be merged into the main game branch. If you want to contribute a new feature it can not arbitrarily make something easier without making something else harder. If your new feature idea simply makes the game easier it will not be accepted.

## CSS Changes
Evolve uses LESS to build its CSS, you can not just edit the minified CSS file. You must instead edit src/evolve.less then use the less compiler to rebuild the CSS file.

## Build Commands
Assuming you configured your build environment correctly the game can be built using the following scripts
```
npm run build // Builds the game bundle
npm run dev // Builds the game bundle in debug mode
npm run less // Builds the CSS file
npm run wiki // Builds the wiki bundle
npm run wiki-dev // Builds the wiki bundle in debug mode
npm run wiki-less // Builds the Wiki CSS file
```
