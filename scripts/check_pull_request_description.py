"""Fail when a pull request description breaks the PR description standard.

Reads the description from the PULL_REQUEST_BODY environment variable.
"""
import os
import re
import sys

REQUIRED_HEADINGS = [
    "**TL;DR:**",
    "Filed by:",
    "## Why",
    "## What changed",
    "## Proof",
    "## Risk and veto",
    "## Cost",
]


def find_problems(body):
    problems = []
    lines = [line.strip() for line in body.replace("\r\n", "\n").split("\n")]
    position = -1
    for heading in REQUIRED_HEADINGS:
        matches = [index for index, line in enumerate(lines) if line.startswith(heading)]
        if not matches:
            problems.append(f"Missing required heading: {heading}")
            continue
        later = [index for index in matches if index > position]
        if not later:
            problems.append(f"Heading out of order: {heading}")
            continue
        position = later[0]
    if "## Why" in lines:
        start = lines.index("## Why") + 1
        section = []
        for line in lines[start:]:
            if line.startswith("## "):
                break
            if line and not (line.startswith("<!--") and line.endswith("-->")):
                section.append(line)
        if not section:
            problems.append("The Why section is empty")
    if "## Cost" in lines:
        cost = []
        for line in lines[lines.index("## Cost") + 1:]:
            if line.startswith("## "):
                break
            cost.append(line)
        for label in ("Usage cost ($)", "Financial impact ($)"):
            rows = [line for line in cost if line.startswith("|") and label.lower() in line.lower()]
            if not rows:
                problems.append(f"Cost table is missing the {label} row")
                continue
            cells = [cell.strip() for cell in rows[0].strip("|").split("|")[1:]]
            for cell in cells[:2]:
                if not re.search(r"\$\s*\d", cell) or re.search(r"(?i)\bn/?a\b|\$0 marginal|not measured", cell):
                    problems.append(f"{label} needs a real $ figure, got: {cell or 'blank'}")
    end = len(lines)
    if "## Cost" in lines:
        for index in range(lines.index("## Cost") + 1, len(lines)):
            if lines[index].startswith("## "):
                end = index
                break
    required = re.sub(r"<!--.*?-->", "", "\n".join(lines[:end]), flags=re.S)
    for placeholder in re.findall(r"<[^<>\n]+>", required):
        if not re.match(r"</?(img|br|a|p|sub|sup|details|summary)\b", placeholder, re.I):
            problems.append(f"Unfilled placeholder: {placeholder}")
    for line in lines:
        text = line.strip("`*- ")
        if re.match(r"(?i)^UI:\s*none\b", text):
            reason = re.sub(r"(?i)^UI:\s*none\s*[—–:\-]*\s*", "", text).strip("` ")
            if not reason:
                problems.append("Bare 'UI: none' needs a one-line reason after it")
    return problems


def main():
    problems = find_problems(os.environ.get("PULL_REQUEST_BODY", ""))
    for problem in problems:
        print(f"::error::{problem}")
    if problems:
        return 1
    print("PR description follows the standard.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
