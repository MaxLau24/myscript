/*
Surge 实现 Day One Premium

未注册或未登录过的用户使用方式：
1. 启用脚本
2. 如果还没有账号则注册一个账号（注册时请点击收到的邮件中下面的 complete the process online 而不要直接点击 Confirm account 的按钮）
3. 登录，登录时可能会弹出降级提示，点击关闭即可；重启Day One
4. 写一篇日记，确保可以正常同步

已注册过用户使用方式：
1. Free 用户备份好已有的日记、Plus 用户确保当前日记已经同步好
2. 卸载 Day One
3. 启用脚本
4. 安装 Day One
5. 登录账号（如果卸载前是已登录状态重装完无需重新登录）
6. 稍等片刻等待后重启 Day One
7. 如果重启完不显示高级版 Premium 请尝试注销后重新登录
8. Free 用户导入之前备份的日记，确保可以正常同步


http-response ^https:\/\/dayone\.me\/api\/users$ requires-body=1,max-size=0,script-path=scripts/dayone.js

MitM = dayone.me

本脚本由 @ImSingee 与 @Mornwind 共同完成，请勿在公开群组、频道或是论坛、博客发布
*/

if ($response.status == 200) {
  const bodyJson = JSON.parse($response.body);

  bodyJson.featureBundle = {"bundleName":"premium","features":[{"name":"imagesPerEntry","limit":30,"canUpgrade":false},{"name":"printingDiscount","canUpgrade":false},{"name":"syncMac","canUpgrade":false},{"name":"prioritySupport","canUpgrade":false},{"name":"sync","canUpgrade":false},{"name":"journalLimit","limit":100,"canUpgrade":false},{"name":"audioPerEntry","limit":10,"canUpgrade":false}]};

  $done({body: JSON.stringify(bodyJson)});
} else {
  $done({});
}
