//本脚本需手动进入活动界面，且打开任务列表才可起效

// 20220109
if (!auto.service) {
    toast('无障碍服务未启动！退出！')
    exit()
}

alert('即将请求截图权限，用以查找按钮，请允许')
if (!requestScreenCapture()) {
    console.log("请求截图失败，退出");
    exit();
}

const join = false
//confirm('是否自动完成入会任务？', '入会将会自动授权手机号给京东商家')

console.show()
console.log('开始完成京东任务...')
console.log('按音量下键停止')

device.keepScreenDim(30 * 60 * 1000) // 防止息屏30分钟

// 监听音量下键
function registerKey() {
    events.observeKey()
    events.onKeyDown('volume_down', function (event) {
        console.log('京东任务脚本停止了')
        console.log('请手动切换回主页面')
        device.cancelKeepingAwake()
        exit()
    })
}
threads.start(registerKey)

while (text("累计任务奖励").findOnce() == null) {
    toast("请手动进入京东或者京东金融活动任务页面");
    console.log('请手动进入京东或者京东金融活动任务页面')
    console.log('京东金融个别任务需要登录，请手动完成再跑')
    sleep(2000);
}

sleep(2000)

while (true) {
    function timeTask() {
        taskButton.click()
        console.log('等待浏览任务完成...')
        let c = 0
        while (c < 40) { // 0.5 * 40 = 20 秒，防止死循环
            let finish_reg = /获得.*?爆竹|任务已达上限/
            if ((textMatches(finish_reg).exists() || descMatches(finish_reg).exists())) // 等待已完成出现，有可能失败
                break
            sleep(500)
            c++
        }
        if (c > 39) {
            console.log('未检测到任务完成标识。返回。')
        }
        back()
        sleep(2000)
        while(text("累计任务奖励").findOnce() == null)
            {back()
            sleep(1000)}
        console.log('任务完成，返回')
        sleep(5000)
    }

    function itemTask(cart) {
        taskButton.click()
        console.log('等待进入商品列表...')
        textContains('当前页点击浏览').findOne(10000)
        sleep(2000)
        let items = textContains('.jpg!q70').find()
        for (let i = 0; i < items.length; i++) {
            if (cart) {
                console.log('加购并浏览')
                //sml_move(400, 1000, 800, 600, 1000);
                let tmp = items[i].parent().parent()
                    tmp.child(tmp.childCount()-1).click()
                    sml_move(400, 1000, 800, 600, 1000);
            } else {
                console.log('浏览商品页')
                items[i].parent().parent().child(4).click()
                sml_move(400, 1000, 800, 600, 1000);
            }
            sml_move(400, 1000, 800, 600, 1000);
            sleep(5000)
            console.log('返回')
            back()
            sleep(5000)
            if (i >= 4) {
                break
            }
        }
        console.log('完成浏览商品，返回')
        back()
        sleep(5000)
    }
    function bezier_curves(cp, t) {
        cx = 3.0 * (cp[1].x - cp[0].x); 
        bx = 3.0 * (cp[2].x - cp[1].x) - cx; 
        ax = cp[3].x - cp[0].x - cx - bx; 
        cy = 3.0 * (cp[1].y - cp[0].y); 
        by = 3.0 * (cp[2].y - cp[1].y) - cy; 
        ay = cp[3].y - cp[0].y - cy - by; 
        
        tSquared = t * t; 
        tCubed = tSquared * t; 
        result = {
            "x": 0,
            "y": 0
        };
        result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x; 
        result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y; 
        return result; 
    };
    
    //仿真随机带曲线滑动  
    //qx, qy, zx, zy, time 代表起点x,起点y,终点x,终点y,过程耗时单位毫秒
    function sml_move(qx, qy, zx, zy, time) {
        var xxy = [time];
        var point = [];
        var dx0 = {
            "x": qx,
            "y": qy
        };
    
        var dx1 = {
            "x": random(qx - 100, qx + 100),
            "y": random(qy , qy + 50)
        };
        var dx2 = {
            "x": random(zx - 100, zx + 100),
            "y": random(zy , zy + 50),
        };
        var dx3 = {
            "x": zx,
            "y": zy
        };
        for (var i = 0; i < 4; i++) {
    
            eval("point.push(dx" + i + ")");
    
        };
        log(point[3].x)
    
        for (let i = 0; i < 1; i += 0.08) {
            xxyy = [parseInt(bezier_curves(point, i).x), parseInt(bezier_curves(point, i).y)]
    
            xxy.push(xxyy);
    
        }
    
        log(xxy);
        gesture.apply(null, xxy);
    };

    function shopTask() {
        taskButton.click()
        console.log('等待进入店铺列表...')
        textContains('每逛').findOne(10000)
        sleep(2000)
        for (let i = 0; i < 5; i++) {
            let shop = textContains('.jpg!q70').findOnce()
            console.log('浏览店铺页')
            shop.parent().parent().click()
            sleep(8000)
            console.log('返回')
            back()
            sleep(5000)
        }
    }

    console.log('寻找未完成任务...')
    console.log('京东金融个别任务如果反复运行，显示需要登录，请退出手动完成再跑')
    sleep(2000)
    let taskButtons = textMatches(/.*浏览并关注.*|.*浏览.*s.*|.*累计浏览.*|.*浏览可得.|浏览.*秒.*|.*浏览即可得.*|成功入会并浏览可得.*|浏览可得.*|浏览领.*/).find()
    sleep(2000)
    if (taskButtons.empty()) {
        console.log('未找到浏览任务，退出，城城分现金任务手动完成！')
        console.log('如有未完成浏览任务或者没有退回到任务栏请重新运行')
        console.log('其它组队、浏览品牌墙、点击首页、去小程序等莫名其妙任务自己搞定！！！')
        break
    }

    let taskButton, taskText
    let img = captureScreen()
    for (let i = 0; i < taskButtons.length; i++) {
        let item = taskButtons[i]
        taskText = item.text()
        item = item.parent().child(3)
        let b = item.bounds()
        let color = images.pixel(img, b.left + b.width() / 10, b.top + b.height() / 2)
        if (colors.isSimilar(color, '#f54b4b')|colors.isSimilar(color, '#e64e49')) {
            console.log('有任务按钮')
            if (!join && taskText.match(/入会/)) continue
            taskButton = item
            break
        }
    }

    if (!taskButton) {
        console.log('未找到可自动完成的任务，退出。')
        console.log('未找到浏览任务，退出，城城分现金任务手动完成，如有未完成重新运行')
        console.log('其它组队、浏览品牌墙、点击首页、下单任务等莫名其妙任务自己搞定！！！')
        console.log('如有还有任务不执行是不是手机不是常用手机，比如海尔手机？颜色非常规。。。')
        break
    }

    if (taskText.match(/浏览并关注.*s|浏览.*s.*|浏览.*秒.*|.*浏览可得.*|浏览即可得.*|浏览并关注.*|浏览领.*/)) {
        console.log('进行', taskText)
        if (taskText.match(/浏览.*s.*|浏览.*秒.*|浏览即可得|浏览并关注.*|浏览领.*/)) {
            let taskName = taskButton.parent().child(1).text()
            if (taskName.match(/种草城/)) {
                shopTask()
                back()
                sleep(5000)}
            timeTask()
        } else if (join && taskText.match(/入会/)) {
        console.log('进行入会任务，等待加载...')
        taskButton.click()
        sleep(2000)
        let check = text('确认授权即同意').findOne(20000)
        if (!check) {
            console.log('无法找到入会按钮，返回')
            sleep(5000)
            back()
            sleep(5000)
        } else {
        sleep(2000)
        check = check.parent().child(0).bounds()
        console.log('即将勾选授权，自动隐藏控制台')
        console.hide()
        sleep(500)
        click(check.centerX(), check.centerY())
        sleep(500)
        let j = text('确认授权并加入店铺会员').findOnce().bounds()
        click(j.centerX(), j.centerY())
        sleep(500)
        console.show()
        console.log('等待自动返回...')
        if (!textContains('累计任务奖励').findOne(8000)) { // 部分任务会自动返回
            console.log('手动返回')
            back()
        }
        sleep(5000)}
        }else if (taskText.match(/浏览可得/))
        {let taskName = taskButton.parent().child(1).text()
        
        timeTask()}
        }else if (taskText.match(/累计浏览/)) {
        console.log('进行累计浏览任务')
        if (taskText.match(/点我浏览/)) itemTask(true)
        else itemTask(false)
        } else if (join && taskText.match(/入会/)) {
        console.log('进行入会任务，等待加载...')
        taskButton.click()
        sleep(3000)
        
        let check = textMatches(/确认授权即同意.*|.*入会享特权.*/).findOne(20000)
        if (!check) {
            console.log('无法找到入会按钮，返回')
            sleep(5000)
            back()
            sleep(5000)
        } else {
        sleep(2000)
        check = check.parent().child(0).bounds()
        console.log('即将勾选授权，自动隐藏控制台')
        console.hide()
        sleep(500)
        click(check.centerX(), check.centerY())
        sleep(500)
        let j = text('确认授权并加入店铺会员').findOnce().bounds()
        click(j.centerX(), j.centerY())
        sleep(500)
        console.show()
        console.log('等待自动返回...')
        if (!textContains('累计任务奖励').findOne(8000)) { // 部分任务会自动返回
            console.log('手动返回')
            back()
        }
        sleep(5000)}
    } else if (taskText.match(/浏览可得|浏览并关注/)) {
        let taskName = taskButton.parent().child(1).text()
        if (taskName.match(/种草城/)) {
            shopTask()
            back()
            sleep(5000)
        } else {
            console.log('进行参观任务')
            taskButton.click()
            sleep(5000)
            console.log('直接返回')
            back()
            sleep(5000)
        }
    }

    }

device.cancelKeepingAwake()
// alert('任务完成！')
