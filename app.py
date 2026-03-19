"""
人才管理平台 Flask 应用
完整功能系统
"""
from flask import Flask, render_template, request, jsonify, redirect, url_for
import json
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'talent_platform_secret_key_2026'

# 模拟数据库
class TalentDatabase:
    def __init__(self):
        self.candidates = [
            {
                'id': 1,
                'name': '张三',
                'position': '前端开发工程师',
                'experience': '3年',
                'education': '本科',
                'location': '北京',
                'match_score': 85,
                'status': '待面试',
                'skills': ['HTML5', 'CSS3', 'JavaScript', 'Vue.js', 'React'],
                'last_updated': '2026-03-19'
            },
            {
                'id': 2,
                'name': '李四',
                'position': '后端开发工程师',
                'experience': '5年',
                'education': '硕士',
                'location': '上海',
                'match_score': 92,
                'status': '已录用',
                'skills': ['Python', 'Django', 'MySQL', 'Redis', 'Docker'],
                'last_updated': '2026-03-18'
            },
            {
                'id': 3,
                'name': '王五',
                'position': '产品经理',
                'experience': '4年',
                'education': '本科',
                'location': '深圳',
                'match_score': 78,
                'status': '面试中',
                'skills': ['用户研究', '产品设计', '数据分析', '项目管理'],
                'last_updated': '2026-03-19'
            },
            {
                'id': 4,
                'name': '赵六',
                'position': 'UI设计师',
                'experience': '2年',
                'education': '专科',
                'location': '广州',
                'match_score': 72,
                'status': '待评估',
                'skills': ['Figma', 'Sketch', 'Photoshop', 'UI/UX设计'],
                'last_updated': '2026-03-17'
            },
            {
                'id': 5,
                'name': '钱七',
                'position': '数据科学家',
                'experience': '6年',
                'education': '博士',
                'location': '杭州',
                'match_score': 95,
                'status': '已录用',
                'skills': ['Python', '机器学习', '深度学习', 'TensorFlow', 'SQL'],
                'last_updated': '2026-03-16'
            }
        ]
        
        self.jobs = [
            {'id': 1, 'title': '前端开发工程师', 'department': '技术部', 'location': '北京', 'open_positions': 3},
            {'id': 2, 'title': '后端开发工程师', 'department': '技术部', 'location': '上海', 'open_positions': 2},
            {'id': 3, 'title': '产品经理', 'department': '产品部', 'location': '深圳', 'open_positions': 1},
            {'id': 4, 'title': 'UI设计师', 'department': '设计部', 'location': '广州', 'open_positions': 2},
            {'id': 5, 'title': '数据科学家', 'department': '数据部', 'location': '杭州', 'open_positions': 1},
        ]
    
    def get_all_candidates(self):
        return self.candidates
    
    def get_candidate(self, candidate_id):
        for candidate in self.candidates:
            if candidate['id'] == candidate_id:
                return candidate
        return None
    
    def add_candidate(self, candidate_data):
        new_id = max([c['id'] for c in self.candidates]) + 1
        candidate_data['id'] = new_id
        candidate_data['last_updated'] = datetime.now().strftime('%Y-%m-%d')
        self.candidates.append(candidate_data)
        return candidate_data
    
    def update_candidate(self, candidate_id, update_data):
        for i, candidate in enumerate(self.candidates):
            if candidate['id'] == candidate_id:
                self.candidates[i].update(update_data)
                self.candidates[i]['last_updated'] = datetime.now().strftime('%Y-%m-%d')
                return self.candidates[i]
        return None
    
    def get_all_jobs(self):
        return self.jobs
    
    def search_candidates(self, query):
        results = []
        query_lower = query.lower()
        for candidate in self.candidates:
            if (query_lower in candidate['name'].lower() or 
                query_lower in candidate['position'].lower() or 
                any(query_lower in skill.lower() for skill in candidate['skills'])):
                results.append(candidate)
        return results

# 初始化数据库
db = TalentDatabase()

@app.route('/')
def index():
    """首页 - 仪表板"""
    stats = {
        'total_candidates': len(db.candidates),
        'hired_count': len([c for c in db.candidates if c['status'] == '已录用']),
        'interview_count': len([c for c in db.candidates if c['status'] in ['待面试', '面试中']]),
        'avg_match_score': round(sum([c['match_score'] for c in db.candidates]) / len(db.candidates), 1),
        'open_positions': sum([job['open_positions'] for job in db.jobs])
    }
    return render_template('index.html', stats=stats, candidates=db.candidates[:5])

@app.route('/candidates')
def candidates():
    """候选人列表页面"""
    candidates = db.get_all_candidates()
    return render_template('candidates.html', candidates=candidates)

@app.route('/candidate/<int:candidate_id>')
def candidate_detail(candidate_id):
    """候选人详情页面"""
    candidate = db.get_candidate(candidate_id)
    if candidate:
        return render_template('candidate_detail.html', candidate=candidate)
    return redirect(url_for('candidates'))

@app.route('/jobs')
def jobs():
    """职位列表页面"""
    jobs = db.get_all_jobs()
    return render_template('jobs.html', jobs=jobs)

@app.route('/api/candidates')
def api_candidates():
    """API: 获取所有候选人"""
    return jsonify(db.get_all_candidates())

@app.route('/api/candidates/search')
def api_search_candidates():
    """API: 搜索候选人"""
    query = request.args.get('q', '')
    if query:
        results = db.search_candidates(query)
        return jsonify(results)
    return jsonify([])

@app.route('/api/stats')
def api_stats():
    """API: 获取统计数据"""
    stats = {
        'total_candidates': len(db.candidates),
        'hired_count': len([c for c in db.candidates if c['status'] == '已录用']),
        'interview_count': len([c for c in db.candidates if c['status'] in ['待面试', '面试中']]),
        'avg_match_score': round(sum([c['match_score'] for c in db.candidates]) / len(db.candidates), 1),
        'open_positions': sum([job['open_positions'] for job in db.jobs])
    }
    return jsonify(stats)

@app.route('/health')
def health_check():
    """健康检查接口"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)