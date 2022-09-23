/*
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-20 22:49:29
 * @LastEditTime: 2022-09-22 19:58:43
 * @FilePath: /wbmanageTool/manage-tool/mock-server.js
 */
let Koa=require('koa')
let Router=require('koa-router')
let cors=require('koa-cors')
let fs=require('fs')

const app=new Koa()
const router=new Router()

router.get('/web/area_list',async ctx=>{
  // 允许cors跨域请求
  await cors();
  // 返回数据
  ctx.body=JSON.parse(fs.readFileSync('./mock/_web_area_list.json'));
})
router.get('/web/topology_list',async ctx=>{
    // 允许cors跨域请求
    await cors();
    // 返回数据
    ctx.body=JSON.parse(fs.readFileSync('./mock/_web_topology_list.json'));
})
router.get('/web/track_list',async ctx=>{
    // 允许cors跨域请求
    await cors();
    // 返回数据
    ctx.body=JSON.parse(fs.readFileSync('./mock/_web_track_list.json'));
})
router.get('/web/fast_reboot',async ctx=>{
    await cors();
    ctx.body=JSON.parse(fs.readFileSync('./mock/_web_fast_reboot.json'));
})
router.get('/web/reboot',async ctx=>{
    await cors();
    ctx.body=JSON.parse(fs.readFileSync('./mock/_web_fast_reboot.json'));
})

router.get('/web/reconnect',async ctx=>{
    await cors();
    ctx.body=JSON.parse(fs.readFileSync('./mock/_web_fast_reboot.json'));
})
router.get('/web/disconnect',async ctx=>{
    await cors();
    ctx.body=JSON.parse(fs.readFileSync('./mock/_web_fast_reboot.json'));
})
router.get('/web/login',async ctx=>{
    await cors();
    ctx.body=JSON.parse(fs.readFileSync('./mock/_web_fast_reboot.json'));
})
router.get('/web/del',async ctx=>{
    await cors();
    ctx.body=JSON.parse(fs.readFileSync('./mock/_web_fast_reboot.json'));
})
router.get('/web/save',async ctx=>{
    await cors();
    ctx.body=JSON.parse(fs.readFileSync('./mock/_web_fast_reboot.json'));
})
router.get('/web/pwd',async ctx=>{
    await cors();
    ctx.body=JSON.parse(fs.readFileSync('./mock/_web_fast_reboot.json'));
})


// 将koa和中间件连起来
app.use(router.routes()).use(router.allowedMethods());

let port=3000;
app.listen(port,()=>{
  console.log('server is running on '+port)
})