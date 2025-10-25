# OpenPage Terminal - Requirements Specification

## Overview
A terminal-style personal website that mimics btop/htop behavior with full-screen page views, keyboard navigation, and dynamic content loading.

## Current Implementation (Phase 1)

### Core Features
- ✅ Boot sequence animation on page load
- ✅ Command-line interface with prompt
- ✅ Full-screen page views (btop-style)
- ✅ Dynamic title bar reflecting current location
- ✅ Keyboard navigation (arrows, tab, ESC)
- ✅ Command history (↑/↓ arrows)
- ✅ Tab completion
- ✅ Fixed terminal size (responsive)

### Pages
- **Welcome/Home**: Command interface with ASCII banner
- **About**: Personal info, bio, skills visualization
- **Hobbies/Projects**: Project cards with descriptions and tags
- **Workouts**: CrossFit stats with progress bars and graphs

### Technical Stack
- Pure HTML/CSS/JavaScript (no frameworks)
- Static files deployable to S3/CDN
- Omarchy/Tokyo Night color scheme
- Responsive design (90% viewport)

## Phase 1: Content as Data (Current)

### Objectives
- Separate content from code
- Easy content updates without touching JS
- Maintain static site compatibility
- Foundation for automation

### Structure
```
/
├── index.html
├── styles.css
├── script.js
├── /data
│   ├── about.json
│   ├── hobbies.json
│   └── workouts.json
```

### Data Format

#### about.json
```json
{
  "personal": {
    "name": "Your Name",
    "location": "Earth 🌍",
    "role": "Developer & Creator",
    "interests": "Coding, CrossFit, Building Cool Stuff",
    "currentFocus": "Creating interactive web experiences"
  },
  "bio": "Multi-paragraph bio text...",
  "skills": [
    { "name": "JavaScript", "level": 90 },
    { "name": "HTML/CSS", "level": 95 }
  ]
}
```

#### hobbies.json
```json
{
  "projects": [
    {
      "title": "Project Name",
      "description": "Project description...",
      "tags": ["JavaScript", "CSS", "UI/UX"],
      "images": []
    }
  ],
  "funActivities": [
    {
      "name": "Reading",
      "icon": "📚",
      "description": "Sci-fi novels, tech books..."
    }
  ]
}
```

#### workouts.json
```json
{
  "lastUpdated": "2025-10-25T10:30:00Z",
  "weekStats": {
    "workoutsCompleted": "5 / 6 days",
    "totalVolume": "12,450 lbs",
    "avgHeartRate": "156 bpm",
    "caloriesBurned": "3,240 kcal",
    "consistency": 83
  },
  "personalRecords": [
    { "exercise": "Back Squat", "weight": 315, "percentage": 79 },
    { "exercise": "Deadlift", "weight": 405, "percentage": 81 }
  ],
  "benchmarkWods": [
    { "name": "Fran", "time": "4:23", "percentage": 85 },
    { "name": "Murph", "time": "38:15", "percentage": 72 }
  ]
}
```

### Implementation
- Fetch JSON on page load
- Build page content dynamically from data
- Maintain existing UI/UX
- Error handling for missing data

## Phase 2: Blog System (Planned)

### Objectives
- Hugo-like workflow for blog posts
- Markdown support for content
- List/detail views
- Tag filtering
- Mouse + keyboard interaction

### Structure
```
/content
  └── /blog
      ├── first-post.md
      ├── crossfit-journey.md
      └── terminal-design.md
/data
  └── blog-index.json
```

### Blog Index Format
```json
[
  {
    "slug": "first-crossfit-competition",
    "title": "My First CrossFit Competition",
    "date": "2025-10-20",
    "excerpt": "What I learned competing for the first time...",
    "tags": ["crossfit", "competition"],
    "readTime": "5 min",
    "featured": true
  }
]
```

### Blog Commands
```bash
blog                              # List all posts
blog first-crossfit-competition   # Open specific post
blog --tag crossfit               # Filter by tag
blog --recent                     # Show recent posts
```

