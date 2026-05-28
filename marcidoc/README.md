# MARCI-DOC — MVP React Native

## Démarrage rapide

```bash
# 1. Installe les dépendances
npm install

# 2. Lance l'app
npx expo start

# Scan le QR avec Expo Go (Android/iOS)
```

## Structure du projet

```
marcidoc/
├── App.js
├── src/
│   ├── theme.js                  ← couleurs, fonts, radius
│   ├── navigation/
│   │   └── AppNavigator.js       ← Stack + Bottom Tabs
│   ├── services/
│   │   └── api.js                ← tous les appels FastAPI
│   └── screens/
│       ├── LoginScreen.js
│       ├── HomeScreen.js
│       ├── DossierScreen.js
│       ├── ExamensScreen.js
│       ├── MedicamentsScreen.js
│       └── ProfilScreen.js
```

## Configuration API

Dans `src/services/api.js`, remplace :
```js
const BASE_URL = 'https://api.marcidoc.ga/v1';
```

## Endpoints FastAPI attendus

### Auth
| Méthode | Route | Body / Params |
|---------|-------|---------------|
| POST | `/auth/login` | `{ email, password }` → `{ access_token }` |
| POST | `/auth/register` | `{ prenom, nom, email, password, telephone }` |
| GET | `/auth/me` | — → `{ prenom, nom, email }` |

### Dossier médical
| Méthode | Route | Réponse |
|---------|-------|---------|
| GET | `/dossier` | `{ groupe_sanguin, poids, taille, date_naissance, age, contact_urgence, medecin }` |
| PATCH | `/dossier` | mise à jour partielle |
| GET | `/dossier/antecedents` | `[{ type, libelle }]` |
| POST | `/dossier/antecedents` | `{ type, libelle }` |

### Examens
| Méthode | Route | Réponse |
|---------|-------|---------|
| GET | `/examens?type=biologie` | `[{ id, titre, laboratoire, date, type, statut }]` |
| GET | `/examens/{id}` | détail d'un examen |
| GET | `/examens/{id}/pdf` | blob PDF |
| POST | `/examens` | upload FormData |

### Médicaments
| Méthode | Route | Réponse |
|---------|-------|---------|
| GET | `/medicaments/ordonnances` | `[{ id, nom, posologie, stock }]` |
| GET | `/medicaments/search?q=amlo` | `[{ id, nom, categorie }]` |
| GET | `/pharmacies/proches?lat=&lng=` | `[{ id, nom, adresse, distance, ouvert }]` |

## Schéma FastAPI (exemple)

```python
# main.py
from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer

app = FastAPI(title="MARCI-DOC API", version="1.0.0")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@app.post("/auth/login")
async def login(data: LoginSchema):
    # vérif base de données, retourne JWT
    return {"access_token": token, "token_type": "bearer"}

@app.get("/dossier")
async def get_dossier(token: str = Depends(oauth2_scheme)):
    # récupère le dossier du patient authentifié
    ...
```
