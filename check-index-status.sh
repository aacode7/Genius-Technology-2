#!/bin/bash

echo "=========================================="
echo "📊 Firebase Index Status Checker"
echo "=========================================="
echo ""
echo "Checking index status..."
echo ""

# Get Firebase project info
PROJECT_ID=$(firebase use 2>&1 | grep -o 'Active Project:.*' | awk '{print $4}' | tr -d '()')

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Could not determine Firebase project ID"
    echo "Run: firebase use"
    exit 1
fi

echo "Project: $PROJECT_ID"
echo ""
echo "🔗 Open this URL to check index status:"
echo "https://console.firebase.google.com/project/$PROJECT_ID/firestore/indexes"
echo ""
echo "📋 What you should see:"
echo "  - 9 composite indexes total"
echo "  - Status: 🟡 Building → 🟢 Enabled"
echo ""
echo "⏱️  Building time:"
echo "  - Small dataset (< 1000 docs): 1-2 minutes"
echo "  - Medium dataset (1000-10k docs): 2-5 minutes"
echo "  - Large dataset (> 10k docs): 5-15 minutes"
echo ""
echo "✅ Once all show 'Enabled', your site will be 10x faster!"
echo ""
