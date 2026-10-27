from pathlib import Path
import subprocess
import sys
import json
import hashlib
from datetime import datetime, timezone

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[1]
(ROOT / "docs").mkdir(exist_ok=True)
commands = [
    [sys.executable, "-m", "pytest", "-q", "--tb=short", "-p", "no:cacheprovider", "tests"],
    [sys.executable, "-X", "utf8", "-m", "genvm_linter.cli", "check", "contracts/packet_vote.py"],
    [sys.executable, "-X", "utf8", "-m", "genvm_linter.cli", "schema", "contracts/packet_vote.py", "-o", "docs/schema.json"],
]
record = {"checked_at": datetime.now(timezone.utc).isoformat(),
    "scope": "Local controlled production-entrypoint tests and linter/schema; NOT live GenVM consensus",
    "python": sys.version, "source_sha256": hashlib.sha256((ROOT / "contracts/packet_vote.py").read_bytes()).hexdigest(),
    "samples": {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted((ROOT / "samples").glob("*.json"))}, "commands": []}
for command in commands:
    print("$", " ".join(command), flush=True)
    result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace")
    print(result.stdout, end="")
    print(result.stderr, end="", file=sys.stderr)
    record["commands"].append({"command": command, "exit_code": result.returncode, "stdout": result.stdout, "stderr": result.stderr})
    (ROOT / "docs/local-verification.json").write_text(json.dumps(record, indent=2)+"\n", encoding="utf-8")
    if result.returncode:
        raise SystemExit(result.returncode)
