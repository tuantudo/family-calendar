sed -i '' 's/\.story-content-body {/.story-content-body { font-size: calc(1.125rem * var(--text-scale, 1));/' src/css/main.css
sed -i '' 's/\.story-content-body { font-size: 1.0625rem;/\.story-content-body { font-size: calc(1.0625rem * var(--text-scale, 1));/' src/css/main.css
sed -i '' 's/\.story-content-body { font-size: 1rem;/\.story-content-body { font-size: calc(1rem * var(--text-scale, 1));/' src/css/main.css
