from pathlib import Path
import re

# Folder containing this script
folder = Path(__file__).resolve().parent

# Match filenames like: im (23).png
pattern = re.compile(r"im \((\d+)\)(\.[a-zA-Z0-9]+)$")

# First collect all renames
renames = []

for file in folder.iterdir():
    if not file.is_file():
        continue

    match = pattern.fullmatch(file.name)
    if not match:
        continue

    number = int(match.group(1))
    extension = match.group(2)

    # Only process files 23 to 43
    if 23 <= number <= 43:
        new_number = number - 1
        new_name = f"im ({new_number}){extension}"
        new_path = folder / new_name

        renames.append((file, new_path))

# Sort ascending: 23->22, 24->23, ...
renames.sort(key=lambda x: int(pattern.fullmatch(x[0].name).group(1)))

# Perform renames
for old_path, new_path in renames:
    print(f"{old_path.name} -> {new_path.name}")
    old_path.rename(new_path)

print("Done!")