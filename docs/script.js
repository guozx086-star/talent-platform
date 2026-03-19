**粘贴以下JavaScript代码：**
```javascript
// 人才管理平台交互功能
document.addEventListener('DOMContentLoaded', function() {
console.log('人才管理平台已加载完成');
// 更新当前时间
updateCurrentTime();
// 设置访问按钮事件
const accessBtn = document.querySelector('.access-button');
if (accessBtn) {
accessBtn.addEventListener('click', showSuccess);
}
});
function showSuccess() {
const message = `🎉 恭喜！人才管理平台部署成功！
✅ GitHub Pages部署完成！
🔗 访问链接：https://guozx086-star.github.io/talent-platform/
📊 平台功能：
• 简历智能匹配系统
• 2220份简历数据库
• 候选人信息管理
• 数据可视化展示
⏰ 部署时间：${new Date().toLocaleString('zh-CN')}`;
alert(message);
// 更新按钮状态
const button = document.querySelector('.access-button');
button.textContent = '🎊 访问成功！';
button.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
// 更新页面标题
document.querySelector('.cta-title').textContent = '🎊 GitHub Pages部署成功！';
document.querySelector('.cta-description').textContent = '人才管理平台已通过GitHub Pages成功部署';
}
function updateCurrentTime() {
const now = new Date();
const timeString = now.toLocaleString('zh-CN', {
year: 'numeric',
month: 'long',
day: 'numeric',
hour: '2-digit',
minute: '2-digit',
second: '2-digit',
hour12: false
});
// 如果有时间显示元素，更新它
const timeElement = document.getElementById('currentTime');
if (timeElement) {
timeElement.textContent = timeString;
}
}
