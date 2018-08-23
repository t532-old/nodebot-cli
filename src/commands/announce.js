/*
TODO:
基本逻辑：
接收参数message和可选参数列表groups
groups是仅包括或排除的群列表
nodebot开放一个api(:16160/announce)
post数据：
{
    message: "...",
    type: "include/except"/undefined,
    groups: [...],
}
*/