import re

with open('src/css/main.css', 'r') as f:
    css = f.read()

# We want to replace font-size: Xpx; with font-size: calc(Xpx * var(--global-text-scale, 1));
# But exclude lines that have 'icon', 'logo', 'material-icons'
lines = css.split('\n')
new_lines = []
for line in lines:
    if 'font-size' in line and not any(skip in line.lower() for skip in ['icon', 'logo', 'material-symbols']):
        # Find all font-size declarations. 
        # Example: font-size: 14px; or font-size: 1.5rem;
        # Handle cases like `font-size: var(--text-body);` -> skip or wrap? calc(var(--text-body) * scale)
        def repl(match):
            val = match.group(1).strip()
            # If it's already a calc, skip it to avoid nesting issues or just wrap it?
            if 'calc' in val:
                return match.group(0)
            if 'var(--' in val:
                return f"font-size: calc({val} * var(--global-text-scale, 1))"
            if 'px' in val or 'rem' in val or 'em' in val:
                return f"font-size: calc({val} * var(--global-text-scale, 1))"
            return match.group(0)
        
        new_line = re.sub(r'font-size:\s*([^;\}]+)', repl, line)
        new_lines.append(new_line)
    else:
        new_lines.append(line)

with open('src/css/main.css.new', 'w') as f:
    f.write('\n'.join(new_lines))

print("Patched CSS generated to src/css/main.css.new")
