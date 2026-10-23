(() => {
  'use strict';
  const symptoms = [
    {title:'网站打不开',questions:[['所有网站都打不开','只有这个网站打不开','Wi-Fi 不行，移动网络可以','页面一直转圈']],plans:[
      {steps:['检查设备是否真正联网；如果是公共 Wi-Fi，确认是否需要网页登录。','测试另一个熟悉的网站；如果都无法打开，查看路由器与系统代理。','同设备尝试另一网络，记录结果。'],links:[0,11]},
      {steps:['先核对域名拼写和站点公告。','观察浏览器的完整错误代码：NXDOMAIN 查 DNS，证书警告查 HTTPS。','用另一个浏览器与网络对比，不要直接认定需要加速服务。'],links:[8,3,4]},
      {steps:['用另一台设备连接相同 Wi-Fi 对比。','检查 Wi-Fi 是否有登录门户或错误 DNS、代理配置。','保留现有配置并记录，必要时联系网络管理员。'],links:[11,8]},
      {steps:['辨别地址栏连接持续等待还是页面组件卡住。','用无痕窗口排除部分扩展、旧缓存问题。','若只在某网站发生，记录加载失败的资源。'],links:[5,0]}
    ]},
    {title:'浏览器出现错误',questions:[['ERR_CONNECTION_TIMED_OUT','ERR_CONNECTION_RESET','DNS_PROBE_FINISHED_NXDOMAIN','连接不是私密连接']],plans:[
      {steps:['确定是只有一个站点超时，还是多数站点同时超时。','比较手机热点与 Wi-Fi，检查代理及安全软件设置。','如果多网络同站超时，查看网站官方状态信息。'],links:[1,0]},
      {steps:['重试一次，确认重置是否稳定复现。','在另一浏览器与网络对比，检查代理或 VPN 配置是否异常。','记录具体时间及错误信息。'],links:[2,9]},
      {steps:['逐字核对域名；避免错误或过期的网址。','尝试不同网络对比 DNS 解析结果。','若权威记录缺失，需要网站方修复。'],links:[3,8]},
      {steps:['不要忽略证书警告或输入密码。','核对设备日期、时间、官方域名与公共 Wi-Fi 登录门户。','仍有警告时联系网站或网络管理员。'],links:[4,0]}
    ]},
    {title:'登录与验证码异常',questions:[['登录后跳回登录页','验证码空白或加载失败','页面登录按钮没有反应']],plans:[
      {steps:['检查 Cookie 设置及浏览器隐私拦截。','仅清理故障站点数据，再试无痕窗口。','若是企业单点登录，请联系管理员核对回调配置。'],links:[6,9]},
      {steps:['确认网站允许 JavaScript 和必要的 Cookie。','逐一检查内容拦截扩展；避免频繁刷新触发风控。','更换浏览器或网络作对比。'],links:[7,5]},
      {steps:['检查页面脚本是否加载成功，尝试其它浏览器。','查看是否有弹窗拦截或扩展阻止操作。','记录准确操作步骤，提供给网站支持。'],links:[5,6]}
    ]},
    {title:'访问速度很慢',questions:[['首次打开特别慢','页面出来了，资源仍然加载','只有 Wi-Fi 慢或失败','时快时慢']],plans:[
      {steps:['对比同一站点在不同时间与网络下的速度。','区分 DNS、连接耗时与服务器响应等待。','不要只凭单次测速判断原因。'],links:[10,1]},
      {steps:['检查是否是大图片、视频或第三方脚本拖慢页面。','通过浏览器网络面板观察失败请求及资源大小。','排除扩展与设备后台下载造成的影响。'],links:[10,5]},
      {steps:['比较同一手机的 Wi-Fi 与移动数据表现。','检查 Wi-Fi 信号、路由器负载、DNS 和代理。','公共或办公网络可咨询管理员。'],links:[11,10]},
      {steps:['记录不同时段的变化，判断是否与拥塞有关。','同设备比较多个站点和网络，避免仅依据单次结果。','如仅一个网站出现波动，查看其服务状态。'],links:[10,8]}
    ]}
  ];
  function metric(name,params={}) {try {if(typeof window.gtag==='function') window.gtag('event',name,params);} catch(e) { /* Analytics is optional */ }}
  const panel=document.getElementById('diagnosis');
  const buttons=[...document.querySelectorAll('[data-symptom]')];
  function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function init(){
    buttons.forEach(button=>button.addEventListener('click',()=>{
      const n=Number(button.dataset.symptom), obj=symptoms[n];
      metric('diagnosis_start',{symptom_group:n+1});
      buttons.forEach(b=>{const on=b===button;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
      panel.hidden=false;
      panel.innerHTML='<button type="button" class="diagnosis-reset" id="diagnosis-reset" aria-label="重新开始诊断">重新选择症状 ↺</button><h3>'+esc(obj.title)+' · 进一步选择</h3><p class="result-note">选择你现在观察到的具体情况。所有建议基于你的选择，并非网站自动检测结果。</p><div class="selects">'+obj.questions[0].map((q,k)=>'<button type="button" aria-pressed="false" data-detail="'+k+'">'+esc(q)+'</button>').join('')+'</div><div id="advice" aria-live="polite"></div>';
      panel.querySelector('#diagnosis-reset').addEventListener('click',()=>{panel.hidden=true;panel.innerHTML='';metric('diagnosis_reset');buttons.forEach(x=>{x.classList.remove('active');x.setAttribute('aria-pressed','false')});document.getElementById('choices').scrollIntoView({block:'center',behavior:'auto'});buttons[0].focus();});
      panel.querySelectorAll('[data-detail]').forEach(b=>b.addEventListener('click',()=>{
        panel.querySelectorAll('[data-detail]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});
        const p=obj.plans[Number(b.dataset.detail)];
        const detailNum=Number(b.dataset.detail);
        metric('diagnosis_detail',{symptom_group:n+1,detail_number:detailNum+1});
        const advice=panel.querySelector('#advice');
        advice.innerHTML='<h3>建议按这个顺序排查</h3><p class="result-note">逐项操作，完成后勾选；记录只保留在当前浏览器页面，不会发送给本站。</p><div class="diag-progress" role="status">已完成 0 / '+p.steps.length+' 项</div><ol class="steps track-steps">'+p.steps.map((s,i)=>'<li><label><input type="checkbox" data-step="'+i+'"><span>'+esc(s)+'</span></label></li>').join('')+'</ol><p class="result-note">完成某一步后可以返回上方重新选择情况。无法确定原因时不要同时修改多项设置。</p><strong>对应指南</strong><div class="result-links">'+p.links.map(i=>'<a href="guide/'+encodeURIComponent(index[i].slug)+'.html">'+esc(index[i].title)+' →</a>').join('')+'</div><div class="followup"><h3>按实际结果继续判断</h3><p>完成对比后，哪一种情况更符合你的观察？</p><div class="selects"><button type="button" data-outcome="single">只有这个网站异常</button><button type="button" data-outcome="browser">只在一个浏览器异常</button><button type="button" data-outcome="network">换网络就恢复</button><button type="button" data-outcome="all">多个网络和浏览器都异常</button></div><div class="outcome-result" role="status"></div></div><div class="diag-report"><h3>保存排查记录</h3><p class="result-note">复制的记录仅包含你选择的症状和步骤完成情况，不包含访问的网站、账号或设备数据。</p><button type="button" class="report-copy">复制诊断摘要</button><span class="copy-status" role="status"></span></div>';
        let pickedOutcome='尚未选择';
        const completed=new Set();
        const progress=advice.querySelector('.diag-progress');
        advice.querySelectorAll('[data-step]').forEach(cb=>cb.addEventListener('change',()=>{const i=Number(cb.dataset.step);if(cb.checked)completed.add(i);else completed.delete(i);progress.textContent='已完成 '+completed.size+' / '+p.steps.length+' 项';if(completed.size===p.steps.length)metric('diagnosis_steps_complete',{symptom_group:n+1});}));
        advice.querySelector('.report-copy').addEventListener('click',async()=>{const msg=['出海访问指南 · 排查摘要','故障类型：'+obj.title,'具体现象：'+obj.questions[0][detailNum],'已完成步骤：'+[...completed].sort().map(i=>i+1).join('、')+'（共 '+p.steps.length+' 项）','对比结果：'+pickedOutcome,'这份记录基于用户自行观察，不是自动网络检测。'].join('\n');const status=advice.querySelector('.copy-status');try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(msg);}else{const t=document.createElement('textarea');t.value=msg;document.body.append(t);t.select();if(!document.execCommand('copy'))throw Error('copy');t.remove();}status.textContent='已复制，可粘贴保存。';metric('diagnosis_summary_copy');}catch(e){status.textContent='无法自动复制，请尝试使用 HTTPS 网站并允许剪贴板权限。';}});
        advice.querySelectorAll('[data-outcome]').forEach(btn=>{btn.setAttribute('aria-pressed','false');btn.addEventListener('click',()=>{
          advice.querySelectorAll('[data-outcome]').forEach(x=>{x.classList.toggle('active',x===btn);x.setAttribute('aria-pressed',String(x===btn));});
          pickedOutcome=btn.textContent.trim();
          metric('diagnosis_outcome',{outcome_type:btn.dataset.outcome});
          const detail={single:['问题可能集中在特定站点、域名或其依赖资源。先看站点公告并记录具体报错；不要因为其他站点正常就断言本机网络毫无问题。',8],browser:['优先检查该浏览器的扩展、网站权限、站点 Cookie、缓存和代理配置。先用隐私窗口对比，再逐项排除。',9],network:['优先检查发生异常的 Wi-Fi、DNS、代理、路由器或网络出口。请勿自行绕过组织网络要求。',11],all:['可能涉及站点端、账号、区域性网络故障等。保留错误截图、时间和网络对比结果，再联系站点支持；不要反复更改多个参数。',0]}[btn.dataset.outcome];
          advice.querySelector('.outcome-result').innerHTML='<p>'+esc(detail[0])+'</p><a href="guide/'+esc(index[detail[1]].slug)+'.html">阅读下一步指南 →</a>';
        });});
      }));
      panel.scrollIntoView({behavior:window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});
    }));
  }
  const form=document.getElementById('search-form'),input=document.getElementById('q'),output=document.getElementById('search-results');
  let index=[{"slug":"website-not-opening","title":"网站打不开怎么办？先判断是网站、浏览器还是网络"},{"slug":"err-connection-timed-out","title":"ERR_CONNECTION_TIMED_OUT 怎么解决？逐步定位超时原因"},{"slug":"err-connection-reset","title":"ERR_CONNECTION_RESET 的原因与解决方法"},{"slug":"dns-probe-finished-nxdomain","title":"DNS_PROBE_FINISHED_NXDOMAIN 怎么办？"},{"slug":"connection-not-private","title":"Chrome 提示“连接不是私密连接”怎么办"},{"slug":"page-keeps-loading","title":"网站一直转圈、加载不出来：怎么判断卡在哪里"},{"slug":"login-redirect-loop","title":"网站登录后反复跳回登录页面：排查 Cookie 与会话"},{"slug":"captcha-not-loading","title":"验证码无法加载怎么办？排查脚本、拦截和网络"},{"slug":"one-website-not-working","title":"为什么一个网站能打开，另一个打不开？"},{"slug":"works-in-another-browser","title":"换浏览器就正常，是什么原因？"},{"slug":"overseas-website-slow","title":"海外网站加载慢的常见原因，以及如何逐项判断"},{"slug":"wifi-not-working-mobile-data-works","title":"手机网络正常，Wi-Fi 却打不开网站怎么办"}];
  init();
  const aliases={
    'website-not-opening':['访问不了','网站进不去','网页打不开','域名打不开','无法连接','网页无法访问'],
    'err-connection-timed-out':['超时','连接超时','网页超时','请求超时'],
    'err-connection-reset':['重置','连接重置','连接被重置','被断开'],
    'dns-probe-finished-nxdomain':['dns错误','dns解析失败','域名解析失败','域名不存在','nxdomain','找不到服务器'],
    'connection-not-private':['证书错误','ssl错误','不安全连接','证书过期','https警告'],
    'page-keeps-loading':['加载不出来','一直加载','空白页','白屏','网页转圈'],
    'login-redirect-loop':['登录不了','登录循环','跳回登录','登录失效'],
    'captcha-not-loading':['验证码不显示','验证码加载失败','人机验证','验证码空白','captcha'],
    'one-website-not-working':['部分网站打不开','只有一个网站打不开','一个网站打不开'],
    'works-in-another-browser':['换个浏览器','一个浏览器打不开','chrome打不开'],
    'overseas-website-slow':['网站很卡','加载慢','访问慢','打开很慢','速度慢'],
    'wifi-not-working-mobile-data-works':['wifi打不开','wifi不能上网','无线网打不开','流量能打开','移动数据正常']
  };
  const normalize=v=>String(v||'').toLowerCase().normalize('NFKC').replace(/[_\-\s\u3000，。、:：?!？!]+/g,'');
  const normalizedAliases=Object.fromEntries(Object.entries(aliases).map(([slug,terms])=>[slug,terms.map(normalize)]));
  function search(raw){
    if(!output)return;
    const q=normalize(raw.trim());
    if(!q){output.replaceChildren();return;}
    const words=raw.trim().split(/[\s,，;；]+/).map(normalize).filter(Boolean);
    const results=index.map((x,i)=>{
      const title=normalize(x.title), corpus=normalize([x.title,x.description,x.symptom,x.category,...(Array.isArray(x.keywords)?x.keywords:[x.keywords||''])].join(' '));
      let score=0;
      if(title===q)score+=25;
      if(title.includes(q))score+=14;
      if(corpus.includes(q))score+=8;
      for(const word of words){if(corpus.includes(word))score+=3;}
      const alias=normalizedAliases[x.slug];
      if(alias&&alias.some(v=>v===q))score+=22;
      else if(alias&&alias.some(v=>v.includes(q)||q.includes(v)))score+=9;
      return {x,score};
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,8);
    output.innerHTML='<strong>找到 '+results.length+' 篇相关指南</strong>'+(results.length?results.map(({x})=>'<div class="item"><a href="'+esc(x.url||('guide/'+x.slug+'.html'))+'">'+esc(x.title)+'</a><p>'+esc(x.description||'查看对应故障排查指南。')+'</p></div>').join(''):'<p>没有匹配结果。可以尝试完整浏览器错误代码，或改用“DNS”“登录”“验证码”“Wi-Fi”等更短的描述。</p><a href="guides.html">浏览全部故障指南 →</a>');
  }
  fetch('assets/search-index.json').then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{if(Array.isArray(data)&&data.length>=12&&data.every(x=>x&&typeof x.slug==='string'&&typeof x.title==='string'))index=data;if(input&&input.value)search(input.value);}).catch(()=>{if(output)output.textContent='搜索索引暂时无法加载，仍可输入错误代码搜索文章标题，或查看下方指南。';});
  if(input){const params=new URLSearchParams(location.search);const initial=params.get('q');if(initial){input.value=initial.slice(0,120);search(input.value);}input.addEventListener('input',()=>search(input.value));form.addEventListener('submit',e=>{e.preventDefault();search(input.value);metric('site_search_used');if(input.value.trim()&&location.protocol!=='about:')history.replaceState(null,'',location.pathname+'#search');output.scrollIntoView({block:'nearest'});});}
})();
