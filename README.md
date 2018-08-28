# nodebot-cli
![nodebot Icon](https://gitlab.com/trustgit/nodebot/raw/master/doc/static/backgrounded-icon.jpg)

[![license](https://img.shields.io/badge/license-MIT-55aa55.svg)](https://gitlab.com/trustgit/nodebot-cli/blob/master/LICENSE)
[![npm package](https://img.shields.io/npm/v/nodebot-cli.svg)](https://www.npmjs.com/package/nodebot-cli)
[![nodebot project](https://img.shields.io/badge/part%20of-nodebot-5555ff.svg)](https://gitlab.com/trustgit/nodebot)
[![凑badge（](https://img.shields.io/badge/developed%20for-osu!-ff6699.svg)](https://osu.ppy.sh/home)

**nodebot-cli 是一个为 [nodebot](https://gitlab.com/trustgit/nodebot) 服务的，提供第三方模块安装，账号操作等功能的命令行工具。**

## 使用
通过 `npm` 进行安装：
```shell
npm install nodebot-cli
nodebot
```

查看帮助：
```shell
nodebot > help

Nodebot CLI Help
By trustgit, https://gitlab.com/trustgit/nodebot-cli

announce -include/-except [groups...]
    Announce a message to all your groups (including/except those in list [groups...])

config [name] [value]
    Get configuration of cli (if [value] isn't specified);
    Set configuration of cli (if [value] is specified).

exit
    See you next time!

install [name]
    Install a nodebot module (if specified [name]);
    Install nodebot's dependencies (if not specified [name])

list
    List nodebot & module's version info.

send [action]
    Do/Check standard cqhttp actions.

uninstall <name>
    Uninstall a nodebot module.
```

## 演示
![nodebot usage](https://gitlab.com/trustgit/nodebot-cli/raw/master/doc/static/usage.gif)