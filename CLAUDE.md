# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based GitHub Pages site for "Awesome AI for EDA" - a curated paper list of Artificial Intelligence for Electronic Design Automation studies. The site is built with Ruby 3.3.1 and uses Jekyll for static site generation.

## Build and Development Commands

### Local Development
```bash
# Install dependencies
bundle install

# Start local development server
bundle exec jekyll serve

# Build the site (outputs to _site/)
bundle exec jekyll build
```

### Validation and Testing
```bash
# Validate HTML/CSS/XML for W3C compliance
bundle exec ./validate.rb

# The validation script checks all files in _site/ directory
# It validates HTML, XML, and CSS files using W3C validators
# Some files are excluded from validation (see IGNORED_FILES in validate.rb)
```

### Dependencies Management
```bash
# Update Bower dependencies (front-end packages)
./update-vendor-deps.sh

# Install Bower dependencies
bower install
```

## Architecture

### Site Configuration
- **Jekyll Config**: `_config.yml` contains main site configuration including plugins, markdown processor, and build settings
- **Ruby Dependencies**: `Gemfile` defines Jekyll and GitHub Pages dependencies
- **Front-end Dependencies**: `bower.json` manages JavaScript/CSS libraries including Bootstrap, Font Awesome, jQuery, and academic icons

### Key Files and Directories
- **`_site/`**: Generated static site (output directory)
- **`validate.rb`**: W3C compliance validation script that checks HTML, CSS, and XML files
- **`.travis.yml`**: CI configuration that builds site and runs validation on Travis CI
- **`update-vendor-deps.sh`**: Script to update Bower dependencies

### Validation System
The project includes a comprehensive W3C validation system:
- HTML files are validated with HTML5 validator
- CSS files are validated with W3C CSS validator
- XML files (including feeds) are validated with appropriate XML validators
- The validation script maintains counts of passed/failed validations
- Certain third-party CSS files are excluded from validation

### Exclusions from Build
The following are excluded from the Jekyll build (as defined in `_config.yml`):
- `.travis.yml`, `validate.rb`, `README.md`
- `Gemfile`, `Gemfile.lock`
- `bower_components`, vendor directories
- `update-vendor-deps.sh`

## Ruby Environment
- Ruby version: 3.3.1 (as specified in README)
- Uses GitHub Pages gem for Jekyll
- Includes SEO optimization plugins: jekyll-sitemap, jekyll-seo-tag, jekyll-github-metadata