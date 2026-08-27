# CLI Terminal Table & Command Center Design Rule

Whenever creating or modifying terminal scripts, CLI menus, command lists, or tabular terminal outputs:

## 1. Class-Based Architecture & PascalCase Standard
- Encapsulate logic in dedicated classes (e.g., `TerminalThemeClass`, `ScriptItemClass` or model class, `CommandParserClass`, `CommandList`).
- Use strict **PascalCase** for all class methods, attributes, properties, and parameters.
- Provide a singleton property (`Current`) and standard `if __name__ == "__main__": ClassName.Current.MethodName()` entrypoint.

## 2. Windows UTF-8 & Console Initialization
Always include at the top of the file:
```python
import os, sys

if sys.platform == "win32":
    try:
        if hasattr(sys.stdout, "reconfigure"):
            sys.stdout.reconfigure(encoding="utf-8")
        if hasattr(sys.stderr, "reconfigure"):
            sys.stderr.reconfigure(encoding="utf-8")
        os.system("")  # Enables ANSI Virtual Terminal Processing
    except Exception:
        pass
```

## 3. Visual Styling & Color Tokens
- Use Unicode rounded box drawing glyphs (`╭ ╮ ╰ ╯ ─ │ ┼ ├ ┤ ┬ ┴ ◆ ➜`).
- Apply the AssetSphere ANSI palette:
  - Header Banner: Primary Blue (`\033[38;2;12;32;134m` / `#0C2086`) border + Bold Cyan (`\033[38;2;6;182;212m` / `#06B6D4`) title + Slate Muted subtext.
  - Category Badge: Bold Emerald (`\033[38;2;16;185;129m` / `#10B981`) glyph (`◆`) + uppercase category name + script count.
  - Commands / Aliases: Cyan (`\033[38;2;6;182;212m`).
  - Target / Workspace: Amber (`\033[38;2;245;158;11m`) / Rose (`\033[38;2;244;63;94m`) / Slate based on domain.
  - Descriptions: Text Light (`\033[38;2;248;250;252m`).
  - Borders & Separators: Slate Dark (`\033[38;2;71;85;105m`).

## 4. Dynamic Auto-Fitting
- Automatically compute column widths dynamically with bounds (`col1_w`, `col2_w`, `col3_w`) based on content length and terminal width (`os.get_terminal_size()`) to ensure zero truncation across terminal widths (80–130 cols).
```
