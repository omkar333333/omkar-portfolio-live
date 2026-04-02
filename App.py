import os
from datetime import datetime
from flask import Flask, render_template, jsonify, request, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_caching import Cache
from flask_mail import Mail
from flask_compress import Compress
# Use python-dotenv to handle env vars easily in dev, but it won't crash in production
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = Flask(__name__)

# Config settings (Production Ready)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'omkar-portfolio-secret-2027')
app.config['CACHE_TYPE'] = 'SimpleCache'
# Prefer POSTGRES_URL/DATABASE_URL if available (for Render/Vercel standard), fallback to local sqlite
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///omkar_portfolio.db')
if app.config['SQLALCHEMY_DATABASE_URI'].startswith("postgres://"):
    app.config['SQLALCHEMY_DATABASE_URI'] = app.config['SQLALCHEMY_DATABASE_URI'].replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
cache = Cache(app)
mail = Mail(app)
compress = Compress(app)

# Your Personal Information
PERSONAL_INFO = {
    'name': 'Omkar Mote',
    'profile_pic': 'profile_new.jpg', 
    'location': 'Balewadi, Pune, India',
    'phone': '+91 9322913731',
    'email': 'motebaban1982@gmail.com',
    'university': 'Savitribai Phule Pune University',
    'college': 'Genba Sopanrao Moze College of Engineering, Balewadi',
    'degree': 'Bachelor of Engineering in Artificial Intelligence And Data Science',
    'graduation_year': '2027',
    'current_semester': 'TE (Third Year)',
    'cgpa': '8.09',
    'semester_grades': [
        {'semester': 1, 'sgpa': 8.00},
        {'semester': 2, 'sgpa': 8.32},
        {'semester': 3, 'sgpa': 8.00},
        {'semester': 4, 'sgpa': 8.32},
        {'semester': 5, 'sgpa': 7.81}
    ],
    'about': """Strong foundation in Python and C++, complemented by project planning expertise. 
                Successfully applied color theory and artistic skills in previous roles, enhancing 
                visual presentations. Proven ability to analyze data using probability and statistics, 
                demonstrating both technical proficiency and effective communication. Eager to leverage 
                these skills in future opportunities."""
}

# Your Skills from Resume
SKILLS = {
    'programming': [
        {'name': 'Python', 'proficiency': 90, 'icon': 'fab fa-python'},
        {'name': 'C++', 'proficiency': 85, 'icon': 'fas fa-code'},
        {'name': 'DSA', 'proficiency': 80, 'icon': 'fas fa-sitemap'},
        {'name': 'MySQL', 'proficiency': 78, 'icon': 'fas fa-database'},
        {'name': 'PHP', 'proficiency': 72, 'icon': 'fab fa-php'},
        {'name': 'Ruby', 'proficiency': 65, 'icon': 'fas fa-gem'}
    ],
    'creative': [
        {'name': 'Color Theory', 'proficiency': 88, 'icon': 'fas fa-palette'},
        {'name': 'Charcoal Painting', 'proficiency': 85, 'icon': 'fas fa-paint-brush'},
        {'name': 'Oil Painting', 'proficiency': 82, 'icon': 'fas fa-paint-roller'}
    ],
    'analytical': [
        {'name': 'Probability & Statistics', 'proficiency': 87, 'icon': 'fas fa-chart-line'},
        {'name': 'Data Analysis', 'proficiency': 85, 'icon': 'fas fa-chart-bar'},
        {'name': 'Project Planning', 'proficiency': 88, 'icon': 'fas fa-tasks'}
    ],
    'soft_skills': [
        {'name': 'Communication', 'proficiency': 90, 'icon': 'fas fa-comments'},
        {'name': 'Rhetorical Skills', 'proficiency': 85, 'icon': 'fas fa-microphone'},
        {'name': 'Technical Proficiency', 'proficiency': 88, 'icon': 'fas fa-laptop-code'}
    ]
}

