# Personal Website Adaptation Guide

This guide explains how to adapt the "Awesome AI for EDA" Jekyll template into a personal website with minimal necessary changes.

## Overview

The current site is a curated paper list for AI in Electronic Design Automation. To convert it to a personal website, you'll need to modify branding, content, and configuration while preserving the Jekyll structure and styling.

## Required Changes

### 1. Configuration Files

#### `_config.yml`
```yaml
# Update these fields:
name: Your Name
title: Your Name - Personal Website
description: Brief description about you and your website
url: https://yourusername.github.io
repository: yourusername/yourusername.github.io
twitter: your_twitter_handle  # optional

# Remove or update SEO tagline:
tagline: Your professional title | Your interests | Keywords for SEO
```

#### `bower.json`
```json
{
  "name": "yourname.github.io",
  "homepage": "https://github.com/yourusername/yourusername.github.io",
  "authors": ["Your Name <your.email@example.com>"]
}
```

### 2. Site Identity and Branding

#### Navigation Bar (`_layouts/base.liquid`)
- **Lines 32-34**: Update site title and logo
```liquid
<div>
    <img src="/images/profile-photo.jpg" class="img-circle"></img>
    Your Name
</div>
```

- **Lines 44-47**: Update navigation menu
```liquid
<li>
    <a href="/about">About</a>
</li>
<li>
    <a href="/blog">Blog</a>
</li>
<li>
    <a href="/projects">Projects</a>
</li>
```

- **Lines 53-69**: Update social media links
```liquid
<li>
    <a href="https://github.com/yourusername" target="_blank">
        <i class="fa fa-lg fa-github"></i></a>
</li>
<li>
    <a href="https://twitter.com/your_twitter" target="_blank">
        <i class="fa fa-lg fa-twitter"></i></a>
</li>
<li>
    <a href="https://linkedin.com/in/yourprofile" target="_blank">
        <i class="fa fa-lg fa-linkedin"></i></a>
</li>
<li>
    <a href="https://scholar.google.com/citations?user=YOUR_ID" target="_blank">
        <i class="ai ai-google-scholar"></i></a>
</li>
```

#### Homepage (`_layouts/index.liquid`)
- **Line 8**: Update main title
```liquid
<div style='font-size: 2em; color: #4582ec; font-weight: bold; padding-bottom: 0.3em;'>Your Name</div>
```

- **Lines 10-16**: Update description
```liquid
<div style='font-size: 1.2em; margin:0.5em'>
    <p style='margin-top:0.3em'>
    Your professional title or tagline
    </p>
    <p style='margin-top:0.3em'>
    Brief description of your expertise and interests.
    </p>
</div>
```

- **Lines 25-53**: Update social icons section
```liquid
<ul class="list-inline idxIcons" style='font-size: 2em; margin-top: 0.5em;'>
    <!-- Keep the social links you want, remove others -->
</ul>
```

- **Lines 54-64**: Update call-to-action section
```liquid
<div style='font-size: 1em; margin:0.5em'>
    <p>
    Welcome to my personal website!
    </p>
    <p>
    Learn more about <a href="/about">my work</a> or check out my <a href="/projects">projects</a>.
    </p>
</div>
```

- **Lines 67-71**: Update profile image
```liquid
<a href="/images/profile-photo.jpg">
    <img src="/images/profile-photo.jpg"
         style="border-radius: 20px; margin: 10px; max-width: none; width: 100%; min-height: 17em"
         alt="Profile photo."/>
</a>
```

#### Email Contact (`_layouts/index.liquid` line 43)
```liquid
<a href="mailto:your.email@example.com" target="_blank" style='text-decoration: none;'>
    <i class="fa fa-fw fa-envelope" style='font-size: 1em;'></i></a>
```

### 3. Content Pages

#### `index.md`
```markdown
---
layout: index
title: Your Name
---

Welcome to my personal website! Here you'll find information about my work, projects, and interests.

---

Last updated on {% include last-updated.txt %}.
```

### 4. Images

#### Profile Photo
- Replace `/images/logo.png` with your profile photo
- Recommended size: 400x400px
- Name it appropriately (e.g., `profile-photo.jpg`)

### 5. Optional Modifications

#### Resume Download (Uncomment and update in `_layouts/index.liquid`)
```liquid
<div style="padding: 0.3em; background-color: #4582ec; display: inline-block; border-radius: 4px; font-size: 1em;">
  <a href="data/resume.pdf" target='_blank' style='text-decoration: none;'>
    <i style='color: white' class="fa fa-download"></i>
  </a>
  <a href="data/resume.pdf" target='_blank' style='color: white; text-decoration: none;'>Resume</a>
</div>
```

#### Remove Visitor Badge
Delete or comment out lines 47-48 in `_layouts/index.liquid`:
```liquid
<!-- <li>
    <a href="https://visitorbadge.io/status?path=https%3A%2F%2Fai4eda.github.io%2F"><img src="https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fai4eda.github.io%2F&labelColor=%231863e6&countColor=%23d9e3f0" /></a>
</li> -->
```

#### Google Analytics (Update in `_layouts/base.liquid`)
Replace the Google Analytics ID (line 82-89):
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## New Pages to Create

### About Page (`about.md`)
```markdown
---
layout: singlePage
title: About
---

# About Me

Write your personal introduction here...

## Education
- Your degree details...

## Experience
- Your work experience...

## Skills
- List your technical and professional skills...
```

### Projects Page (`projects.md`)
```markdown
---
layout: singlePage
title: Projects
---

# Projects

## Project 1
Description of your first project...

## Project 2
Description of your second project...
```

## Deployment

1. **Repository Setup**
   - Create a new GitHub repository: `yourusername.github.io`
   - Push the modified code to this repository

2. **GitHub Pages**
   - Enable GitHub Pages in repository settings
   - Select source as "Deploy from a branch" → "main"
   - The site will be available at `https://yourusername.github.io`

3. **Local Development**
   ```bash
   bundle install
   bundle exec jekyll serve
   ```
   Visit `http://localhost:4000` to preview changes

## Files to Keep Unchanged

- `_layouts/base.liquid` (structure)
- `_layouts/singlePage.liquid` (page template)
- `_layouts/post.liquid` (blog post template)
- `_includes/` files (reusable components)
- CSS files in `/css/` directory
- Validation scripts (`validate.rb`, `.travis.yml`)
- `Gemfile` (Ruby dependencies)

## Summary

The main changes required are:
1. Update site configuration in `_config.yml`
2. Replace branding content in layout files
3. Update personal information and links
4. Add your profile photo
5. Create personal content pages
6. Update social media links

The Jekyll structure, styling, and build system can remain unchanged, making this a straightforward adaptation process.