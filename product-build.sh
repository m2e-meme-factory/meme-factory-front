#!/bin/bash

# Остановить выполнение скрипта при ошибке
set -e

# Выполнение команды сборки React
echo "Starting React build..."
npm run build

# Проверка, что сборка прошла успешно
if [ -d "build" ]; then
  echo "React build completed successfully."

  # Создание папки product-build, если её не существует
  if [ ! -d "product-build" ]; then
    mkdir product-build
  fi

  # Очистка папки product-build
  rm -rf product-build/*

  # Копирование содержимого папки build в product-build
  cp -r build/* product-build/

  echo "Build files have been successfully copied to the product-build directory."
else
  echo "Build directory not found. Build process may have failed."
  exit 1
fi
