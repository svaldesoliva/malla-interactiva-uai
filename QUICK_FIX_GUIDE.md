# 🚨 QUICK FIX GUIDE - Immediate Actions

## 🔥 EMERGENCY: Fix Domain Redirect NOW (10 minutes)

### The Problem
Your site redirects to `booterman98.github.io` (the original author's site) when accessed from anywhere except localhost.

### The Cause
This line in `js/init.js` (minified, line 1):
```javascript
!function(){const e=window.location.hostname;["localhost","booterman98.github.io"].includes(e)||(window.location.href="https://booterman98.github.io/malla-interactiva/")}();
```

### The Solution (Choose One)

#### Option A: Nuclear Option (5 minutes - FASTEST)

Just delete the domain check entirely:

```bash
# 1. Open js/init.js in an editor
# 2. Delete the FIRST line (the one starting with !function)
# 3. Save the file

# OR use this one-liner:
sed -i '' '1d' js/init.js

# 4. Test immediately
npm start
# Visit http://localhost:3000 - should work

# 5. Commit
git add js/init.js
git commit -m "fix: Remove domain redirect to booterman98.github.io"
git push
```

**⚠️ Warning**: This modifies a generated file. Next time you run `npm run build`, it will be overwritten. But it works NOW.

#### Option B: Proper Fix (30 minutes)

Find the source and fix it properly:

```bash
# 1. Check if there's an unminified version in git history
git log --all --full-history --oneline -- js/init.js

# 2. Look at a previous version
git show <commit-hash>:js/init.js > init_source_backup.js

# 3. Edit init_source_backup.js to remove the domain check
# Look for lines that mention "booterman98.github.io" and delete them

# 4. Update the build script to use the fixed source
# Edit scripts/minify_dev.sh
# Find where it creates init.js and point it to your backup

# 5. Rebuild
npm run devBuild

# 6. Test
npm start

# 7. Commit both the source and the fix
git add init_source_backup.js scripts/minify_dev.sh js/init.js
git commit -m "fix: Remove domain redirect from source"
git push
```

---

## ✅ Verification Checklist

After applying the fix:

- [ ] Run `npm start`
- [ ] Open http://localhost:3000
- [ ] Page loads WITHOUT redirect
- [ ] Open browser console - no errors
- [ ] Click on a course - it marks as approved
- [ ] Refresh page - your selections persist
- [ ] Visit /ica/ page - works
- [ ] Visit /personalizar/ page - works

If ALL of the above work → SUCCESS! 🎉

---

## 🚀 Deploy to GitHub Pages

```bash
# After fixing, deploy:
git push origin master

# GitHub Pages will auto-deploy from master branch
# Wait 1-2 minutes, then visit:
# https://svaldes.github.io/malla-interactiva-uai/

# Should now work WITHOUT redirecting!
```

---

## 🆘 If Something Breaks

```bash
# Undo everything:
git checkout js/init.js
npm run devBuild
npm start

# Start fresh from this guide
```

---

## 📖 After the Quick Fix

The quick fix gets your site working immediately, but you should follow the full **CRITICAL_FIXES_PLAN.md** to:

1. Properly separate source from build files
2. Fix the build system permanently
3. Update .gitignore to prevent this issue again
4. Remove all USM references and simplify for UAI

**Read**: `CRITICAL_FIXES_PLAN.md` for the complete solution.

---

## 🎯 What This Fix Does

- ✅ Removes the check that forces redirect to booterman98.github.io
- ✅ Allows your site to work on svaldes.github.io
- ✅ Allows your site to work on any custom domain
- ✅ Takes 5-10 minutes
- ✅ You can deploy IMMEDIATELY

## ⚠️ What This Fix Doesn't Do

- ❌ Doesn't fix the root cause (generated files in git)
- ❌ Doesn't prevent the issue from coming back on next build
- ❌ Doesn't clean up the codebase
- ❌ Doesn't remove USM references

For those improvements, follow **CRITICAL_FIXES_PLAN.md**.

---

## 💡 Pro Tip

After doing the quick fix, create a new branch for the proper fix:

```bash
# Quick fix done? Good! Now:
git checkout -b fix/proper-build-system

# Follow CRITICAL_FIXES_PLAN.md on this branch
# Test thoroughly
# When ready, merge to master

git checkout master
git merge fix/proper-build-system
git push
```

This way you can:
- Keep your site working (quick fix in master)
- Work on proper improvements (new branch)
- Merge when ready (after testing)

---

**Need help?** Check `CRITICAL_FIXES_PLAN.md` for detailed explanations.
