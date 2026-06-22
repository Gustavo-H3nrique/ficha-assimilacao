css_path = r"C:\Users\lpfon\.gemini\antigravity-ide\brain\500ef541-0d9c-45cd-96b6-9a8aa51e4c70\.system_generated\steps\356\content.md"

with open(css_path, "r", encoding="utf-8") as f:
    content = f.read()

print("CSS Length:", len(content))
print("First 2000 chars of content:")
print(content[:2000])

# Let's search for some patterns
import re
print("\nSearching for color codes (hex):")
hex_codes = set(re.findall(r"#[a-fA-F0-9]{3,6}", content))
print("Found hex codes:", hex_codes)

print("\nSearching for `:root` or `html` or `body` declarations:")
for m in re.finditer(r"(:root|html|body)\s*\{([^}]+)\}", content):
    print(m.group(1), "->", m.group(2)[:200])
