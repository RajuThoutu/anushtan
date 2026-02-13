#!/bin/bash

# Configuration
SOURCE_DIR=$(pwd)
DEST_DIR="../AnushtanSiddipet"

echo "🚀 Starting Admin Project Migration..."
echo "📍 Source: $SOURCE_DIR"
echo "📍 Destination: $DEST_DIR"

# 1. Create Destination Directory
if [ -d "$DEST_DIR" ]; then
    echo "⚠️  Destination directory already exists."
else
    echo "fq Creating destination directory..."
    mkdir -p "$DEST_DIR"
fi

# 2. Sync Files (using rsync to exclude hefty/git folders)
echo "📦 Copying files (excluding node_modules, .next, .git)..."
rsync -av \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude '.venv' \
    --exclude '.DS_Store' \
    "$SOURCE_DIR/" "$DEST_DIR/"

# 3. Success Message
echo "✅ Migration files copied successfully!"
echo "👉 Next Steps:"
echo "   1. Open a new terminal window."
echo "   2. cd $DEST_DIR"
echo "   3. npm install"
echo "   4. npm run dev"
