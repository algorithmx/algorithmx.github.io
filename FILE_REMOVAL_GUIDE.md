# File Removal Guide for Personal Website

This guide identifies files that can be safely removed when converting this AI for EDA project to a personal website.

## Files Safe to Remove

### 1. AI4EDA-Specific Files
- **`_includes/pub.md`** - Contains the complete publication list with AI/EDA papers (2,300+ lines). This file is no longer needed since it was removed from `index.md`.

### 2. Unused Data Files
- **`data/pub.pdf`** - Publication PDF (not referenced anywhere)
- **`data/bdamos_pgp.asc`** - PGP key file (only referenced in `pgp.md`)

### 3. Unused Images
- **`images/bibtex2html.png`** - Screenshot showing bibtex to HTML conversion (not referenced after removing pub.md)

### 4. Optional Personal Files (If Not Needed)
- **`pgp.md`** - PGP encryption page (personal preference, remove if not using PGP)
- **`blog.md`** - Blog page template (remove if not planning to have a blog)
- **`bio.md`** - Alternative bio page (remove if using about.md instead)

## Files to Keep

### Core Jekyll Files
- **`_config.yml`** - Site configuration (already updated)
- **`Gemfile`**, **`Gemfile.lock`** - Ruby dependencies
- **`_layouts/`** - Layout templates (needed for site structure)
- **`_includes/`** - Reusable components (except pub.md)
- **`bower.json`** - Front-end dependencies

### Essential Assets
- **`images/` directory** - Keep:
  - `images/hr.png` - Horizontal rule image
  - `images/profile-photo.jpg` - Your profile photo (add this)
  - `images/social/` - Social media icons (used in navigation)
- **`css/` directory** - Styling files
- **`vendor/` directory** - Third-party assets

### Content Files
- **`index.md`** - Homepage content (already updated)
- **`about.md`** - About page (already updated)
- **`404.md`** - 404 error page
- **`README.md`** - Project documentation

### Build/CI Files
- **`validate.rb`** - W3C validation script
- **`.travis.yml`** - CI configuration
- **`update-vendor-deps.sh`** - Dependency update script

### Documentation Files
- **`CLAUDE.md`** - Claude Code guidance
- **`PERSONAL_WEBSITE_GUIDE.md`** - Personal website adaptation guide
- **`FILE_REMOVAL_GUIDE.md`** - This file

## Removal Commands

### Remove AI4EDA-specific files:
```bash
rm _includes/pub.md
rm data/pub.pdf
rm data/bdamos_pgp.asc
rm images/bibtex2html.png
```

### Optional removals (if not needed):
```bash
rm pgp.md
rm blog.md
rm bio.md
```

## After Removal

1. **Add your profile photo:**
   ```bash
   # Add your profile photo as:
   images/profile-photo.jpg
   ```

2. **Test the site:**
   ```bash
   bundle exec jekyll serve
   ```

3. **Validate the site:**
   ```bash
   bundle exec jekyll build
   bundle exec ./validate.rb
   ```

## Space Savings

Removing the identified files will save approximately:
- **`_includes/pub.md`**: ~80KB (2,300+ lines of content)
- **Data files**: ~50KB
- **Images**: ~20KB
- **Total**: ~150KB of unnecessary content

## Notes

- The removed publication content was ~2,300 lines of academic paper listings
- Social media icons in `images/social/` are kept as they're used in the navigation
- Core Jekyll and Bootstrap styling is preserved
- The site will still build and validate correctly after removal