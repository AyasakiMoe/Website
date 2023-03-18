$(document).ready(function() {
  // 使用 AJAX 获取 RSS 源的内容
  $.ajax({
    url: "https://rss.lolicon.team/?feed=rss2",
    dataType: "xml",
    success: function(data) {
      // 解析 XML 内容并找到所有的 <item> 元素
      $(data).find("item").each(function() {
        var title = $(this).find("title").text();
        var link = $(this).find("link").text();
        var description = $(this).find("description").text();
        // 将解析后的内容添加到 HTML 的 <div> 元素中
        $("#rss").append("<li class='list-news mdui-ripple mdui-ripple-white'><h3><a href='" + link + "'>" + title + "</a></h3><p>" + description + "</p></li>"); 
        //添加li标签里的class类 wow animate__animated animate__fadeInRight
        $('#rss li').addClass('wow animate__animated animate__fadeInRight'); 
        //删除id 为loadprogress的元素
        $('#loadprogress').remove();
      });
    }
  });
});

