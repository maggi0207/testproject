{
  "compilerOptions": {
    "target": "ES6",
    "module": "ESNext",
    "moduleResolution": "node",
    "jsx": "react",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": false,  // Ensure that TypeScript is emitting the output
    "outDir": "./dist",  // Output directory
    "resolveJsonModule": true
  },
  "include": [
    "src/**/*.tsx",  // Include .tsx files in the src folder
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
