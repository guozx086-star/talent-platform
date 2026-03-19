/**
 * 人才管理平台 JavaScript 功能
 */

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('人才管理平台已加载');
    
    // 初始化功能
    initDashboard();
    initQuickActions();
    updateCurrentTime();
    
    // 每30秒更新一次数据
    setInterval(updateDashboardData, 30000);
});

// 初始化仪表板
function initDashboard() {
    console.log('初始化仪表板');
    
    // 加载统计数据
    loadStats();
    
    // 加载最近候选人
    loadRecentCandidates();
}

// 加载统计数据
function loadStats() {
    fetch('/api/stats')
        .then(response => response.json())
        .then(data => {
            updateStatsDisplay(data);
        })
        .catch(error => {
            console.error('加载统计数据失败:', error);
        });
}

// 更新统计数据显示
function updateStatsDisplay(stats) {
    // 更新统计卡片数据（如果需要）
    const statElements = {
        'total_candidates': document.querySelector('.stat-card:nth-child(1) h3'),
        'hired_count': document.querySelector('.stat-card:nth-child(2) h3'),
        'interview_count': document.querySelector('.stat-card:nth-child(3) h3'),
        'avg_match_score': document.querySelector('.stat-card:nth-child(4) h3'),
        'open_positions': document.querySelector('.stat-card:nth-child(5) h3')
    };
    
    for (const [key, element] of Object.entries(statElements)) {
        if (element && stats[key] !== undefined) {
            if (key === 'avg_match_score') {
                element.textContent = stats[key] + '%';
            } else {
                element.textContent = stats[key];
            }
        }
    }
}

// 加载最近候选人
function loadRecentCandidates() {
    fetch('/api/candidates')
        .then(response => response.json())
        .then(candidates => {
            // 取前5个候选人
            const recentCandidates = candidates.slice(0, 5);
            updateCandidatesTable(recentCandidates);
        })
        .catch(error => {
            console.error('加载候选人数据失败:', error);
        });
}

// 更新候选人表格
function updateCandidatesTable(candidates) {
    const tableBody = document.querySelector('.data-table tbody');
    if (!tableBody) return;
    
    // 清空现有行（除了模板行）
    const existingRows = tableBody.querySelectorAll('tr');
    existingRows.forEach(row => {
        if (!row.classList.contains('template-row')) {
            row.remove();
        }
    });
    
    // 添加新的行
    candidates.forEach(candidate => {
        const row = document.createElement('tr');
        
        // 计算状态类
        const statusClass = getStatusClass(candidate.status);
        
        row.innerHTML = `
            <td>
                <div class="user-info">
                    <div class="user-avatar-small">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <strong>${candidate.name}</strong>
                        <br>
                        <small>${candidate.education}</small>
                    </div>
                </div>
            </td>
            <td>${candidate.position}</td>
            <td>${candidate.experience}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${candidate.match_score}%">
                        ${candidate.match_score}%
                    </div>
                </div>
            </td>
            <td>
                <span class="status-badge status-${statusClass}">
                    ${candidate.status}
                </span>
            </td>
            <td>
                <a href="/candidate/${candidate.id}" class="btn-action">
                    <i class="fas fa-eye"></i> 查看
                </a>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// 获取状态类名
function getStatusClass(status) {
    const statusMap = {
        '待面试': '待面试',
        '面试中': '面试中',
        '已录用': '已录用',
        '待评估': '待评估'
    };
    return statusMap[status] || '待评估';
}

// 初始化快速操作
function initQuickActions() {
    const quickButtons = document.querySelectorAll('.quick-btn');
    
    quickButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonType = this.querySelector('span').textContent;
            handleQuickAction(buttonType);
        });
    });
}

// 处理快速操作
function handleQuickAction(action) {
    console.log('执行快速操作:', action);
    
    switch(action) {
        case '添加候选人':
            showAddCandidateForm();
            break;
        case '导出报表':
            exportReport();
            break;
        case '搜索候选人':
            showSearchModal();
            break;
        case '安排面试':
            showScheduleModal();
            break;
        default:
            console.log('未知操作:', action);
    }
}

// 显示添加候选人表单
function showAddCandidateForm() {
    alert('添加候选人功能即将开放');
    // 实际应用中这里会显示一个模态框
}

// 导出报表
function exportReport() {
    alert('导出报表功能即将开放');
    // 实际应用中这里会触发文件下载
}

// 显示搜索模态框
function showSearchModal() {
    const searchInput = prompt('请输入搜索关键词:');
    if (searchInput) {
        searchCandidates(searchInput);
    }
}

// 搜索候选人
function searchCandidates(query) {
    fetch(`/api/candidates/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(results => {
            if (results.length > 0) {
                alert(`找到 ${results.length} 个匹配的候选人`);
                // 实际应用中这里会显示搜索结果
            } else {
                alert('未找到匹配的候选人');
            }
        })
        .catch(error => {
            console.error('搜索失败:', error);
            alert('搜索失败，请稍后重试');
        });
}

// 显示安排面试模态框
function showScheduleModal() {
    alert('安排面试功能即将开放');
    // 实际应用中这里会显示一个日程安排界面
}

// 更新当前时间
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
    
    const timeElements = document.querySelectorAll('.current-time');
    timeElements.forEach(element => {
        element.textContent = timeString;
    });
}

// 更新仪表板数据
function updateDashboardData() {
    console.log('更新仪表板数据');
    loadStats();
    
    // 更新当前时间
    updateCurrentTime();
}

// 搜索功能
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length >= 2) {
                performSearch(query);
            }
        });
    }
}

// 执行搜索
function performSearch(query) {
    console.log('执行搜索:', query);
    // 实际搜索逻辑
}

// 添加工具提示
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            showTooltip(this, tooltipText);
        });
        
        element.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

// 显示工具提示
function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    
    const rect = element.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.top = (rect.top - 30) + 'px';
    tooltip.style.left = rect.left + 'px';
    
    document.body.appendChild(tooltip);
}

// 隐藏工具提示
function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// 复制到剪贴板
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            alert('已复制到剪贴板');
        })
        .catch(err => {
            console.error('复制失败:', err);
            alert('复制失败');
        });
}

// 格式化日期
function formatDate(date) {
    return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 数字格式化
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}