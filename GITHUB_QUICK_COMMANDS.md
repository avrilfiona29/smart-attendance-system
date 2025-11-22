# 🚀 GitHub Quick Commands

## First Time Setup

```bash
# 1. Initialize git
git init

# 2. Configure identity (one time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 3. Add all files
git add .

# 4. First commit
git commit -m "Initial commit: Smart Attendance System v2.0"

# 5. Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/smart-attendance-system.git

# 6. Push to GitHub
git push -u origin main
```

## If You Get "master" Branch Error

```bash
git branch -M main
git push -u origin main
```

## Daily Workflow

```bash
# 1. Check status
git status

# 2. Add changes
git add .

# 3. Commit
git commit -m "Your message here"

# 4. Push
git push
```

## Common Commands

```bash
# View history
git log --oneline

# Undo changes (before commit)
git checkout -- filename

# Pull latest changes
git pull

# View remote URL
git remote -v

# Create branch
git checkout -b feature-name

# Switch branch
git checkout main
```

## Troubleshooting

```bash
# If push fails, pull first
git pull
git push

# Remove file from git (keep local)
git rm --cached filename

# Reset to last commit
git reset --hard HEAD
```

---

**That's it! Simple and quick. 🎉**