### Features
- Markdown rendering (marked.js ~50KB)
- Syntax highlighting for code blocks (optional)
- Mouse click to select posts
- Back navigation with ESC
- Image support in posts
- Frontmatter parsing (optional)

### Blog Post View
- Full-screen article reader
- Metadata header (date, tags, read time)
- Formatted markdown content
- Navigation hints (ESC to return)
- Scroll support for long posts

## Phase 3: Enhanced Features (Future)

### Image Galleries
- Lightbox for project images
- Gallery view for multiple images
- Lazy loading for performance
- Responsive image sizing

### Project Details
```bash
projects                    # List all projects
projects terminal-portfolio # Open project detail
```

- Full project view with:
  - Screenshots/demos
  - Detailed description
  - Tech stack
  - Links (GitHub, live demo)
  - Image carousel

### Automated Workout Updates
- Script to update workouts.json
- Integration with fitness tracking APIs
- Historical data graphs
- Progress tracking over time
- Weekly/monthly summaries

### Advanced Command Features
```bash
search <term>              # Search across all content
tags                       # List all tags
filter --tag <name>        # Filter content by tag
recent                     # Show recent updates
stats                      # Show site stats
```

### Mouse Interaction
- Click on listed items to open
- Hover effects for better UX
- Selection highlighting
- Scroll support with mouse wheel

### Theming (Optional)
- Multiple color schemes
- Theme switcher command
- Persist theme preference
- Predefined themes:
  - Omarchy (current)
  - Dracula
  - Nord
  - Gruvbox
  - Solarized

## Technical Requirements

### Performance
- Initial load < 2s
- Lazy load images
- Minimize HTTP requests
- Cache JSON data

### Accessibility
- Keyboard-only navigation
- Semantic HTML
- ARIA labels where needed
- Screen reader support

### Browser Support
- Modern browsers (ES6+)
- Chrome, Firefox, Safari, Edge
- Mobile responsive
- Touch support

### Deployment
- S3 static hosting compatible
- CDN-friendly (CloudFront)
- No build process required
- Simple file uploads

## File Structure (Complete)

```
/
├── index.html
├── styles.css
├── script.js
├── REQUIREMENTS.md           # This file
├── README.md                 # User-facing docs
│
├── /data
│   ├── about.json
│   ├── hobbies.json
│   ├── workouts.json
│   └── blog-index.json
│
├── /content
│   └── /blog
│       ├── first-post.md
│       ├── crossfit-journey.md
│       └── terminal-design.md
│
├── /images
│   ├── /projects
│   │   ├── project1-screenshot.jpg
│   │   └── project2-demo.gif
│   └── /blog
│       └── post-image.jpg
│
└── /lib (optional)
    └── marked.min.js         # Markdown parser (Phase 2+)
```

## Content Update Workflow

### About/Hobbies/Projects
1. Edit `data/*.json` files
2. Upload to S3
3. Clear CloudFront cache (if using)
4. Changes appear immediately

### Blog Posts
1. Write post in Markdown
2. Save to `content/blog/post-name.md`
3. Update `data/blog-index.json` with metadata
4. Upload both files to S3
5. Post appears in blog list

### Workout Stats
1. Run automation script (generates workouts.json)
2. Script uploads to S3
3. Data updates automatically on page

## Design Principles

1. **Simplicity**: No build process, just files
2. **Separation**: Content separate from code
3. **Maintainability**: Easy to update without coding
4. **Performance**: Fast load times, minimal dependencies
5. **Aesthetics**: Beautiful btop-style UI
6. **Usability**: Intuitive keyboard navigation
7. **Scalability**: Easy to add new content types

## Success Metrics

- Content update time < 2 minutes
- No JS editing required for content changes
- Works on all major browsers
- Mobile-friendly
- Loads in < 2 seconds
- Easy to automate content updates

## Future Considerations

- RSS feed generation
- Search functionality
- Analytics integration
- Contact form (static form service)
- Social media integration
- Comments (static comments service)
- Dark/light theme toggle
- Export/backup functionality
- Offline support (PWA)
