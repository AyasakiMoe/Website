//定义一个函数来获取rss文件
function getRSS(url) {
    //使用fetch API来调用url
    fetch(url)
      .then(response => response.text()) //将响应解析为文本
      .then(str => new window.DOMParser().parseFromString(str, "text/xml")) //将文本解析为XML对象
      .then(data => {
        //从XML对象中获取channel元素
        const channel = data.querySelector("channel");
        //从channel元素中获取所有item元素
        const items = channel.querySelectorAll("item");
        //遍历每个item元素
        items.forEach(item => {
          //从item元素中获取title和link元素的文本内容
          const title = item.querySelector("title").textContent;
          const link = item.querySelector("link").textContent;
          const datetime = item.querySelector("pubDate").textContent;
          //在控制台打印标题和链接
          console.log(title, link);
          //在news.html页面上的ul元素中添加内容
            document.querySelector("ul").innerHTML += `
            <a href="${link}" target="_blank">
            <li class="idc dnone mdui-list-item mdui-ripple mdui-shadow-12" style="backdrop-filter: blur(8px);overflow-x:hidden">
                <div class="mdui-list-item-title">${title}</div>
                            <div class="mdui-list-item-text mdui-list-item-one-line">
                                <span>${datetime}</span>
                     </div>
                </a>
            </li>
            `;
          //若是没有的item元素，则在页面li添加没有内容”
          if (items.length === 0) {
            document.querySelector("ul").innerHTML += `
            <li class="idc dnone mdui-list-item mdui-ripple mdui-shadow-12" style="backdrop-filter: blur(8px);overflow-x:hidden">
                <div class="mdui-list-item-title">没有内容</div>
            </li>
            `;
          }
        });
      });
  }
  
  //调用函数，传入rss文件的url（这里是一个示例）
  getRSS("http://www.mikumo.top/?feed=rss2");
