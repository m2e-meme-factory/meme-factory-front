#!/bin/bash

# Run the build command
yarn build || { echo "Build failed"; exit 1; }

# Check if the build was successful and the build directory exists
if [ -d "./build" ]; then
  # Check if product-build directory already exists
  if [ -d "./product-build" ]; then
    # Remove the existing product-build directory
    rm -rf ./product-build || { echo "Failed to remove existing product-build directory"; exit 1; }
    echo "Existing product-build directory removed"
  fi
  
  # Rename the build directory to product-build
  mv ./build ./product-build
  echo "Build directory renamed to product-build"
else
  echo "Build directory not found"
  exit 1
fi
