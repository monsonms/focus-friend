#!/bin/bash
set -euo pipefail

# Bundles macOS keychain certs into a single PEM and configures Node/Expo to trust it.
# This helps with Netskope TLS inspection issues (SELF_SIGNED_CERT_IN_CHAIN).

BUNDLE_PATH="/tmp/netskope-ca-bundle.pem"

echo "Creating/refreshing certificate bundle at: $BUNDLE_PATH"
security find-certificate -a -p \
  /System/Library/Keychains/SystemRootCertificates.keychain \
  /Library/Keychains/System.keychain \
  > "$BUNDLE_PATH"

if [ ! -s "$BUNDLE_PATH" ]; then
  echo "ERROR: Bundle file is empty: $BUNDLE_PATH"
  exit 1
fi

# Pick an rc file to persist env vars
RCFILE=""
if [ -f "$HOME/.zshrc" ]; then
  RCFILE="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
  RCFILE="$HOME/.bashrc"
elif [ -f "$HOME/.zprofile" ]; then
  RCFILE="$HOME/.zprofile"
else
  echo "ERROR: No ~/.zshrc, ~/.bashrc, or ~/.zprofile found. Set env vars manually."
  exit 1
fi

echo "Using RC file: $RCFILE"

# Persist NODE_EXTRA_CA_CERTS
LINE1="export NODE_EXTRA_CA_CERTS='$BUNDLE_PATH'"
if grep -q "export NODE_EXTRA_CA_CERTS=" "$RCFILE"; then
  echo "NOTE: NODE_EXTRA_CA_CERTS already present in $RCFILE (not modifying)."
  echo "      Ensure it points to: $BUNDLE_PATH"
else
  echo "$LINE1" >> "$RCFILE"
  echo "Appended: $LINE1"
fi

# Optionally also enable system CA usage if available (Node 20+ usually supports it)
# This doesn't replace NODE_EXTRA_CA_CERTS, but can help in some environments.
LINE2="export NODE_OPTIONS=\"\${NODE_OPTIONS:-} --use-system-ca\""
if grep -q "\-\-use-system-ca" "$RCFILE"; then
  echo "NOTE: --use-system-ca already present in $RCFILE"
else
  echo "$LINE2" >> "$RCFILE"
  echo "Appended: $LINE2"
fi

# Apply for current shell session too
export NODE_EXTRA_CA_CERTS="$BUNDLE_PATH"

# Only set NODE_OPTIONS if node supports it
if node --help 2>/dev/null | grep -q -- "--use-system-ca"; then
  export NODE_OPTIONS="${NODE_OPTIONS:-} --use-system-ca"
fi

echo "Verifying Node fetch..."
node -e "fetch('https://api.expo.dev/v2/versions/latest').then(r=>console.log('status',r.status)).catch(e=>{console.error('CAUSE', e.cause || e); process.exit(1);})"

echo "OK. Restart your terminal (or run: source \"$RCFILE\") then retry:"
echo "  npx expo start --ios"