#!/bin/bash
npx swagger-jsdoc -d openAPI/definition.yaml ./controllers/*.ts -o openAPISpec.yaml
