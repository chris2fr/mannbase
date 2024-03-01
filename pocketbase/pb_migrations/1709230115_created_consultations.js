/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ns9rzw8zxocaqch",
    "created": "2024-02-29 18:08:35.328Z",
    "updated": "2024-02-29 18:08:35.328Z",
    "name": "consultations",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "cvoggb0n",
        "name": "user",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "rdvpqqvj",
        "name": "quand",
        "type": "date",
        "required": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "nzctbly4",
        "name": "notes",
        "type": "editor",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("ns9rzw8zxocaqch");

  return dao.deleteCollection(collection);
})
