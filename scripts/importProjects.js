import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read Firebase config from firebase.js (a bit hacky but works for a one-off script)
const firebaseJsPath = path.join(__dirname, '../src/services/firebase.js');
const firebaseJsCode = fs.readFileSync(firebaseJsPath, 'utf-8');

// Extract config using regex
const configMatch = firebaseJsCode.match(/const firebaseConfig = ({[\s\S]*?});/);
if (!configMatch) {
  console.error("Could not find firebaseConfig in firebase.js");
  process.exit(1);
}

const firebaseConfigStr = configMatch[1]
  .replace(/import\.meta\.env\.VITE_FIREBASE_API_KEY/, `"${process.env.VITE_FIREBASE_API_KEY}"`)
  .replace(/import\.meta\.env\.VITE_FIREBASE_AUTH_DOMAIN/, `"${process.env.VITE_FIREBASE_AUTH_DOMAIN}"`)
  // ... wait, the current firebase.js has hardcoded keys! We can just eval it.
  
const configJsonStr = configMatch[1].replace(/(\w+):/g, '"$1":').replace(/'/g, '"');
let firebaseConfig;
try {
  firebaseConfig = JSON.parse(configJsonStr);
} catch (e) {
  // Fallback to eval since it's just a local config object
  firebaseConfig = eval(`(${configMatch[1]})`);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Read constants.js
const constantsJsPath = path.join(__dirname, '../src/utils/constants.js');
const constantsCode = fs.readFileSync(constantsJsPath, 'utf-8');

const projectsMatch = constantsCode.match(/export const PROJECTS_DATA = (\[[\s\S]*?\]);\n/);
if (!projectsMatch) {
  console.error("Could not find PROJECTS_DATA in constants.js");
  process.exit(1);
}

const projects = eval(`(${projectsMatch[1]})`);

async function importData() {
  console.log(`Starting import of ${projects.length} projects...`);
  try {
    for (const project of projects) {
      // Remove the hardcoded ID, let Firestore generate one
      const { id, ...projectData } = project;
      
      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        order: projects.indexOf(project) + 1
      });
      console.log(`Imported: ${projectData.title} with ID ${docRef.id}`);
    }
    console.log("✅ All projects imported successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error importing projects:", error);
    process.exit(1);
  }
}

importData();