# Sample Projects (AI/Data Science focused)
PROJECTS = [
    {
        'id': 1,
        'title': 'AI-Powered Data Visualization',
        'description': 'Interactive dashboard for analyzing semester-wise academic performance using Python and statistical methods.',
        'long_description': 'Developed a comprehensive data visualization tool that tracks CGPA progression, analyzes subject-wise performance, and predicts future academic outcomes using probability models.',
        'image': '/static/images/data_science_project.png',
        'technologies': ['Python', 'Pandas', 'Matplotlib', 'Statistics', 'Flask'],
        'category': 'data-science',
        'featured': True,
        'github': 'https://github.com/omkarmote/academic-analytics',
        'live': '#'
    },
    {
        'id': 2,
        'title': 'Color Theory in Digital Art',
        'description': 'Digital art platform combining C++ algorithms with color theory principles for enhanced visual presentations.',
        'long_description': 'Created an application that applies color theory algorithms to generate harmonious color palettes for digital artists, incorporating probability distributions for color selection.',
        'image': '/static/images/creative_tech_project.png',
        'technologies': ['C++', 'OpenGL', 'Color Theory', 'Algorithms'],
        'category': 'creative-tech',
        'featured': True,
        'github': 'https://github.com/omkarmote/color-theory-tool',
        'live': '#'
    },
    {
        'id': 3,
        'title': 'Statistical Analysis Engine',
        'description': 'Python-based statistical analysis tool for engineering data with probability modeling.',
        'long_description': 'Built a comprehensive statistical analysis library implementing various probability distributions, hypothesis testing, and regression analysis for engineering applications.',
        'image': '/static/images/data_science_project.png',
        'technologies': ['Python', 'NumPy', 'SciPy', 'Statistics', 'Probability'],
        'category': 'data-science',
        'featured': True,
        'github': 'https://github.com/omkarmote/stats-engine',
        'live': '#'
    },
    {
        'id': 4,
        'title': 'DSA Visualizer',
        'description': 'Interactive visualization tool for Data Structures and Algorithms using C++ and Python.',
        'long_description': 'Developed an educational platform that visualizes complex data structures and algorithms, making DSA concepts easier to understand through animations.',
        'image': '/static/images/dsa_visualizer.png',
        'technologies': ['C++', 'Python', 'DSA', 'OpenCV'],
        'category': 'education',
        'featured': False,
        'github': 'https://github.com/omkarmote/dsa-visualizer',
        'live': '#'
    }
]

# Education Timeline
EDUCATION = [
    {
        'degree': 'Bachelor of Engineering in Artificial Intelligence And Data Science',
        'institution': 'Genba Sopanrao Moze College of Engineering, Balewadi',
        'university': 'Savitribai Phule Pune University',
        'period': '2023 - 2027',
        'status': 'TE Student (Third Year)',
        'cgpa': '8.09',
        'highlights': [
            'Semester 1: 8.00 CGPA',
            'Semester 2: 8.32 CGPA',
            'Semester 3: 8.00 CGPA',
            'Semester 4: 8.32 CGPA',
            'Semester 5: 7.81 CGPA',
            'Consistent academic performance with cumulative 8.09 CGPA'
        ],
        'image': '/static/images/education_image.png'
    }
]

@app.context_processor
def inject_globals():
    return {
        'current_year': datetime.now().year,
        'personal_info': PERSONAL_INFO
    }

@app.route('/')
def index():
    return render_template('index.html', 
                         active_page='home',
                         personal_info=PERSONAL_INFO,
                         featured_projects=[p for p in PROJECTS if p['featured']][:3])

@app.route('/about')
def about():
    return render_template('about.html', 
                         active_page='about',
                         personal_info=PERSONAL_INFO,
                         education=EDUCATION,
                         skills=SKILLS)

@app.route('/projects')
def projects():
    category = request.args.get('category', 'all')
    if category == 'all':
        filtered_projects = PROJECTS
    else:
        filtered_projects = [p for p in PROJECTS if p['category'] == category]
    return render_template('projects.html', 
                         active_page='projects',
                         projects=filtered_projects,
                         categories=['all', 'data-science', 'creative-tech', 'education'])

@app.route('/contact')
def contact():
    return render_template('contact.html', active_page='contact')

# API Routes
@app.route('/api/skills')
@cache.cached(timeout=3600)
def get_skills():
    return jsonify(SKILLS)

@app.route('/api/projects')
def get_projects():
    return jsonify(PROJECTS)

@app.route('/api/education')
def get_education():
    return jsonify(EDUCATION)

@app.route('/api/semester-performance')
def get_semester_performance():
    """Get semester-wise performance data for charts"""
    data = {
        'semesters': [1, 2, 3, 4, 5],
        'sgpa': [8.00, 8.32, 8.00, 8.32, 7.81],
        'cgpa': [8.00, 8.16, 8.11, 8.16, 8.09]
    }
    return jsonify(data)

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.json
    # Here you would typically save to database and send email
    return jsonify({'status': 'success', 'message': 'Message received!'})

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))